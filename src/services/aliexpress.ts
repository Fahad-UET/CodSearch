import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedImage } from './scraper';

export interface AliExpressProduct {
  title: string;
  description: string;
  price: {
    current: number;
    original?: number;
    currency: string;
  };
  images: ScrapedImage[];
  specs: { [key: string]: string };
  variations: {
    name: string;
    options: {
      name: string;
      image?: string;
      price?: number;
    }[];
  }[];
  shipping: {
    methods: {
      name: string;
      price: number;
      duration: string;
    }[];
    to: string;
  };
  seller: {
    name: string;
    rating?: number;
    followers?: number;
  };
  ratings: {
    average: number;
    count: number;
    distribution: { [key: string]: number };
  };
}

// Free proxy rotation
const PROXY_LIST = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://cors-anywhere.herokuapp.com/',
];

export async function scrapeAliExpressProduct(url: string): Promise<AliExpressProduct> {
  try {
    // Validate URL format
    if (!url.includes('aliexpress.com/item/')) {
      throw new Error('Invalid AliExpress product URL');
    }

    // Extract product ID from URL
    const productId = url.match(/item\/(\d+)\.html/)?.[1];
    if (!productId) {
      throw new Error('Could not extract product ID from URL');
    }

    // Try each proxy until one works
    let response = null;
    let error = null;

    for (const proxy of PROXY_LIST) {
      try {
        response = await axios.get(`${proxy}${encodeURIComponent(url)}`, {
          timeout: 15000,
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        if (response.data) break;
      } catch (e) {
        error = e;
        continue;
      }
    }

    if (!response?.data) {
      throw error || new Error('Failed to fetch product data');
    }

    const $ = cheerio.load(response.data);

    // Extract product data from JSON-LD script
    let productData = {};
    try {
      const scriptContent = $('script[type="application/ld+json"]').html();
      if (scriptContent) {
        productData = JSON.parse(scriptContent);
      }
    } catch (error) {
      console.warn('Failed to parse JSON-LD data:', error);
    }

    // Extract basic product info
    const title = $('.product-title-text').text().trim() || $('h1').first().text().trim();
    const description = $('.detail-desc-decription-content').text().trim();
    
    // Extract price
    const priceElement = $('.uniform-banner-box-price');
    const currentPrice = parseFloat(priceElement.find('.uniform-banner-box-price').text().replace(/[^0-9,.]/g, '')) || 0;
    const originalPrice = parseFloat(priceElement.find('.product-price-original').text().replace(/[^0-9,.]/g, ''));
    const currency = priceElement.find('.currency').text().trim() || 'USD';

    // Extract images
    const images: ScrapedImage[] = [];
    $('.images-view-item img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('placeholder')) {
        images.push({
          url: src.startsWith('//') ? `https:${src}` : src,
          filename: `image-${i + 1}.jpg`
        });
      }
    });

    // Extract specifications
    const specs: { [key: string]: string } = {};
    $('.product-prop-list li').each((_, el) => {
      const key = $(el).find('.property-title').text().trim();
      const value = $(el).find('.property-desc').text().trim();
      if (key && value) {
        specs[key] = value;
      }
    });

    // Extract shipping info
    const shippingMethods = $('.product-shipping-info').map((_, el) => ({
      name: $(el).find('.shipping-name').text().trim(),
      price: parseFloat($(el).find('.shipping-price').text().replace(/[^0-9,.]/g, '')) || 0,
      duration: $(el).find('.shipping-time').text().trim()
    })).get();

    // Extract seller info
    const sellerName = $('.store-name').text().trim();
    const sellerRating = parseFloat($('.store-rating').text().trim());
    const sellerFollowers = parseInt($('.store-followers').text().replace(/[^0-9]/g, ''));

    // Extract ratings
    const ratingAverage = parseFloat($('.overview-rating-average').text().trim()) || 0;
    const ratingCount = parseInt($('.overview-rating-count').text().replace(/[^0-9]/g, '')) || 0;

    // If no images found in standard selectors, try alternate selectors
    if (images.length === 0) {
      $('img[src*="alicdn"]').each((i, el) => {
        const src = $(el).attr('src');
        if (src && !src.includes('placeholder') && src.includes('_Q90')) {
          images.push({
            url: src.startsWith('//') ? `https:${src}` : src,
            filename: `image-${i + 1}.jpg`
          });
        }
      });
    }

    return {
      title: title || 'Unknown Product',
      description: description || 'No description available',
      price: {
        current: currentPrice || 0,
        original: originalPrice || undefined,
        currency: currency || 'USD'
      },
      images,
      specs,
      variations: [], // Populated if variations are found
      shipping: {
        methods: shippingMethods.length > 0 ? shippingMethods : [{
          name: 'Standard Shipping',
          price: 0,
          duration: '15-45 days'
        }],
        to: 'Worldwide'
      },
      seller: {
        name: sellerName || 'Unknown Seller',
        rating: sellerRating || undefined,
        followers: sellerFollowers || undefined
      },
      ratings: {
        average: ratingAverage || 0,
        count: ratingCount || 0,
        distribution: {}
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out - please try again');
      }
      if (error.response?.status === 404) {
        throw new Error('Product not found - please check the URL');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied - please try again later');
      }
      throw new Error(`Failed to access the product: ${error.message}`);
    }
    throw error;
  }
}