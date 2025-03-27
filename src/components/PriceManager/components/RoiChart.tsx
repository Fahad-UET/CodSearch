import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface RoiChartProps {
  data: Array<{
    date: string;
    revenue: number;
    costs: number;
  }>;
  currency?: string;
}

export function RoiChart({ data, currency = '$' }: RoiChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      date: item.date,
      roi: ((item.revenue - item.costs) / item.costs) * 100
    }));
  }, [data]);

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Return on Investment (ROI) Evolution
      </h3>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'ROI']}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="ROI %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        ROI = ((Revenue - Costs) / Costs) × 100
      </div>
    </div>
  );
}