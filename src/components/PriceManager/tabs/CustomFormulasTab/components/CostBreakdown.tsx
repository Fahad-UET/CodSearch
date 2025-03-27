import React from 'react';
import { DollarSign, TrendingUp, Truck, RefreshCw, CreditCard, Phone } from 'lucide-react';
import { CostBreakdown as CostBreakdownType } from '../types';

interface CostBreakdownProps {
  costs: CostBreakdownType;
}

export function CostBreakdown({ costs }: CostBreakdownProps) {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  const costItems = [
    { label: 'Advertising Costs', value: costs.advertisingCosts, icon: <TrendingUp size={16} /> },
    { label: 'Stock Purchase Costs', value: costs.stockCosts, icon: <DollarSign size={16} /> },
    { label: 'Delivery Costs', value: costs.deliveryCosts, icon: <Truck size={16} /> },
    { label: 'Return Costs', value: costs.returnCosts, icon: <RefreshCw size={16} /> },
    { label: 'COD Fees', value: costs.codFees, icon: <CreditCard size={16} /> },
    { label: 'Call Center Costs', value: costs.callCenterCosts, icon: <Phone size={16} /> }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
      <div className="grid grid-cols-2 gap-4">
        {costItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                {item.icon}
              </div>
              <span className="font-medium text-gray-700">{item.label}</span>
            </div>
            <span className="font-semibold text-gray-900">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}