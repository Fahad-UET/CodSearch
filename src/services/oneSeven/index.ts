import axios from 'axios';
import * as cheerio from 'cheerio';
import { ScrapedImage } from '../scraper';

export interface OneSevenProduct {
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

export async function scrapeOneSevenProduct(url: string): Promise<OneSevenProduct> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract basic info
    const title = $('.title').text().trim();
    const description = $('.description').text().trim();
    
    // Extract price
    const priceText = $('.price').text().trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    
    // Extract images
    const images: ScrapedImage[] = [];
    $('.product-images img').each((_, el) => {
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
    $('.specifications tr').each((_, el) => {
      const key = $(el).find('th').text().trim();
      const value = $(el).find('td').text().trim();
      if (key && value) {
        specs[key] = value;
      }
    });

    return {
      title,
      description,
      price: {
        current: price,
        currency: 'CNY'
      },
      images,
      specs,
      variations: [],
      shipping: {
        methods: [{
          name: 'Standard Shipping',
          price: 0,
          duration: '7-15 days'
        }],
        to: 'Worldwide'
      },
      seller: {
        name: $('.seller-name').text().trim() || 'Unknown Seller'
      },
      ratings: {
        average: 0,
        count: 0,
        distribution: {}
      }
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to access 1688.com product: ${error.message}`);
    }
    throw error;
  }
}