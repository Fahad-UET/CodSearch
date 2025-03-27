import React from 'react';
import { Product } from '../../../types';
import { TrendingUp, DollarSign, BarChart2 } from 'lucide-react';

interface PriceAnalyticsProps {
  products: Product[];
}

export function PriceAnalytics({ products }: PriceAnalyticsProps) {
  const calculateMetrics = () => {
    if (products.length === 0) return {
      averageMargin: 0,
      totalRevenue: 0,
      averagePrice: 0
    };

    const totalRevenue = products.reduce((sum, p) => sum + p.salePrice, 0);
    const totalCost = products.reduce((sum, p) => sum + p.purchasePrice, 0);
    const averageMargin = ((totalRevenue - totalCost) / totalRevenue) * 100;
    const averagePrice = totalRevenue / products.length;

    return {
      averageMargin,
      totalRevenue,
      averagePrice
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-purple-200" />
          <h3 className="font-medium">Average Margin</h3>
        </div>
        <p className="text-3xl font-bold">{metrics.averageMargin.toFixed(1)}%</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-emerald-200" />
          <h3 className="font-medium">Total Revenue</h3>
        </div>
        <p className="text-3xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={20} className="text-blue-200" />
          <h3 className="font-medium">Average Price</h3>
        </div>
        <p className="text-3xl font-bold">${metrics.averagePrice.toFixed(2)}</p>
      </div>
    </div>
  );
}