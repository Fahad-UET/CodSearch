import React from 'react';
import { BarChart2, TrendingUp, DollarSign } from 'lucide-react';

interface PriceAnalyticsProps {
  metrics: {
    averagePrice: number;
    priceRange: {
      min: number;
      max: number;
    };
    profitTrend: number;
  };
}

export function PriceAnalytics({ metrics }: PriceAnalyticsProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <BarChart2 size={24} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Price Analytics</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600 mb-1">Average Price</p>
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-purple-600" />
            <p className="text-2xl font-bold text-purple-700">
              {metrics.averagePrice.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600 mb-1">Price Range</p>
          <div className="flex items-center gap-1">
            <DollarSign size={16} className="text-blue-600" />
            <p className="text-2xl font-bold text-blue-700">
              {metrics.priceRange.min.toFixed(2)} - {metrics.priceRange.max.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600 mb-1">Profit Trend</p>
          <div className="flex items-center gap-1">
            <TrendingUp size={16} className="text-green-600" />
            <p className="text-2xl font-bold text-green-700">
              {metrics.profitTrend > 0 ? '+' : ''}{metrics.profitTrend.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}