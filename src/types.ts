  // for now interfaces and types are just added to remove the ts errors in future create the correct types
export interface Product {
  id?: string;
  boardId?: string;
  status?: string;
  icon?: any;
  savedPrices?: any;
  zone?: 'priority' | 'normal' | 'backlog';
  profit?: any;
  profitMargin?: any;
  metrics?: any;
  title?: string;
  description?: any;
  images?: any[];
  videoLinks?: any[];
  links?: [];
  purchasePrice?: number;
  salePrice?: number;
  notes?: any[];
  tasks?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  category?: any;
  price?: any;
  rating?: any;
  country?: any;
  productType?: string;
  thumbnail?: any;
  pageCaptures?: any[];
  adCopy?: any;
  generatedText?: any;
  sourceCalculation?:any;
  order?: any;
  ownerId?: string;
  members?: any;
  competitorPrices?:{
    aliexpress?: number;
    alibaba?: number;
    oneSeven?:any;
    amazon?:any;
  }
  otherSite?: any;
  oneSix?: any;
  amazon?: any;
  aliExpress?: any;
  aliBabaLink?: any;
}

export interface AdCreative {
  id: string;
  url: string;
  originalUrl: string;
  platform: 'tiktok' | 'facebook' | 'direct';
  type: 'video' | 'image' | 'gif';
  thumbnailUrl?: string;
  embedUrl?: boolean;
  rating?: any;
  dateCreated?: any;
}

export interface AdFormData {
  url: string;
  platform: 'tiktok' | 'facebook' | 'direct';
  rating: number;
}

export interface FavoritesList {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  items: FavoriteItem[];
}

export interface FavoriteItem {
  id: string;
  listId: string;
  adId: string;
  position: number;
  addedAt: Date;
  thumbnailUrl?: string;
}
export interface CreateListDto {
  name: string;
  description?: string;
  isPublic?: boolean;
}
export interface VideoExtractor {
  extract(url: string): Promise<any>;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  preview_url?: string;
  labels?: {
    gender?: string;
    accent?: string;
    description?: string;
  };
}

export class ElevenLabsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ElevenLabsError';
  }
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
  speaking_rate?: number;
  optimize_streaming_latency?: number;
}

export interface DailyMetrics {
  id?: string;
  leads?: number;
  adBudget?: number;
  confirmedOrders?: number;
  deliveredOrders?: number;
  sellingPrice?: number;
  cpc?: any;
  cpm?: any;
  ctr?: any;
  cpl?: number;
  deliveryRate?: number;
  confirmationRate?: number;
  budget?: number;
  impressions?: number;
  clicks: number;
  day?: any;
}

export interface CalculatedMetrics {
  cpl?: number;
  deliveryRate?: number;
  confirmationRate?: number;
}

export type AverageMetrics = any;

export interface BreakEvenInputs {
  fixedCosts?: number;
  monthlyCharges?: number;
  variableCosts?: number;
  units?: number;
  confirmationRate?: number;
  deliveryRate?: number;
  sellingPrice?: number;
  confirmedOrders?: number;
  leads?: any;
  adSpend?: any;
}

export interface UserSubscription {
  userId: string;
  tierId: any;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenew: boolean;
  status?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  productLimit: number;
  features: string[];
}

export type RatingAnswers = any;

export type ProductRatings = any;

export type Task = {
  id: string;
  text: any;
  completed: boolean;
  createdAt:Date;
  updatedAt: Date;
}

export type Board = any;
export type MonthlyCharge = any;
export type ChargeCategory = any;
export type List = any;
export type Link = any;
export type User = any;
export type ChargeSubcategory = any;
export type OrderStatus = any;
export type SortDirection = any;
export type Video = any;
export type SharePermissions = any;
export type BoardMember = any;
export type AdCopyVariant = any;
export type ProductMetrics = any;
export type ProductCategory = any;
export type LinkCategory = any;
export type Platform = any;
