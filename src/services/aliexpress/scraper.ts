import axios from 'axios';
import * as cheerio from 'cheerio';
import { AliExpressProduct } from './types';
import { ScrapedImage } from '../scraper';

// Proxy rotation with fallbacks
const PROXY_SERVICES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?',
  'https://cors.bridged.cc/',
  'https://cors-anywhere.herokuapp.com/'
];

const HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Cookie': 'aep_usuc_f=site=glo&c_tp=USD&region=US&b_locale=en_US'
};

async function fetchWithProxyRotation(url: string) {
  let lastError;

  for (const proxy of PROXY_SERVICES) {
    try {
      const response = await axios.get(`${proxy}${encodeURIComponent(url)}`, {
        timeout: 15000,
        headers: HEADERS,
        validateStatus: (status) => status === 200
      });
      
      if (response.data) {
        return response;
      }
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  throw lastError;
}

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

    // Try direct fetch first
    let response;
    try {
      response = await axios.get(url, {
        timeout: 15000,
        headers: HEADERS
      });
    } catch (error) {
      // If direct fetch fails, try proxy rotation
      response = await fetchWithProxyRotation(url);
    }

    const $ = cheerio.load(response.data);

    // Try to extract data from window.__INIT_DATA__
    let productData;
    try {
      const scripts = $('script').get();
      const dataScript = scripts.find(script => 
        $(script).html()?.includes('window.__INIT_DATA__')
      );
      
      if (dataScript) {
        const scriptContent = $(dataScript).html() || '';
        const dataMatch = scriptContent.match(/window\.__INIT_DATA__\s*=\s*({.+});/);
        if (dataMatch) {
          productData = JSON.parse(dataMatch[1]);
        }
      }
    } catch (error) {
      console.warn('Failed to parse __INIT_DATA__:', error);
    }

    // Extract basic info
    const title = $('.product-title-text').text().trim() || 
                 $('h1').first().text().trim() ||
                 productData?.data?.title ||
                 'Unknown Product';

    const description = $('.detail-desc-decription-content').text().trim() ||
                       productData?.data?.description ||
                       'No description available';

    // Extract price
    const priceElement = $('.uniform-banner-box-price');
    let currentPrice = 0;
    let originalPrice;
    let currency = 'USD';

    if (productData?.data?.priceModule) {
      currentPrice = productData.data.priceModule.minAmount.value;
      originalPrice = productData.data.priceModule.maxAmount.value;
      currency = productData.data.priceModule.currencyCode;
    } else {
      const priceText = priceElement.text().trim();
      const matches = priceText.match(/([^\d.,]+)?(\d+(?:[.,]\d+)?)/);
      if (matches) {
        currentPrice = parseFloat(matches[2].replace(',', '.'));
        currency = matches[1]?.trim() || 'USD';
      }
    }

    // Extract images
    const images: ScrapedImage[] = [];
    if (productData?.data?.imageModule?.imagePathList) {
      productData.data.imageModule.imagePathList.forEach((path: string, index: number) => {
        if (!path.includes('placeholder')) {
          images.push({
            url: path.startsWith('//') ? `https:${path}` : path,
            filename: `image-${index + 1}.jpg`
          });
        }
      });
    } else {
      $('.images-view-item img').each((i, el) => {
        const src = $(el).attr('src');
        if (src && !src.includes('placeholder')) {
          images.push({
            url: src.startsWith('//') ? `https:${src}` : src,
            filename: `image-${i + 1}.jpg`
          });
        }
      });
    }

    // Extract specifications
    const specs: { [key: string]: string } = {};
    if (productData?.data?.specsModule?.props) {
      productData.data.specsModule.props.forEach((prop: any) => {
        specs[prop.name] = prop.value;
      });
    } else {
      $('.product-prop-list li').each((_, el) => {
        const key = $(el).find('.property-title').text().trim();
        const value = $(el).find('.property-desc').text().trim();
        if (key && value) {
          specs[key] = value;
        }
      });
    }

    // Extract shipping info
    const shippingMethods = $('.product-shipping-info').map((_, el) => ({
      name: $(el).find('.shipping-name').text().trim() || 'Standard Shipping',
      price: parseFloat($(el).find('.shipping-price').text().replace(/[^0-9,.]/g, '')) || 0,
      duration: $(el).find('.shipping-time').text().trim() || '15-45 days'
    })).get();

    // Extract seller info
    const sellerName = $('.store-name').text().trim() ||
                      productData?.data?.storeModule?.storeName ||
                      'Unknown Seller';
    const sellerRating = parseFloat($('.store-rating').text().trim());
    const sellerFollowers = parseInt($('.store-followers').text().replace(/[^0-9]/g, ''));

    // Extract ratings
    const ratingAverage = parseFloat($('.overview-rating-average').text().trim()) ||
                         productData?.data?.feedbackModule?.averageStar || 0;
    const ratingCount = parseInt($('.overview-rating-count').text().replace(/[^0-9]/g, '')) ||
                       productData?.data?.feedbackModule?.totalValidNum || 0;

    // Validate and return data
    if (!title || title === 'Unknown Product') {
      throw new Error('Failed to extract product title');
    }

    if (images.length === 0) {
      throw new Error('No product images found');
    }

    return {
      title,
      description,
      price: {
        current: currentPrice,
        original: originalPrice,
        currency
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
        name: sellerName,
        rating: sellerRating || undefined,
        followers: sellerFollowers || undefined
      },
      ratings: {
        average: ratingAverage,
        count: ratingCount,
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