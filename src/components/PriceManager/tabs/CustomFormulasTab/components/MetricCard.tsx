import React from 'react';
import { MetricCardProps } from '../types';

const COLOR_STYLES = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  indigo: 'from-indigo-500 to-indigo-600',
  cyan: 'from-cyan-500 to-cyan-600',
  emerald: 'from-emerald-500 to-emerald-600'
};

export function MetricCard({ title, value, icon, format, color }: MetricCardProps) {
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return `$${value.toFixed(2)}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return Math.round(value).toLocaleString();
    }
  };

  return (
    <div className={`bg-gradient-to-br ${COLOR_STYLES[color]} rounded-xl p-6 text-white`}>
      <div className="flex items-center gap-2 mb-2">
        {React.cloneElement(icon as React.ReactElement, { 
          size: 20,
          className: `text-${color}-200`
        })}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-3xl font-bold">{formatValue(value)}</p>
    </div>
  );
}