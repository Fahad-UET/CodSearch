import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { MetricsForm } from './components/MetricsForm';
import { ProfitChart } from './components/ProfitChart';
import { RateAdjustments } from './components/RateAdjustments';
import { generateChartData } from './utils/chartData';
import { MetricsState } from './types';

interface ProfitCalculatorProps {
  onClose: () => void;
  product: any;
}

export function ProfitCalculator({ product, onClose }: ProfitCalculatorProps) {
  const productPrice = product.price;
  const DEFAULT_METRICS = {
    availableStock: productPrice?.stock || 0,
    sellingPrice: productPrice?.salePrice || 0,
    advertisingCost: productPrice?.advertisingCost || 0,
    totalExpenses: productPrice?.totalExpenses || 0,
    purchasePrice: productPrice?.purchasePrice || 0,
    baseCPL: productPrice?.cpl || 0,
    baseConfirmationRate: productPrice?.confirmationRate || 0,
    baseDeliveryRate: productPrice?.deliveryRate || 0,
    leads: productPrice?.requiredLeads || 0,
    callCenterCost: productPrice?.companyServicesFee?.totalCallCenterFees || 0,
    // profit: productPrice?.netProfit?.grossprofit || 0,
    profit: productPrice?.netProfit?.totalNetProfit || productPrice?.netProfit || 0,
    advertisingChanges: [],
    confirmationChanges: [],
    deliveryChanges: [],
    priceChanges: [],
    stockChanges: [],
  };
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const chartData = useMemo(() => generateChartData(metrics), [metrics]);

  const handleMetricsChange = updates => {
    setMetrics(prev => ({
      ...prev,
      ...updates,
    }));
  };

  return (
    <div className="backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full ">
        {/* Header */}
        {/* <div className="flex justify-between items-center p-6 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-purple-900">Profit Evolution Chart</h2>
          <button
            onClick={onClose}
            className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div> */}

        {/* Content */}
        <div className="p-6 space-y-6 h-[calc(95vh-5rem)] overflow-y-auto">
          {/* Base Metrics Form */}
          {/* <MetricsForm metrics={metrics} onChange={handleMetricsChange} /> */}

          {/* Chart */}
          <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
            <ProfitChart data={chartData} productPrice={productPrice} product={product} />
          </div>

          {/* Rate Adjustments */}
          <RateAdjustments metrics={metrics} onChange={handleMetricsChange} />
        </div>
      </div>
    </div>
  );
}
