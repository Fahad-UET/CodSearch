import React from 'react';
import { ProfitabilityMetrics } from './ProfitabilityMetrics';
import { ProfitabilityChart } from './ProfitabilityChart';

interface ProfitabilityAnalysisProps {
  variables: Record<string, number>;
}

export function ProfitabilityAnalysis({ variables }: ProfitabilityAnalysisProps) {
  // Calculate key metrics
  const revenue = variables.salePrice * variables.stock || 0;
  const costs = (variables.purchasePrice * variables.stock) + 
                (variables.cpl * variables.leads) +
                variables.totalMonthlyExpenses || 0;
  const profit = revenue - costs;
  const roi = costs > 0 ? (profit / costs) * 100 : 0;

  // Generate chart data points
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
      <ProfitabilityMetrics 
        revenue={revenue}
        profit={profit}
        roi={roi}
      />
      <ProfitabilityChart data={data} />
      
      {/* Analysis Summary */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Profitability Indicators</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${profit >= 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                Status: {profit >= 0 ? 'Profitable' : 'Loss-making'}
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${roi >= 30 ? 'bg-green-500' : roi >= 15 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                ROI: {roi.toFixed(1)}% ({roi >= 30 ? 'Good' : roi >= 15 ? 'Fair' : 'Poor'})
              </li>
              <li className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${profit / revenue >= 0.3 ? 'bg-green-500' : profit / revenue >= 0.15 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                Profit Margin: {((profit / revenue) * 100).toFixed(1)}%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}