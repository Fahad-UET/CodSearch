import React from 'react';
import { DollarSign, TrendingUp, Users, BarChart2 } from 'lucide-react';

interface KpiResultsGridProps {
  metrics: {
    expectedLeads: number;
    totalRevenue: number;
    totalProfit: number;
    roi: number;
    profitPerUnit: number;
    profitMargin: number;
  };
}

export function KpiResultsGrid({ metrics }: KpiResultsGridProps) {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Expected Leads */}
      <div className="bg-blue-500 rounded-xl p-4 text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-blue-100" />
            <span className="text-sm font-medium text-blue-100">Expected Leads</span>
          </div>
          <div className="text-3xl font-bold mt-auto">{Math.round(metrics.expectedLeads)}</div>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-green-500 rounded-xl p-4 text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-green-100" />
            <span className="text-sm font-medium text-green-100">Total Revenue</span>
          </div>
          <div className="text-3xl font-bold mt-auto">{formatCurrency(metrics.totalRevenue)}</div>
        </div>
      </div>

      {/* Total Profit */}
      <div className="bg-purple-500 rounded-xl p-4 text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-purple-100" />
            <span className="text-sm font-medium text-purple-100">Total Profit</span>
          </div>
          <div className="text-3xl font-bold mt-auto">{formatCurrency(metrics.totalProfit)}</div>
        </div>
      </div>

      {/* ROI */}
      <div className="bg-indigo-500 rounded-xl p-4 text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-indigo-100" />
            <span className="text-sm font-medium text-indigo-100">ROI</span>
          </div>
          <div className="text-3xl font-bold mt-auto">{formatPercent(metrics.roi)}</div>
        </div>
      </div>

      {/* Profit per Unit */}
      <div className="bg-cyan-500 rounded-xl p-4 text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={20} className="text-cyan-100" />
            <span className="text-sm font-medium text-cyan-100">Profit per Unit</span>
          </div>
          <div className="text-3xl font-bold mt-auto">{formatCurrency(metrics.profitPerUnit)}</div>
        </div>
      </div>

      {/* Profit Margin */}
      <div className="bg-emerald-500 rounded-xl p-4 text-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-emerald-100" />
            <span className="text-sm font-medium text-emerald-100">Profit Margin</span>
          </div>
          <div className="text-3xl font-bold mt-auto">{formatPercent(metrics.profitMargin)}</div>
        </div>
      </div>
    </div>
  );
}