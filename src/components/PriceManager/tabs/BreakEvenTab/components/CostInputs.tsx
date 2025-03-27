import React from 'react';
import { DollarSign } from 'lucide-react';

interface CostInputsProps {
  fixedCosts: number;
  variableCosts: number;
  sellingPrice: number;
  onFixedCostsChange: (value: number) => void;
  onVariableCostsChange: (value: number) => void;
  onSellingPriceChange: (value: number) => void;
}

export function CostInputs({
  fixedCosts,
  variableCosts,
  sellingPrice,
  onFixedCostsChange,
  onVariableCostsChange,
  onSellingPriceChange
}: CostInputsProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Inputs</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fixed Costs (Monthly)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={fixedCosts}
              onChange={e => onFixedCostsChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Include rent, salaries, utilities, etc.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variable Costs (Per Unit)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={variableCosts}
              onChange={e => onVariableCostsChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Cost per unit including materials, labor, etc.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price (Per Unit)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={sellingPrice}
              onChange={e => onSellingPriceChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Price charged to customers
          </p>
        </div>
      </div>
    </div>
  );
}