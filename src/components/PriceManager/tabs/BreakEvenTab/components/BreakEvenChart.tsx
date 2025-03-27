import React from 'react';
import { CartesianGrid, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
// import { calculateProfitAtUnits } from '@/utils/breakEvenCalculations';
import { BreakEvenInputs } from '../../../../../types';
import { LineChart } from 'lucide-react';

interface BreakEvenChartProps {
  inputs?: BreakEvenInputs;
  breakEvenPoint: number;
}

export function BreakEvenChart({ inputs, breakEvenPoint }: BreakEvenChartProps) {
  // Generate data points for the chart
  const generateChartData = () => {
    const maxUnits = Math.ceil(breakEvenPoint * 2); // Show up to 2x break-even
    const step = Math.max(1, Math.floor(maxUnits / 50)); // ~50 data points
    const data = [];

    for (let units = 0; units <= maxUnits; units += step) {
      const totalRevenue = units * inputs.sellingPrice;
      const totalCosts = inputs.fixedCosts + units * inputs.variableCosts;
      // const profit = calculateProfitAtUnits(units, inputs);

      data.push({
        units,
        revenue: totalRevenue,
        costs: totalCosts,
        // profit,
      });
    }

    return data;
  };

  const data = generateChartData();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Break-Even Analysis</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {/* <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}> */}
          <LineChart >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="units"
              label={{ value: 'Units Sold', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              label={{
                value: 'Amount ($)',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              labelFormatter={units => `Units: ${units}`}
            />
            <Legend />

            {/* Revenue Line */}
            <Line
              type="monotone"
              dataKey="revenue"
              name="Total Revenue"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={false}
            />

            {/* Costs Line */}
            <Line
              type="monotone"
              dataKey="costs"
              name="Total Costs"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
            />

            {/* Profit Line */}
            <Line
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />

            {/* Break-even Reference Line */}
            <ReferenceLine
              x={breakEvenPoint}
              stroke="#6B7280"
              strokeDasharray="3 3"
              label={{
                value: `Break-even: ${breakEvenPoint} units`,
                position: 'top',
                fill: '#6B7280',
              }}
            />

            {/* Zero Profit Reference Line */}
            <ReferenceLine y={0} stroke="#6B7280" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <p className="text-indigo-600 font-medium">Break-even Point</p>
          <p className="text-indigo-900">{breakEvenPoint} units</p>
        </div>

        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-red-600 font-medium">Fixed Costs</p>
          <p className="text-red-900">${inputs.fixedCosts.toFixed(2)}</p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-green-600 font-medium">Contribution Margin</p>
          <p className="text-green-900">
            ${(inputs.sellingPrice - inputs.variableCosts).toFixed(2)}/unit
          </p>
        </div>
      </div>
    </div>
  );
}
