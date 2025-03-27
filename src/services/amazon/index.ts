import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedImage } from '../scraper';

export interface AmazonProduct {
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

export async function scrapeAmazonProduct(url: string): Promise<AmazonProduct> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract basic info
    const title = $('#productTitle').text().trim();
    const description = $('#productDescription').text().trim();
    
    // Extract price
    const priceText = $('#priceblock_ourprice').text().trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // Extract images
    const images: ScrapedImage[] = [];
    $('#imageBlock img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) {
        images.push({
          url: src,
          filename: `image-${images.length + 1}.jpg`
        });
      }
    });

    // Extract specifications
    const specs: { [key: string]: string } = {};
    $('#productDetails_techSpec_section_1 tr').each((_, el) => {
      const key = $(el).find('th').text().trim();
      const value = $(el).find('td').text().trim();
      if (key && value) {
        specs[key] = value;
      }
    });

    // Extract ratings
    const ratingText = $('#acrPopover').attr('title') || '';
    const ratingMatch = ratingText.match(/(\d+(\.\d+)?)/);
    const ratingAverage = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
    
    const ratingCount = parseInt($('#acrCustomerReviewText').text().replace(/[^0-9]/g, '')) || 0;

    return {
      title,
      description,
      price: {
        current: price,
        currency: 'USD'
      },
      images,
      specs,
      variations: [],
      shipping: {
        methods: [{
          name: 'Amazon Prime',
          price: 0,
          duration: '2-3 days'
        }],
        to: 'United States'
      },
      seller: {
        name: $('#sellerProfileTriggerId').text().trim() || 'Amazon.com'
      },
      ratings: {
        average: ratingAverage,
        count: ratingCount,
        distribution: {}
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to access Amazon product: ${error.message}`);
    }
    throw error;
  }
}