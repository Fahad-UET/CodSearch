import React from 'react';
import { TrendingUp, DollarSign, Users, BarChart2, PieChart } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { CalculatedMetrics } from '../types';

interface MetricsGridProps {
  metrics: CalculatedMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard
        title="Required Leads"
        value={metrics.expectedLeads}
        icon={<Users />}
        format="number"
        color="blue"
      />
      
      <MetricCard
        title="Total Sale"
        value={metrics.totalRevenue}
        icon={<DollarSign />}
        format="currency"
        color="green"
      />
      
      <MetricCard
        title="Total Profit"
        value={metrics.totalProfit}
        icon={<BarChart2/>}
        format="currency"
        color="purple"
      />
      
      <MetricCard
        title="ROI"
        value={metrics.roi}
        icon={<TrendingUp />}
        format="percentage"
        color="indigo"
      />
      
      <MetricCard
        title="Profit per Unit"
        value={metrics.profitPerUnit}
        icon={<BarChart2 />}
        format="currency"
        color="cyan"
      />
      
      <MetricCard
        title="Profit Margin"
        value={metrics.profitMargin}
        icon={<PieChart />}
        format="percentage"
        color="emerald"
      />
    </div>
  );
}