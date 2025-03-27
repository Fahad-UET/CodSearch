import React from 'react';
import { DollarSign } from 'lucide-react';

interface CostBreakdownProps {
  monthlyChargesPerDelivered: number;
  adsCostPerDelivered: number;
  codFeesPerDelivered: number;
  callCenterCostPerDelivered: number;
  shippingCostPerDelivered: number;
}

export const TotalCostAnalysis = ({
  monthlyChargesPerDelivered,
  adsCostPerDelivered,
  codFeesPerDelivered,
  callCenterCostPerDelivered,
  shippingCostPerDelivered,
}: CostBreakdownProps) => {
  const totalCostPerDelivered = 
    monthlyChargesPerDelivered +
    adsCostPerDelivered +
    codFeesPerDelivered +
    callCenterCostPerDelivered +
    shippingCostPerDelivered;

  const costItems = [
    { label: 'Monthly Charges per Delivered', value: monthlyChargesPerDelivered },
    { label: 'Ads Cost per Delivered', value: adsCostPerDelivered },
    { label: 'COD Fees per Delivered', value: codFeesPerDelivered },
    { label: 'Call Center Cost per Delivered', value: callCenterCostPerDelivered },
    { label: 'Shipping Cost per Delivered', value: shippingCostPerDelivered },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Total Cost per Delivered</h3>
      </div>

      <div className="space-y-3">
        {costItems.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="font-medium text-gray-900">
              ${item.value.toFixed(2)}
            </span>
          </div>
        ))}

        <div className="pt-4 flex justify-between items-center text-lg font-semibold">
          <span className="text-gray-900">Total Cost</span>
          <span className="text-primary-600">
            ${totalCostPerDelivered.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};