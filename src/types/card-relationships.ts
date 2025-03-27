export interface CardRelationship {
  id: string;
  parentId: string | null;
  childIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCardRelationship extends CardRelationship {
  productId: string;
  inheritedFields: string[];
  syncStatus: 'synced' | 'pending' | 'error';
}

export type InheritableField = 
  | 'title' 
  | 'description' 
  | 'price' 
  | 'images' 
  | 'metrics' 
  | 'variables';

// export type CopyOptions = {
//   metrics?: any;
//   title?: string;
//   description?: string;
//   images?: [];
//   videos?: any;
//   links?: [];
//   prices?: any;
//   competitorPrices?: {};
//   notes?: [];
//   tasks?: any[];
//   createdAt?: Date;
//   updatedAt?: Date;
//   category?: any;
// }

export type CopyOptions = {
  metrics?: any;
  title?: any;
  description?: any;
  images?: any;
  videos?: any;
  links?: any;
  prices?: any;
  competitorPrices?: {};
  notes?: any;
  tasks?: any;
  createdAt?: Date;
  updatedAt?: Date;
  category?: any;
}