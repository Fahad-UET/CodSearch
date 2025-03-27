import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

interface ProfitMetricsProps {
  profitHistory: Array<{
    profit: number;
    revenue: number;
    costs: number;
  }>;
}

export function ProfitMetrics({ profitHistory }: ProfitMetricsProps) {
  const averageProfit = profitHistory.reduce((sum, entry) => sum + entry.profit, 0) / profitHistory.length;
  const maxProfit = Math.max(...profitHistory.map(entry => entry.profit));
  const minProfit = Math.min(...profitHistory.map(entry => entry.profit));

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign size={20} className="text-emerald-200" />
        <h3 className="font-medium">Profit Metrics</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-emerald-200">Average Profit</p>
          <p className="text-2xl font-bold">${averageProfit.toFixed(2)}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-emerald-200">Highest</p>
            <p className="text-lg font-semibold">${maxProfit.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-emerald-200">Lowest</p>
            <p className="text-lg font-semibold">${minProfit.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}