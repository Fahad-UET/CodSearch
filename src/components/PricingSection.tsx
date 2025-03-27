import React from 'react';
import { DollarSign, ShoppingBag, ShoppingCart, Store, Globe } from 'lucide-react';

interface PricingProps {
  prices: {
    purchasePrice: number;
    salePrice: number;
    aliexpress?: number;
    alibaba?: number;
    amazon?: number;
    noon?: number;
    other?: { name: string; price: number }[];
  };
  onPricesChange: (prices: PricingProps['prices']) => void;
}

export function PricingSection({ prices, onPricesChange }: PricingProps) {
  const handlePriceChange = (field: keyof typeof prices, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onPricesChange({
        ...prices,
        [field]: numValue
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={prices.purchasePrice || ''}
              onChange={(e) => handlePriceChange('purchasePrice', e.target.value)}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
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
              value={prices.salePrice || ''}
              onChange={(e) => handlePriceChange('salePrice', e.target.value)}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Competitor Prices */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Competitor Prices</h3>
        <div className="space-y-3">
          {/* AliExpress */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-lg">
              <ShoppingBag size={18} className="text-orange-600" />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.aliexpress || ''}
                onChange={(e) => handlePriceChange('aliexpress', e.target.value)}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="AliExpress Price"
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Alibaba */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
              <ShoppingCart size={18} className="text-blue-600" />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.alibaba || ''}
                onChange={(e) => handlePriceChange('alibaba', e.target.value)}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Alibaba Price"
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Amazon */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-lg">
              <Store size={18} className="text-yellow-600" />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.amazon || ''}
                onChange={(e) => handlePriceChange('amazon', e.target.value)}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Amazon Price"
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Noon */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-lg">
              <Globe size={18} className="text-purple-600" />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.noon || ''}
                onChange={(e) => handlePriceChange('noon', e.target.value)}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Noon Price"
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}