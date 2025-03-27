import React from 'react';
import { Product } from '../../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, BarChart2 } from 'lucide-react';

interface ProfitabilityTabProps {
  products: Product[];
}

export function ProfitabilityTab({ products }: ProfitabilityTabProps) {
  // Calculate profitability metrics
  const metrics = products.reduce((acc, product) => {
    if (product.salePrice && product.purchasePrice) {
      const profit = product.salePrice - product.purchasePrice;
      const margin = (profit / product.salePrice) * 100;
      
      return {
        totalProducts: acc.totalProducts + 1,
        totalProfit: acc.totalProfit + profit,
        averageMargin: acc.averageMargin + margin,
        highestMargin: Math.max(acc.highestMargin, margin),
        lowestMargin: Math.min(acc.lowestMargin, margin),
      };
    }
    return acc;
  }, {
    totalProducts: 0,
    totalProfit: 0,
    averageMargin: 0,
    highestMargin: -Infinity,
    lowestMargin: Infinity,
  });

  // Prepare data for margin distribution chart
  const marginData = products
    .filter(p => p.salePrice && p.purchasePrice)
    .map(product => ({
      name: product.title,
      margin: ((product.salePrice! - product.purchasePrice!) / product.salePrice!) * 100,
      profit: product.salePrice! - product.purchasePrice!,
    }))
    .sort((a, b) => b.margin - a.margin);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-purple-200" />
            <h3 className="font-medium">Total Profit</h3>
          </div>
          <p className="text-3xl font-bold">${metrics.totalProfit.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-200" />
            <h3 className="font-medium">Average Margin</h3>
          </div>
          <p className="text-3xl font-bold">
            {(metrics.averageMargin / metrics.totalProducts || 0).toFixed(1)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={20} className="text-green-200" />
            <h3 className="font-medium">Margin Range</h3>
          </div>
          <p className="text-3xl font-bold">
            {metrics.lowestMargin.toFixed(1)}% - {metrics.highestMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Margin Distribution Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Margin Distribution</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={marginData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="margin" orientation="left" unit="%" />
              <YAxis yAxisId="profit" orientation="right" unit="$" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="margin"
                type="monotone"
                dataKey="margin"
                stroke="#8b5cf6"
                name="Margin %"
              />
              <Line
                yAxisId="profit"
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                name="Profit $"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}