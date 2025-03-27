import React from 'react';
import { Product } from '../../../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfitMarginChartProps {
  products: Product[];
}

export function ProfitMarginChart({ products }: ProfitMarginChartProps) {
  const marginData = products
    .filter(p => p.purchasePrice && p.salePrice)
    .map(product => {
      const margin = ((product.salePrice! - product.purchasePrice!) / product.salePrice!) * 100;
      return {
        name: product.title,
        margin: parseFloat(margin.toFixed(2))
      };
    })
    .sort((a, b) => b.margin - a.margin);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Profit Margins</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={marginData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis unit="%" />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Profit Margin']}
              labelFormatter={(label) => `Product: ${label}`}
            />
            <Line type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}