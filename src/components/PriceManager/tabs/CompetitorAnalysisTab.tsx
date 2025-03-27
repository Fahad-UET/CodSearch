import React from 'react';
import { Product } from '../../../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, BarChart2 } from 'lucide-react';

interface CompetitorAnalysisTabProps {
  products: Product[];
}

export function CompetitorAnalysisTab({ products }: CompetitorAnalysisTabProps) {
  // Calculate competitor price metrics
  const metrics = products.reduce((acc, product) => {
    const competitors = product.competitorPrices || {};
    const prices = Object.values(competitors).filter(price => typeof price === 'number') as number[];
    
    if (prices.length > 0) {
      const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const margin = product.salePrice ? ((product.salePrice - avgPrice) / avgPrice) * 100 : 0;
      
      return {
        totalProducts: acc.totalProducts + 1,
        averageMargin: acc.averageMargin + margin,
        totalCompetitors: acc.totalCompetitors + prices.length,
      };
    }
    return acc;
  }, {
    totalProducts: 0,
    averageMargin: 0,
    totalCompetitors: 0,
  });

  // Prepare data for scatter plot
  const scatterData = products
    .filter(p => p.salePrice && p.competitorPrices)
    .map(product => {
      const competitors = product.competitorPrices || {};
      const avgCompetitorPrice = Object.values(competitors)
        .filter(price => typeof price === 'number')
        .reduce((sum, price) => sum + (price as number), 0) / Object.keys(competitors).length;

      return {
        name: product.title,
        x: avgCompetitorPrice || 0,
        y: product.salePrice || 0,
      };
    });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-purple-200" />
            <h3 className="font-medium">Average Margin</h3>
          </div>
          <p className="text-3xl font-bold">
            {(metrics.averageMargin / metrics.totalProducts || 0).toFixed(1)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-200" />
            <h3 className="font-medium">Products Analyzed</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={20} className="text-green-200" />
            <h3 className="font-medium">Total Competitors</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.totalCompetitors}</p>
        </div>
      </div>

      {/* Price Comparison Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Comparison</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Competitor Price" 
                unit="$"
                domain={['auto', 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Your Price" 
                unit="$"
                domain={['auto', 'auto']}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              />
              <Legend />
              <Scatter 
                name="Products" 
                data={scatterData} 
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}