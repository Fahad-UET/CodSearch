import React from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface ProfitTrendsProps {
  profitHistory: Array<{
    profit: number;
    date: string;
  }>;
}

export function ProfitTrends({ profitHistory }: ProfitTrendsProps) {
  // Calculate 7-day and 30-day trends
  const calculateTrend = (days: number) => {
    if (profitHistory.length < days) return 0;
    const recent = profitHistory[profitHistory.length - 1].profit;
    const past = profitHistory[profitHistory.length - days].profit;
    return ((recent - past) / past) * 100;
  };

  const weekTrend = calculateTrend(7);
  const monthTrend = calculateTrend(30);

  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-blue-200" />
        <h3 className="font-medium">Profit Trends</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-blue-200">7-Day Trend</p>
          <div className="flex items-center gap-2">
            {weekTrend >= 0 ? (
              <ArrowUp className="text-green-300" />
            ) : (
              <ArrowDown className="text-red-300" />
            )}
            <p className="text-2xl font-bold">
              {Math.abs(weekTrend).toFixed(1)}%
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-blue-200">30-Day Trend</p>
          <div className="flex items-center gap-2">
            {monthTrend >= 0 ? (
              <ArrowUp className="text-green-300" />
            ) : (
              <ArrowDown className="text-red-300" />
            )}
            <p className="text-2xl font-bold">
              {Math.abs(monthTrend).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}