import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProfitChartProps {
  profitHistory: Array<{
    date: string;
    profit: number;
    revenue: number;
    costs: number;
  }>;
}

export function ProfitChart({ profitHistory }: ProfitChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={profitHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#8b5cf6' }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: '#10b981', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#10b981' }}
        />
        <Line
          type="monotone"
          dataKey="costs"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', strokeWidth: 2 }}
          activeDot={{ r: 6, fill: '#ef4444' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}