export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
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
  isPopular?: boolean;
}

export interface UserSubscription {
  userId: string;
  tierId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  autoRenew: boolean;
}

interface Analysis {
  score: number;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  attention?: string;
  interest?: string;
  desire?: string;
  action?: string;
  updatedAt: Date;
}

interface Analysis {
  score: number;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  attention?: string;
  interest?: string;
  desire?: string;
  action?: string;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  swotAnalysis?: Analysis;
  aidaAnalysis?: Analysis;
  images: string[];
  videoLinks: string[];
  status: string;
}