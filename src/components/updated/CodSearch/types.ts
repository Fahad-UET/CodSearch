import type { Language } from '../CodSearch/translations';

export interface FormData {
  country: string;
  audience: string;
  problemCategory: string;
  customProblemCategory?: string;
  problem: string;
  customProblem?: string;
  budget: string;
  category: string;
  niche: string;
  season: string;
  customCategory: string;
  customNiche: string;
  customSeason: string;
  customCountry: string;
  similarProduct?: string;
  similarProductUrl?: string;
  exampleProduct?: string;
  exampleProductUrl?: string;
}

export interface KeywordSet {
  language: {
    code: string;
    name: string;
    flag: string;
    native: string;
  };
  keywords: {
    officialNames: string[];
    commonVariations: string[];
    existingBrands: string[];
  };
}
