import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProfitabilityChartProps {
  data: Array<{
    units: number;
    revenue: number;
    costs: number;
    profit: number;
  }>;
}

export function ProfitabilityChart({ data }: ProfitabilityChartProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Analysis</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="units" 
              label={{ value: 'Units', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              label={{ 
                value: 'Amount ($)', 
                angle: -90, 
                position: 'insideLeft',
                offset: 15
              }}
            />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              labelFormatter={(value) => `Units: ${value}`}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
            <Bar dataKey="costs" fill="#ef4444" name="Costs" />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Profit"
              dot={{ fill: '#10b981' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}