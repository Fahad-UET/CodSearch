import React from 'react';
import { TrendingUp, Truck, RotateCcw, Phone, Package2 } from 'lucide-react';

interface CostBreakdownProps {
  costs: {
    advertisingCosts: number;
    stockCosts: number;
    deliveryCosts: number;
    returnCosts: number;
    codFees: number;
    callCenterCosts: number;
  };
}

export function CostBreakdown({ costs }: CostBreakdownProps) {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-blue-500" />
            <span className="text-gray-700">Advertising Costs</span>
          </div>
          <span className="font-medium text-gray-900">{formatCurrency(costs.advertisingCosts)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Package2 size={20} className="text-purple-500" />
            <span className="text-gray-700">Stock Purchase Costs</span>
          </div>
          <span className="font-medium text-gray-900">{formatCurrency(costs.stockCosts)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-green-500" />
            <span className="text-gray-700">Delivery Costs</span>
          </div>
          <span className="font-medium text-gray-900">{formatCurrency(costs.deliveryCosts)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <RotateCcw size={20} className="text-red-500" />
            <span className="text-gray-700">Return Costs</span>
          </div>
          <span className="font-medium text-gray-900">{formatCurrency(costs.returnCosts)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-amber-500" />
            <span className="text-gray-700">COD Fees</span>
          </div>
          <span className="font-medium text-gray-900">{formatCurrency(costs.codFees)}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Phone size={20} className="text-indigo-500" />
            <span className="text-gray-700">Call Center Costs</span>
          </div>
          <span className="font-medium text-gray-900">{formatCurrency(costs.callCenterCosts)}</span>
        </div>
      </div>
    </div>
  );
}