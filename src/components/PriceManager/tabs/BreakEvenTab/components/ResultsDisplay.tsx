import React from 'react';
import { TrendingUp, DollarSign, Package, AlertCircle } from 'lucide-react';
import { BreakEvenResults } from '../utils/calculations';

interface ResultsDisplayProps {
  results: BreakEvenResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const {
    breakEvenUnits,
    breakEvenRevenue,
    contributionMargin,
    contributionMarginRatio,
    profitPerUnit
  } = results;

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Package size={20} className="text-purple-200" />
          <h4 className="font-medium">Break Even Units</h4>
        </div>
        <p className="text-3xl font-bold">
          {breakEvenUnits.toFixed(0)}
        </p>
        <p className="text-sm text-purple-200 mt-1">
          Units needed to break even
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={20} className="text-blue-200" />
          <h4 className="font-medium">Break Even Revenue</h4>
        </div>
        <p className="text-3xl font-bold">
          ${breakEvenRevenue.toFixed(2)}
        </p>
        <p className="text-sm text-blue-200 mt-1">
          Revenue at break even point
        </p>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="text-green-200" />
          <h4 className="font-medium">Contribution Margin</h4>
        </div>
        <p className="text-3xl font-bold">
          ${contributionMargin.toFixed(2)}
        </p>
        <p className="text-sm text-green-200 mt-1">
          {contributionMarginRatio.toFixed(1)}% of revenue
        </p>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={20} className="text-amber-200" />
          <h4 className="font-medium">Profit Per Unit</h4>
        </div>
        <p className="text-3xl font-bold">
          ${profitPerUnit.toFixed(2)}
        </p>
        <p className="text-sm text-amber-200 mt-1">
          After variable costs
        </p>
      </div>
    </div>
  );
}