import React from 'react';
import { Calculator, TrendingUp, BarChart3, DollarSign } from 'lucide-react';

interface ResultsSectionProps {
  salePrice: number;
  purchasePrice: number;
  confirmationRate: number;
  deliveryRate: number;
  adsCpl: number;
  monthlyCharges: number;
  leadCost: number;
  withCallCenter: boolean;
  selectedCountry: string;
}

export function ResultsSection({
  salePrice,
  purchasePrice,
  confirmationRate,
  deliveryRate,
  adsCpl,
  monthlyCharges,
  leadCost,
  withCallCenter,
  selectedCountry
}: ResultsSectionProps) {
  const calculateResults = () => {
    const confirmedOrders = confirmationRate / 100;
    const deliveredOrders = deliveryRate / 100;
    const successfulDeliveries = confirmedOrders * deliveredOrders;
    
    const serviceFee = selectedCountry === 'KSA' ? 0.05 : 0.05; // 5% for all countries for now
    const serviceFeeAmount = salePrice * serviceFee;
    
    const costPerOrder = purchasePrice + 
                        serviceFeeAmount + 
                        adsCpl +
                        (withCallCenter ? leadCost : 0);

    const revenuePerOrder = salePrice * successfulDeliveries;
    const profitPerOrder = revenuePerOrder - costPerOrder;
    const monthlyBreakEvenOrders = monthlyCharges / profitPerOrder;
    const profitMargin = (profitPerOrder / salePrice) * 100;

    return {
      profitPerOrder,
      monthlyBreakEvenOrders: Math.ceil(monthlyBreakEvenOrders),
      successRate: successfulDeliveries * 100,
      profitMargin
    };
  };

  const results = calculateResults();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Calculator size={20} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Results</h3>
      </div>

      <div className="space-y-4">
        {/* Profit per Order */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-purple-200" />
            <h4 className="text-sm font-medium text-purple-100">Profit per Order</h4>
          </div>
          <p className="text-3xl font-bold">${results.profitPerOrder.toFixed(2)}</p>
        </div>

        {/* Monthly Break-even */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={16} className="text-emerald-200" />
            <h4 className="text-sm font-medium text-emerald-100">Monthly Break-even Orders</h4>
          </div>
          <p className="text-3xl font-bold">{results.monthlyBreakEvenOrders}</p>
        </div>

        {/* Success Rate */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-200" />
            <h4 className="text-sm font-medium text-blue-100">Success Rate</h4>
          </div>
          <p className="text-3xl font-bold">{results.successRate.toFixed(1)}%</p>
        </div>

        {/* Profit Margin */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-amber-200" />
            <h4 className="text-sm font-medium text-amber-100">Profit Margin</h4>
          </div>
          <p className="text-3xl font-bold">{results.profitMargin.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}