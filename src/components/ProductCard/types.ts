import { Product } from '../../types';

export interface ProductCardProps {
  product: Product;
  listIndex: number;
  verticalIndex?: number;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCardProps {
  onRatingClick: () => void;
  onGalleryClick: () => void;
  onAdTestingClick: () => void;
  onBreakEvenClick: () => void;
  onPageCapturesClick: () => void;
  onAdCopyClick: () => void;
  onVoiceOverClick: () => void;
}