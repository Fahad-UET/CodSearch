import React from 'react';
import { DollarSign, Package, Percent } from 'lucide-react';
import { MetricsState } from '../types';

interface MetricsFormProps {
  metrics: MetricsState;
  onChange: (updates: Partial<MetricsState>) => void;
}

export function MetricsForm({ metrics, onChange }: MetricsFormProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Base Metrics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {/* Available Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Stock
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Package size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              value={metrics.availableStock}
              onChange={e => onChange({ availableStock: Number(e.target.value) })}
              className="pl-10 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
        </div>

        {/* Selling Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={metrics.sellingPrice}
              onChange={e => onChange({ sellingPrice: Number(e.target.value) })}
              className="pl-10 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
        </div>

        {/* Purchase Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Price ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={metrics.purchasePrice}
              onChange={e => onChange({ purchasePrice: Number(e.target.value) })}
              className="pl-10 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
        </div>

        {/* Base CPL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Advertising Cost per Lead ($)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={metrics.baseCPL}
              onChange={e => onChange({ baseCPL: Number(e.target.value) })}
              className="pl-10 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
        </div>

        {/* Base Confirmation Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Confirmation Rate (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={metrics.baseConfirmationRate}
              onChange={e => onChange({ baseConfirmationRate: Number(e.target.value) })}
              className="pl-10 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
        </div>

        {/* Base Delivery Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Delivery Rate (%)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Percent size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={metrics.baseDeliveryRate}
              onChange={e => onChange({ baseDeliveryRate: Number(e.target.value) })}
              className="pl-10 block w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
}