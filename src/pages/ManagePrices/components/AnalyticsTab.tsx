import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Package } from 'lucide-react';
import { Product } from '../../../types';
import { BreakEvenAnalysis } from './analytics/BreakEvenAnalysis';
import { ProfitMarginChart } from './analytics/ProfitMarginChart';
import { CompetitorAnalysis } from './analytics/CompetitorAnalysis';
import { PriceDistribution } from './analytics/PriceDistribution';

interface AnalyticsTabProps {
  products: Product[];
}

export function AnalyticsTab({ products }: AnalyticsTabProps) {
  // Calculate summary metrics
  const metrics = {
    totalProducts: products.length,
    averagePrice: products.reduce((sum, p) => sum + (p.salePrice || 0), 0) / products.length,
    averageMargin: products.reduce((sum, p) => {
      const margin = p.salePrice && p.purchasePrice 
        ? ((p.salePrice - p.purchasePrice) / p.salePrice) * 100 
        : 0;
      return sum + margin;
    }, 0) / products.length,
    totalRevenue: products.reduce((sum, p) => sum + (p.salePrice || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-purple-200" />
            <h3 className="font-medium">Total Products</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-blue-200" />
            <h3 className="font-medium">Average Price</h3>
          </div>
          <p className="text-3xl font-bold">${metrics.averagePrice.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-200" />
            <h3 className="font-medium">Average Margin</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.averageMargin.toFixed(1)}%</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={20} className="text-amber-200" />
            <h3 className="font-medium">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Break Even Analysis */}
      <div className="grid grid-cols-2 gap-6">
        <BreakEvenAnalysis/>
        <ProfitMarginChart products={products} />
      </div>

      {/* Competitor Analysis */}
      <div className="grid grid-cols-2 gap-6">
        <CompetitorAnalysis products={products} />
        <PriceDistribution products={products} />
      </div>
    </div>
  );
}