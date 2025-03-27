import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SummaryChartsProps {
  results: {
    totalSales: number;
    totalCosts: number;
    totalProfit: number;
    shippingCost: number;
    returnCost: number;
    totalCallCenterFees: number;
    codFees: number;
    productsDelivered: number;
    productsReturned: number;
    profitMargin: number;
  };
}

export function SummaryCharts({ results }: SummaryChartsProps) {
  const {
    totalSales,
    totalCosts,
    totalProfit,
    shippingCost,
    returnCost,
    totalCallCenterFees,
    codFees,
    productsDelivered,
    productsReturned,
    profitMargin
  } = results;

  const financialData = [
    { name: 'Sales', amount: totalSales },
    { name: 'Costs', amount: totalCosts },
    { name: 'Profit', amount: totalProfit }
  ];

  const costsBreakdown = [
    { name: 'Shipping', value: shippingCost, color: '#60a5fa' },
    { name: 'Returns', value: returnCost, color: '#f87171' },
    { name: 'Call Center', value: totalCallCenterFees, color: '#34d399' },
    { name: 'COD Fees', value: codFees, color: '#fbbf24' }
  ];

  const deliveryData = [
    { name: 'Delivered', value: productsDelivered, color: '#34d399' },
    { name: 'Returned', value: productsReturned, color: '#f87171' }
  ];

  const formatValue = (value: number): string => {
    return `$${Math.round(value)}`;
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Financial Overview */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={value => formatValue(value)} />
              <Tooltip
                formatter={(value: number) => [formatValue(value), '']}
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="amount" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Costs Breakdown */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Costs Breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={costsBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
              >
                {costsBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatValue(value), '']}
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Delivery Performance */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deliveryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
              >
                {deliveryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [Math.round(value), '']}
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Margin Gauge */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Margin</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {Math.round(profitMargin)}%
            </div>
            <div className="text-gray-500">Profit Margin</div>
          </div>
        </div>
      </div>
    </div>
  );
}