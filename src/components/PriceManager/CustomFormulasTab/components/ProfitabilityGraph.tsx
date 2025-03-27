import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface ProfitabilityGraphProps {
  variables: Record<string, number>;
}

export function ProfitabilityGraph({ variables }: ProfitabilityGraphProps) {
  // Calculate key metrics
  const revenue = variables.salePrice * variables.stock || 0;
  const costs = (variables.purchasePrice * variables.stock) + 
                (variables.cpl * variables.leads) +
                variables.totalMonthlyExpenses || 0;
  const profit = revenue - costs;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const roi = costs > 0 ? (profit / costs) * 100 : 0;

  // Generate data points for the chart
  const data = Array.from({ length: 10 }, (_, i) => {
    const multiplier = (i + 1) / 5;
    return {
      units: Math.round(variables.stock * multiplier),
      revenue: Math.round(revenue * multiplier),
      costs: Math.round(costs * multiplier),
      profit: Math.round(profit * multiplier),
    };
  });

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-200" />
            <h4 className="font-medium">Revenue</h4>
          </div>
          <p className="text-3xl font-bold">${revenue.toFixed(2)}</p>
          <p className="text-sm text-blue-200 mt-1">Total sales revenue</p>
        </div>

        {/* Profit Card */}
        <div className={`bg-gradient-to-br rounded-xl p-6 text-white ${
          profit >= 0 
            ? 'from-green-500 to-green-600'
            : 'from-red-500 to-red-600'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {profit >= 0 ? (
              <TrendingUp size={20} className="text-green-200" />
            ) : (
              <TrendingDown size={20} className="text-red-200" />
            )}
            <h4 className="font-medium">Profit/Loss</h4>
          </div>
          <p className="text-3xl font-bold">${profit.toFixed(2)}</p>
          <p className="text-sm text-green-200 mt-1">Net profit/loss</p>
        </div>

        {/* ROI Card */}
        <div className={`bg-gradient-to-br rounded-xl p-6 text-white ${
          roi >= 0 
            ? 'from-purple-500 to-purple-600'
            : 'from-orange-500 to-orange-600'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {roi >= 0 ? (
              <TrendingUp size={20} className="text-purple-200" />
            ) : (
              <AlertCircle size={20} className="text-orange-200" />
            )}
            <h4 className="font-medium">ROI</h4>
          </div>
          <p className="text-3xl font-bold">{roi.toFixed(1)}%</p>
          <p className="text-sm text-purple-200 mt-1">Return on investment</p>
        </div>
      </div>

      {/* Profitability Chart */}
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

        {/* Analysis Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Analysis Summary</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${profitMargin >= 30 ? 'bg-green-500' : profitMargin >= 20 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              Profit Margin: {profitMargin.toFixed(1)}% 
              {profitMargin >= 30 ? ' (Good)' : profitMargin >= 20 ? ' (Fair)' : ' (Poor)'}
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${roi >= 50 ? 'bg-green-500' : roi >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              ROI: {roi.toFixed(1)}%
              {roi >= 50 ? ' (Good)' : roi >= 30 ? ' (Fair)' : ' (Poor)'}
            </li>
            <li className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              Break-even Status: {profit >= 0 ? 'Profitable' : 'Loss-making'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}