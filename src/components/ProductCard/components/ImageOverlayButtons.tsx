import React from 'react';
import { DollarSign, Image } from 'lucide-react';
import { ProductCategory } from '@/types';

interface ImageOverlayButtonsProps {
  onDataClick: () => void;
  onAnalyticsClick: () => void;
  category?: ProductCategory;
}

const getButtonStyles = (category?: ProductCategory) => {
  const baseStyles = 'p-2.5 backdrop-blur-md rounded-xl shadow-[0_4px_12px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200';
  
  switch (category) {
    case 'PRODUCT_SELLER':
      return `${baseStyles} bg-gradient-to-br from-purple-50/90 to-white/80 text-purple-600 hover:from-purple-100/90 hover:to-white`;
    case 'PRODUCT_DROP':
      return `${baseStyles} bg-gradient-to-br from-blue-50/90 to-white/80 text-blue-600 hover:from-blue-100/90 hover:to-white`;
    case 'PRODUCT_AFFILIATE':
      return `${baseStyles} bg-gradient-to-br from-orange-50/90 to-white/80 text-orange-600 hover:from-orange-100/90 hover:to-white`;
    default:
      return `${baseStyles} bg-gradient-to-br from-gray-50/90 to-white/80 text-gray-600 hover:from-gray-100/90 hover:to-white`;
  }
};

export function ImageOverlayButtons({ onDataClick, onAnalyticsClick, category }: ImageOverlayButtonsProps) {
  const buttonStyles = getButtonStyles(category);

  return (
    <div className="absolute top-12 right-2 flex flex-col gap-2 z-20">
      <button
        onClick={onAnalyticsClick}
        className={buttonStyles}
        title="All Prices & Analytics"
      >
        <DollarSign size={16} />
      </button>
      
      <button
        onClick={onDataClick}
        className={buttonStyles}
        title="All Data Creatives"
      >
        <Image size={16} />
      </button>
    </div>
  );
}