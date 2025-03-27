import React from 'react';
import { DollarSign, Plus, Trash2 } from 'lucide-react';

interface PricingSectionProps {
  prices: {
    id: string;
    name: string;
    value: number;
  }[];
  onAddPrice: () => void;
  onUpdatePrice: (id: string, value: number) => void;
  onUpdatePriceName: (id: string, name: string) => void;
  onDeletePrice: (id: string) => void;
}

export function PricingSection({
  prices,
  onAddPrice,
  onUpdatePrice,
  onUpdatePriceName,
  onDeletePrice
}: PricingSectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
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
            <div className="flex-1">
              <input
                type="text"
                value={price.name}
                onChange={(e) => onUpdatePriceName(price.id, e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Price Name"
              />
            </div>
            <div className="w-48 relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={price.value || ''}
                onChange={(e) => onUpdatePrice(price.id, parseFloat(e.target.value))}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="0.00"
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
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
            No prices added yet. Click "Add Price" to start.
          </div>
        )}
      </div>
    </div>
  );
}