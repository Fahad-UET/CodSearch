import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Package2, Truck, Phone, DollarSign } from 'lucide-react';

interface ServiceParticipationProps {
  variables: Record<string, number>;
}

export function ServiceParticipation({ variables }: ServiceParticipationProps) {
  const services = [
    {
      name: 'Service de Livraison',
      value: variables.shippingCosts || 0,
      icon: Truck,
      color: '#60A5FA' // blue
    },
    {
      name: 'Call Center',
      value: variables.callCenterCosts || 0,
      icon: Phone,
      color: '#34D399' // green
    },
    {
      name: 'Frais COD',
      value: variables.codFees || 0,
      icon: DollarSign,
      color: '#F472B6' // pink
    },
    {
      name: 'Autres Services',
      value: variables.otherServiceCosts || 0,
      icon: Package2,
      color: '#A78BFA' // purple
    }
  ];

  const totalValue = services.reduce((sum, service) => sum + service.value, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Participation des Services</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={services}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {services.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Service List */}
        <div className="space-y-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            const percentage = totalValue > 0 ? (service.value / totalValue) * 100 : 0;

            return (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${service.color}20`, color: service.color }}
                >
                  <Icon size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {service.name}
                    </span>
                    <span className="text-sm text-gray-900">
                      ${service.value.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: service.color
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% du total
                    </span>
                    <span className="text-xs text-gray-500">
                      ${(service.value / totalValue).toFixed(2)} par unité
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Total Services</span>
              <span className="text-lg font-semibold text-gray-900">
                ${totalValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}