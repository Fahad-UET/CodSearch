import React from 'react';
import { DollarSign } from 'lucide-react';

interface PriceSectionProps {
  purchasePrice: number;
  salePrice: number;
  onPurchasePriceChange: (value: number) => void;
  onSalePriceChange: (value: number) => void;
}

export function PriceSection({
  purchasePrice,
  salePrice,
  onPurchasePriceChange,
  onSalePriceChange
}: PriceSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={purchasePrice || ''}
              onChange={(e) => onPurchasePriceChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="0.00"
            />
            <DollarSign 
              size={16} 
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sale Price
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={salePrice || ''}
              onChange={(e) => onSalePriceChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="0.00"
            />
            <DollarSign 
              size={16} 
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}