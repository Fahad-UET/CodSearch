import React from 'react';
import { ShoppingCart, Tag, Store, ShoppingBag } from 'lucide-react';

interface PriceSectionProps {
  purchasePrice?: number;
  salePrice?: number;
  competitorPrices?: {
    aliexpress?: number;
    alibaba?: number;
  };
}

export function PriceSection({
  purchasePrice = 0,
  salePrice = 0,
  competitorPrices = {},
}: PriceSectionProps) {
  const formatPrice = (price?: number) => {
    if (price === undefined || price === null) return '0.00';
    // return price.toFixed(2);
    return 0;
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Purchase Price */}
      <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors">
        <ShoppingCart
          size={18}
          className="text-blue-600 group-hover:scale-110 transition-transform"
        />
        <span className="text-sm font-medium text-blue-700">${formatPrice(purchasePrice)}</span>
      </div>

      {/* Sale Price */}
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg group hover:bg-green-100 transition-colors">
        <Tag size={18} className="text-green-600 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium text-green-700">${formatPrice(salePrice)}</span>
      </div>

      {/* AliExpress Price */}
      {competitorPrices?.aliexpress !== undefined && (
        <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg group hover:bg-orange-100 transition-colors">
          <ShoppingBag
            size={18}
            className="text-orange-600 group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-medium text-orange-700">
            ${formatPrice(competitorPrices.aliexpress)}
          </span>
        </div>
      )}

      {/* Alibaba Price */}
      {competitorPrices?.alibaba !== undefined && (
        <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg group hover:bg-indigo-100 transition-colors">
          <Store size={18} className="text-indigo-600 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-indigo-700">
            ${formatPrice(competitorPrices.alibaba)}
          </span>
        </div>
      )}
    </div>
  );
}