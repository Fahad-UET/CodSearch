import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ProfitChartProps {
  data: {
    name: string;
    profit: number;
    revenue: number;
    costs: number;
  }[];
}

export function ProfitChart({ data }: ProfitChartProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-purple-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-900">Profit Analysis</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
            />
            <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" />
            <Bar dataKey="costs" name="Costs" fill="#ef4444" />
            <Bar dataKey="profit" name="Profit" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-500">Revenue</div>
          <div className="font-medium text-purple-600">
            ${data.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Costs</div>
          <div className="font-medium text-red-600">
            ${data.reduce((sum, d) => sum + d.costs, 0).toFixed(2)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500">Total Profit</div>
          <div className="font-medium text-emerald-600">
            ${data.reduce((sum, d) => sum + d.profit, 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}