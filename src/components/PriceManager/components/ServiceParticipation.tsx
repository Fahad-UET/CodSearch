import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ServiceParticipationProps {
  expenses: {
    advertisingCosts: number;
    deliveryCosts: number;
    returnCosts: number;
    callCenterCosts: number;
    codFees: number;
  };
}

export function ServiceParticipation({ expenses }: ServiceParticipationProps) {
  const data = [
    { name: 'Advertising', value: expenses.advertisingCosts, color: '#3B82F6' },
    { name: 'Delivery', value: expenses.deliveryCosts, color: '#10B981' },
    { name: 'Returns', value: expenses.returnCosts, color: '#EF4444' },
    { name: 'Call Center', value: expenses.callCenterCosts, color: '#8B5CF6' },
    { name: 'COD Fees', value: expenses.codFees, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / totalValue) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-600">${item.value.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Company Share</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}