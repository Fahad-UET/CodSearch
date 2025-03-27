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
import { formatCurrency } from '@/utils/calculations';

interface RoiChartProps {
  data: Array<{
    date: string;
    investment: number;
    revenue: number;
    roi: number;
  }>;
  currency?: string;
}

export function RoiChart({ data, currency = '$' }: RoiChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      roi: Number((item.roi * 100).toFixed(2))
    }));
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Return on Investment Analysis
      </h3>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'ROI') return `${value}%`;
                return formatCurrency(value, currency);
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="investment"
              stroke="#6366f1"
              name="Investment"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="#22c55e"
              name="Revenue"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="roi"
              stroke="#f59e0b"
              name="ROI"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}