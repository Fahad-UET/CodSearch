import React from 'react';
import { TrendingUp, DollarSign, Percent, CheckCircle2, Truck } from 'lucide-react';
import { ProductMetrics } from '../../types';

interface MetricsSectionProps {
  metrics: ProductMetrics;
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  if (!metrics || Object.values(metrics).every(v => v === undefined)) {
    return null;
  }

  const formatMetric = (value: number | undefined, suffix: string = '') => {
    if (value === undefined) return null;
    return `${value.toFixed(1)}${suffix}`;
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return null;
    return `$${value.toFixed(2)}`;
  };

  // Only show metrics that have values
  const metricsToShow = [
    {
      value: formatCurrency(metrics.cpl),
      label: 'CPL',
      icon: <DollarSign size={12} className="text-purple-500" />,
      bgColor: 'bg-purple-50'
    },
    {
      value: formatMetric(metrics.cr, '%'),
      label: 'CR',
      icon: <CheckCircle2 size={12} className="text-green-500" />,
      bgColor: 'bg-green-50'
    },
    {
      value: formatMetric(metrics.deliveryRate, '%'),
      label: 'Del',
      icon: <Truck size={12} className="text-blue-500" />,
      bgColor: 'bg-blue-50'
    },
    {
      value: formatMetric(metrics.roas, 'x'),
      label: 'ROAS',
      icon: <TrendingUp size={12} className="text-amber-500" />,
      bgColor: 'bg-amber-50'
    }
  ].filter(metric => metric.value !== null);

  if (metricsToShow.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {metricsToShow.map((metric, index) => (
        <div
          key={index}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg ${metric.bgColor} text-xs`}
        >
          {metric.icon}
          <span className="font-medium">
            {metric.label}: {metric.value}
          </span>
        </div>
      ))}
    </div>
  );
}