import React from 'react';
import { Product } from '../../../../types';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompetitorAnalysisProps {
  products: Product[];
}

export function CompetitorAnalysis({ products }: CompetitorAnalysisProps) {
  const competitorData = products
    .filter(p => p.salePrice && p.competitorPrices)
    .map(product => {
      const competitors = product.competitorPrices || {};
      const avgCompetitorPrice = Object.values(competitors)
        .filter(price => typeof price === 'number')
        .reduce((sum, price) => sum + (price as number), 0) / Object.keys(competitors).length;

      return {
        name: product.title,
        x: product.salePrice,
        y: avgCompetitorPrice || 0
      };
    });

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Price vs Competition</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Your Price" 
              unit="$"
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Avg Competitor Price" 
              unit="$"
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
            />
            <Scatter 
              data={competitorData} 
              fill="#6366f1"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}