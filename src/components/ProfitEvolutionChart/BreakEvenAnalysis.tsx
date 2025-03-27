import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Package2, Percent } from 'lucide-react';
import { calculateBreakEvenPoints } from '../../utils/breakEvenCalculations';
import {BreakEvenInputs} from '@/types'

interface BreakEvenAnalysisProps {
  fixedCosts: number;
  variableCosts: number;
  sellingPrice: number;
  monthlyCharges: number;
  adSpend: number;
}

export function BreakEvenAnalysis({
  fixedCosts,
  variableCosts,
  sellingPrice,
  monthlyCharges,
  adSpend
}: BreakEvenAnalysisProps) {
  const [results, setResults] = useState<any | null>(null);

  useEffect(() => {
    const inputs: BreakEvenInputs = {
      fixedCosts,
      variableCosts,
      sellingPrice,
      monthlyCharges,
      adSpend
    };
    
    const breakEvenResults = calculateBreakEvenPoints(inputs);
    setResults(breakEvenResults);
  }, [fixedCosts, variableCosts, sellingPrice, monthlyCharges, adSpend]);

  if (!results) return null;

  return (
    <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Calculator size={24} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Break-Even Analysis</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Break-even Units */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Package2 size={20} className="text-purple-200" />
            <h4 className="font-medium">Break-even Units</h4>
          </div>
          <p className="text-3xl font-bold">{results.breakEvenUnits.toLocaleString()}</p>
          <p className="text-sm text-purple-200 mt-1">Units needed to break even</p>
        </div>

        {/* Break-even Revenue */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-blue-200" />
            <h4 className="font-medium">Break-even Revenue</h4>
          </div>
          <p className="text-3xl font-bold">${results.breakEvenRevenue.toLocaleString()}</p>
          <p className="text-sm text-blue-200 mt-1">Revenue at break-even point</p>
        </div>

        {/* Contribution Margin */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-200" />
            <h4 className="font-medium">Contribution Margin</h4>
          </div>
          <p className="text-3xl font-bold">${results.contributionMargin.toFixed(2)}</p>
          <p className="text-sm text-green-200 mt-1">Per unit contribution</p>
        </div>

        {/* Profit Margin */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Percent size={20} className="text-amber-200" />
            <h4 className="font-medium">Profit Margin</h4>
          </div>
          <p className="text-3xl font-bold">{results.profitMargin.toFixed(1)}%</p>
          <p className="text-sm text-amber-200 mt-1">At break-even point</p>
        </div>

        {/* ROI */}
        <div className="col-span-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-rose-200" />
            <h4 className="font-medium">Return on Investment (ROI)</h4>
          </div>
          <p className="text-3xl font-bold">{results.roi.toFixed(1)}%</p>
          <p className="text-sm text-rose-200 mt-1">At break-even point</p>
        </div>
      </div>
    </div>
  );
}