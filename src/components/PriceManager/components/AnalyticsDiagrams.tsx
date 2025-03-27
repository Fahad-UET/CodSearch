import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsDiagramsProps {
  results: {
    totalSales?: number;
    totalCosts?: number;
    totalProfit?: number;
    shippingCost?: number;
    returnCost?: number;
    totalCallCenterFees?: number;
    codFees?: number;
    confirmedOrders?: number;
    deliveredOrders?: number;
    returnedOrders?: number;
    profitMargin?: number;
    monthlyBreakEvenOrders?: number;
    revenuePerOrder?: number;
    monthlyRevenue?: number;
    monthlyProfit?: number;
    // to resolve build issue please check this
    totalShipping?: any;
    totalCallCenter?: any;
    leadFees?: any;
    confirmationFees?: any;
    deliveryFees?: any;
    monthlyCharges?: any;
  };
}

export function AnalyticsDiagrams({ results }: AnalyticsDiagramsProps) {
  // Prepare data for charts
  const financialData = [
    { name: 'Sales', amount: results.totalSales },
    { name: 'Costs', amount: results.totalCosts },
    { name: 'Profit', amount: results.totalProfit }
  ];

  const costsBreakdown = [
    { name: 'Shipping', value: results.shippingCost, color: '#60a5fa' },
    { name: 'Returns', value: results.returnCost, color: '#f87171' },
    { name: 'Call Center', value: results.totalCallCenterFees, color: '#34d399' },
    { name: 'COD Fees', value: results.codFees, color: '#fbbf24' }
  ];

  const deliveryData = [
    { name: 'Delivered', value: results.deliveredOrders, color: '#34d399' },
    { name: 'Returned', value: results.returnedOrders, color: '#f87171' }
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

      {/* Break-Even Analysis */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Break-Even Analysis</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { orders: 0, revenue: 0, costs: results.totalCosts },
              { orders: results.monthlyBreakEvenOrders / 2, revenue: results.monthlyRevenue / 2, costs: results.totalCosts / 2 },
              { orders: results.monthlyBreakEvenOrders, revenue: results.monthlyRevenue, costs: results.totalCosts },
              { orders: results.monthlyBreakEvenOrders * 1.5, revenue: results.monthlyRevenue * 1.5, costs: results.totalCosts * 1.5 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="orders" label={{ value: 'Number of Orders', position: 'bottom' }} />
              <YAxis tickFormatter={value => formatValue(value)} />
              <Tooltip
                formatter={(value: number) => [formatValue(value), '']}
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
              />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="costs" name="Costs" stroke="#f87171" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}