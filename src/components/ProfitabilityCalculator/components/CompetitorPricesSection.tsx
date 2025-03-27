import React from 'react';
import { Plus, Trash2, DollarSign, ShoppingBag, ShoppingCart, Store, Globe } from 'lucide-react';
import { CompetitorPrice } from '../types';
import { inputClasses } from '../constants';

interface CompetitorPricesSectionProps {
  prices: CompetitorPrice[];
  onAddPrice: () => void;
  onUpdatePrice: (id: string, value: number) => void;
  onDeletePrice: (id: string) => void;
}

export function CompetitorPricesSection({
  prices,
  onAddPrice,
  onUpdatePrice,
  onDeletePrice
}: CompetitorPricesSectionProps) {
  const handlePriceChange = (id: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onUpdatePrice(id, numValue);
    }
  };

  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-purple-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-purple-900">Competitor Prices</h3>
        <button
          onClick={onAddPrice}
          className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Price
        </button>
      </div>

      <div className="space-y-3">
        {prices.map((price) => (
          <div key={price.id} className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
              price.name === 'AliExpress' ? 'bg-orange-100' :
              price.name === 'Alibaba' ? 'bg-blue-100' :
              price.name === 'Amazon' ? 'bg-yellow-100' :
              price.name === 'Noon' ? 'bg-purple-100' :
              'bg-gray-100'
            }`}>
              {price.name === 'AliExpress' && <ShoppingBag size={18} className="text-orange-600" />}
              {price.name === 'Alibaba' && <ShoppingCart size={18} className="text-blue-600" />}
              {price.name === 'Amazon' && <Store size={18} className="text-yellow-600" />}
              {price.name === 'Noon' && <Globe size={18} className="text-purple-600" />}
              {price.name === 'Other' && <Store size={18} className="text-gray-600" />}
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={price.value || ''}
                onChange={(e) => handlePriceChange(price.id, e.target.value)}
                className={inputClasses}
                placeholder={`${price.name} Price`}
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400" />
            </div>
            <button
              onClick={() => onDeletePrice(price.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}