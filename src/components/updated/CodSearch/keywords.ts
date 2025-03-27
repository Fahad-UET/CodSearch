export interface KeywordData {
  keyword: string;
  volume: number;
  cpc: number;
  competition: number;
  trend: number[];
}

export interface KeywordFiltersType {
  language: string;
  location: string;
  minVolume: number;
  maxVolume: number;
  competition: 'all' | 'low' | 'medium' | 'high';
  dateRange: string;
}

export interface SavedSearch {
  id: string;
  keywords: string;
  filters: KeywordFiltersType;
  results: KeywordData[];
  date: Date;
}

export interface KeywordFolder {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  keywords: SavedKeyword[];
}

export interface SavedKeyword {
  id: string;
  text: string;
  folderId: string;
  createdAt: Date;
  language: string;
  category?: string;
  notes?: string;
}
