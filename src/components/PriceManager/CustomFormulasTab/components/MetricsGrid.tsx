import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Package } from 'lucide-react';

interface MetricsGridProps {
  variables: Record<string, number>;
}

export function MetricsGrid({ variables }: MetricsGridProps) {
  const metrics = [
    {
      label: 'Coût par Lead',
      value: variables.cpl || 0,
      icon: DollarSign,
      color: 'blue',
      format: (val: number) => `$${val.toFixed(2)}`
    },
    {
      label: 'Taux de Confirmation',
      value: variables.confirmationRate || 0,
      icon: TrendingUp,
      color: 'green',
      format: (val: number) => `${val.toFixed(1)}%`
    },
    {
      label: 'Taux de Livraison',
      value: variables.deliveryRate || 0,
      icon: Package,
      color: 'purple',
      format: (val: number) => `${val.toFixed(1)}%`
    },
    {
      label: 'ROAS',
      value: variables.roas || 0,
      icon: BarChart2,
      color: 'orange',
      format: (val: number) => `${val.toFixed(2)}x`
    }
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Métriques Clés</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colors = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            orange: 'bg-orange-50 text-orange-600'
          };

          return (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${colors[metric.color as keyof typeof colors]}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {metric.format(metric.value)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}