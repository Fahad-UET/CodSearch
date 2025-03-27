import React from 'react';
import { ShoppingBag, ShoppingCart, Store, Globe, Plus, Trash2 } from 'lucide-react';

interface CompetitorPrice {
  id: string;
  name: string;
  value: number;
  icon: 'aliexpress' | 'alibaba' | 'amazon' | 'noon' | 'other';
}

interface CompetitorPricesProps {
  prices: CompetitorPrice[];
  onUpdatePrice: (id: string, value: number) => void;
  onAddPrice: () => void;
  onDeletePrice: (id: string) => void;
}

export function CompetitorPrices({ prices, onUpdatePrice, onAddPrice, onDeletePrice }: CompetitorPricesProps) {
  const getIcon = (type: CompetitorPrice['icon']) => {
    switch (type) {
      case 'aliexpress':
        return <ShoppingBag size={18} className="text-orange-600" />;
      case 'alibaba':
        return <ShoppingCart size={18} className="text-blue-600" />;
      case 'amazon':
        return <Store size={18} className="text-yellow-600" />;
      case 'noon':
        return <Globe size={18} className="text-purple-600" />;
      case 'other':
        return <Store size={18} className="text-gray-600" />;
    }
  };

  const getIconBackground = (type: CompetitorPrice['icon']) => {
    switch (type) {
      case 'aliexpress':
        return 'bg-orange-100';
      case 'alibaba':
        return 'bg-blue-100';
      case 'amazon':
        return 'bg-yellow-100';
      case 'noon':
        return 'bg-purple-100';
      case 'other':
        return 'bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Competitor Prices</h3>
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
            <div className={`w-8 h-8 flex items-center justify-center ${getIconBackground(price.icon)} rounded-lg`}>
              {getIcon(price.icon)}
            </div>
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={price.value || ''}
                onChange={(e) => onUpdatePrice(price.id, parseFloat(e.target.value))}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder={`${price.name} Price`}
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            </div>
            <button
              onClick={() => onDeletePrice(price.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {prices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No competitor prices added yet. Click "Add Price" to start.
          </div>
        )}
      </div>
    </div>
  );
}