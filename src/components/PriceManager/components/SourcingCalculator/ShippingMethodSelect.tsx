import React from 'react';
import { Plane, Ship } from 'lucide-react';

interface ShippingMethodSelectProps {
  value: 'air' | 'sea';
  onChange: (method: 'air' | 'sea') => void;
}

export function ShippingMethodSelect({ value, onChange }: ShippingMethodSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Shipping Method
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('air')}
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
            value === 'air'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:border-purple-200'
          }`}
        >
          <Plane size={24} className={value === 'air' ? 'text-purple-500' : 'text-gray-400'} />
          <div className="text-left">
            <div className="font-medium">Air Freight</div>
            <div className="text-sm text-gray-500">7-15 days</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange('sea')}
          className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
            value === 'sea'
              ? 'border-purple-500 bg-purple-50 text-purple-700'
              : 'border-gray-200 hover:border-purple-200'
          }`}
        >
          <Ship size={24} className={value === 'sea' ? 'text-purple-500' : 'text-gray-400'} />
          <div className="text-left">
            <div className="font-medium">Sea Freight</div>
            <div className="text-sm text-gray-500">30-45 days</div>
          </div>
        </button>
      </div>
    </div>
  );
}