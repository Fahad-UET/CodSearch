import { ScrapedImage } from '../scraper';

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