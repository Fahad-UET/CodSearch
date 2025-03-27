import React from 'react';
import { Product } from '../../../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PriceDistributionProps {
  products: Product[];
}

export function PriceDistribution({ products }: PriceDistributionProps) {
  const getPriceRange = (price: number) => {
    if (price < 10) return '< $10';
    if (price < 25) return '$10-$25';
    if (price < 50) return '$25-$50';
    if (price < 100) return '$50-$100';
    return '> $100';
  };

  const distribution = products
    .filter(p => p.salePrice)
    .reduce((acc, product) => {
      const range = getPriceRange(product.salePrice!);
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const data = Object.entries(distribution).map(([range, count]) => ({
    name: range,
    value: count
  }));

  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4'];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Price Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} products`, 'Count']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}