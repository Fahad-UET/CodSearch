import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface ProfitabilityMetricsProps {
  revenue: number;
  profit: number;
  roi: number;
}

export function ProfitabilityMetrics({ revenue, profit, roi }: ProfitabilityMetricsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="text-blue-200" />
          <h4 className="font-medium">Revenue</h4>
        </div>
        <p className="text-3xl font-bold">${revenue.toFixed(2)}</p>
        <p className="text-sm text-blue-200 mt-1">Total sales revenue</p>
      </div>

      {/* Profit Card */}
      <div className={`bg-gradient-to-br rounded-xl p-6 text-white ${
        profit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {profit >= 0 ? (
            <TrendingUp size={20} className="text-green-200" />
          ) : (
            <TrendingDown size={20} className="text-red-200" />
          )}
          <h4 className="font-medium">Profit/Loss</h4>
        </div>
        <p className="text-3xl font-bold">${profit.toFixed(2)}</p>
        <p className="text-sm text-green-200 mt-1">Net profit/loss</p>
      </div>

      {/* ROI Card */}
      <div className={`bg-gradient-to-br rounded-xl p-6 text-white ${
        roi >= 0 ? 'from-purple-500 to-purple-600' : 'from-orange-500 to-orange-600'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {roi >= 0 ? (
            <TrendingUp size={20} className="text-purple-200" />
          ) : (
            <AlertCircle size={20} className="text-orange-200" />
          )}
          <h4 className="font-medium">ROI</h4>
        </div>
        <p className="text-3xl font-bold">{roi.toFixed(1)}%</p>
        <p className="text-sm text-purple-200 mt-1">Return on investment</p>
      </div>
    </div>
  );
}