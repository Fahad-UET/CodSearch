import React from 'react';
import { Calculator } from 'lucide-react';
import { TotalCostAnalysis } from '@/components/PriceManager/components/TotalCostAnalysis';

export const BreakEvenAnalysis = () => {
  // Add cost calculations
  const monthlyChargesPerDelivered = 2.50;  // Example value
  const adsCostPerDelivered = 5.00;         // Example value
  const codFeesPerDelivered = 1.75;         // Example value
  const callCenterCostPerDelivered = 1.00;  // Example value
  const shippingCostPerDelivered = 3.75;    // Example value

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Break-Even Analysis</h2>
      </div>
      
      <TotalCostAnalysis
        monthlyChargesPerDelivered={monthlyChargesPerDelivered}
        adsCostPerDelivered={adsCostPerDelivered}
        codFeesPerDelivered={codFeesPerDelivered}
        callCenterCostPerDelivered={callCenterCostPerDelivered}
        shippingCostPerDelivered={shippingCostPerDelivered}
      />

      {/* Existing break-even analysis content */}
    </div>
  );
};