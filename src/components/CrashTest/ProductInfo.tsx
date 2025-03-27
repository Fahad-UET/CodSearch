import React from 'react';
import { DollarSign } from 'lucide-react';

interface ProductInfoProps {
  formData: {
    purchasePrice: number;
    salePrice: number;
  };
  onChange: (data: Partial<ProductInfoProps['formData']>) => void;
}

export function ProductInfo({ formData, onChange }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Product Information</h3>
      
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
              value={formData.purchasePrice}
              onChange={(e) => onChange({ purchasePrice: parseFloat(e.target.value) })}
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
              value={formData.salePrice}
              onChange={(e) => onChange({ salePrice: parseFloat(e.target.value) })}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          Profit Margin: {formData.purchasePrice && formData.salePrice ? (
            <span className="font-medium">
              {(((formData.salePrice - formData.purchasePrice) / formData.salePrice) * 100).toFixed(1)}%
            </span>
          ) : '---'}
        </p>
      </div>
    </div>
  );
}