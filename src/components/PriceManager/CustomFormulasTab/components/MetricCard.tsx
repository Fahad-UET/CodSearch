import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'purple' | 'blue' | 'green' | 'red';
}

const colorClasses = {
  purple: 'bg-purple-50 text-purple-700',
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  red: 'bg-red-50 text-red-700'
};

export function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  return (
    <div className={`p-4 rounded-lg ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={20} />
        <h4 className="font-medium">{title}</h4>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}