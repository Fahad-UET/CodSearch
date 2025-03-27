import React from 'react';
import { DollarSign, ShoppingBag, ShoppingCart, Store, Globe } from 'lucide-react';

interface PricesTabProps {
  prices: {
    purchasePrice: number;
    salePrice: number;
    aliexpress?: number;
    alibaba?: number;
    amazon?: number;
    noon?: number;
    other?: { name: string; price: number }[];
    // to resolve build issue please check this added
    competitorPrices?: number;
  };
  onPricesChange: (prices: PricesTabProps['prices']) => void;
}

export function PricesTab({ prices, onPricesChange }: PricesTabProps) {
  const handlePriceChange = (field: keyof typeof prices, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onPricesChange({
        ...prices,
        [field]: numValue,
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Main Prices */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Main Prices</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Purchase Price</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.purchasePrice || ''}
                onChange={e => handlePriceChange('purchasePrice', e.target.value)}
                className="w-full pl-10 h-12 rounded-lg border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:ring focus:ring-purple-200 text-lg"
                placeholder="0.00"
              />
              <DollarSign
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">Sale Price</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.salePrice || ''}
                onChange={e => handlePriceChange('salePrice', e.target.value)}
                className="w-full pl-10 h-12 rounded-lg border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:ring focus:ring-purple-200 text-lg"
                placeholder="0.00"
              />
              <DollarSign
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Competitor Prices */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Competitor Prices</h3>
        <div className="space-y-4">
          {/* AliExpress */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-lg">
              <ShoppingBag size={24} className="text-orange-600" />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.aliexpress || ''}
                onChange={e => handlePriceChange('aliexpress', e.target.value)}
                className="w-full pl-10 h-12 rounded-lg border-orange-200 bg-orange-50/30 focus:border-orange-500 focus:ring focus:ring-orange-200 text-lg"
                placeholder="AliExpress Price"
              />
              <DollarSign
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500"
              />
            </div>
          </div>

          {/* Alibaba */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
              <ShoppingCart size={24} className="text-blue-600" />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.alibaba || ''}
                onChange={e => handlePriceChange('alibaba', e.target.value)}
                className="w-full pl-10 h-12 rounded-lg border-blue-200 bg-blue-50/30 focus:border-blue-500 focus:ring focus:ring-blue-200 text-lg"
                placeholder="Alibaba Price"
              />
              <DollarSign
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
              />
            </div>
          </div>

          {/* Amazon */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-yellow-100 rounded-lg">
              <Store size={24} className="text-yellow-600" />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.amazon || ''}
                onChange={e => handlePriceChange('amazon', e.target.value)}
                className="w-full pl-10 h-12 rounded-lg border-yellow-200 bg-yellow-50/30 focus:border-yellow-500 focus:ring focus:ring-yellow-200 text-lg"
                placeholder="Amazon Price"
              />
              <DollarSign
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500"
              />
            </div>
          </div>

          {/* Noon */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center bg-purple-100 rounded-lg">
              <Globe size={24} className="text-purple-600" />
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={prices.noon || ''}
                onChange={e => handlePriceChange('noon', e.target.value)}
                className="w-full pl-10 h-12 rounded-lg border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:ring focus:ring-purple-200 text-lg"
                placeholder="Noon Price"
              />
              <DollarSign
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
