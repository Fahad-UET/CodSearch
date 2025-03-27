import React from 'react';
import { MetricsState } from '../types';

interface MetricsSummaryProps {
  metrics: MetricsState;
  calculatedValues: {
    expectedLeads: number;
    totalRevenue: number;
    totalProfit: number;
    roi: number;
    profitPerUnit: number;
    profitMargin: number;
    advertisingCosts: number;
    stockCosts: number;
    deliveryCosts: number;
    returnCosts: number;
    codFees: number;
    callCenterCosts: number;
  };
}

export function MetricsSummary({ metrics, calculatedValues }: MetricsSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Base Metrics */}
      <div className="bg-white/80 rounded-xl p-6 border border-purple-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Base Metrics</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600">Available Stock</label>
            <div className="text-lg font-semibold text-gray-900">{metrics.availableStock}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Selling Price ($)</label>
            <div className="text-lg font-semibold text-gray-900">{metrics.sellingPrice}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Purchase Price ($)</label>
            <div className="text-lg font-semibold text-gray-900">{metrics.purchasePrice}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Base CPL ($)</label>
            <div className="text-lg font-semibold text-gray-900">{metrics.baseCPL}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Base Confirmation Rate (%)</label>
            <div className="text-lg font-semibold text-gray-900">{metrics.baseConfirmationRate}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Base Delivery Rate (%)</label>
            <div className="text-lg font-semibold text-gray-900">{metrics.baseDeliveryRate}</div>
          </div>
        </div>
      </div>

      {/* Calculated Values */}
      <div className="grid grid-cols-3 gap-6">
        {/* Key Metrics */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 className="text-sm font-medium text-blue-700 mb-2">Expected Leads</h3>
          <div className="text-2xl font-bold text-blue-900">{calculatedValues.expectedLeads}</div>
          <div className="text-xs text-blue-600 mt-1">
            = {metrics.availableStock} × ({metrics.baseConfirmationRate}% × {metrics.baseDeliveryRate}%)
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <h3 className="text-sm font-medium text-green-700 mb-2">Total Revenue</h3>
          <div className="text-2xl font-bold text-green-900">${calculatedValues.totalRevenue.toFixed(2)}</div>
          <div className="text-xs text-green-600 mt-1">
            = {metrics.availableStock} × ${metrics.sellingPrice}
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <h3 className="text-sm font-medium text-purple-700 mb-2">Total Profit</h3>
          <div className="text-2xl font-bold text-purple-900">${calculatedValues.totalProfit.toFixed(2)}</div>
          <div className="text-xs text-purple-600 mt-1">Revenue - Total Costs</div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <h3 className="text-sm font-medium text-indigo-700 mb-2">Return on Investment (ROI)</h3>
          <div className="text-2xl font-bold text-indigo-900">{calculatedValues.roi.toFixed(2)}%</div>
          <div className="text-xs text-indigo-600 mt-1">Profit / Total Costs × 100</div>
        </div>

        <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
          <h3 className="text-sm font-medium text-pink-700 mb-2">Profit per Delivered Unit</h3>
          <div className="text-2xl font-bold text-pink-900">${calculatedValues.profitPerUnit.toFixed(2)}</div>
          <div className="text-xs text-pink-600 mt-1">Profit / Delivered Units</div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <h3 className="text-sm font-medium text-amber-700 mb-2">Profit Margin</h3>
          <div className="text-2xl font-bold text-amber-900">{calculatedValues.profitMargin.toFixed(2)}%</div>
          <div className="text-xs text-amber-600 mt-1">Profit / Revenue × 100</div>
        </div>
      </div>

      {/* Costs Breakdown */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
          <h3 className="text-sm font-medium text-rose-700 mb-2">Advertising Costs</h3>
          <div className="text-2xl font-bold text-rose-900">${calculatedValues.advertisingCosts.toFixed(2)}</div>
          <div className="text-xs text-rose-600 mt-1">CPL × Expected Leads</div>
        </div>

        <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-100">
          <h3 className="text-sm font-medium text-cyan-700 mb-2">Stock Purchase Costs</h3>
          <div className="text-2xl font-bold text-cyan-900">${calculatedValues.stockCosts.toFixed(2)}</div>
          <div className="text-xs text-cyan-600 mt-1">Purchase Price × Available Stock</div>
        </div>

        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <h3 className="text-sm font-medium text-orange-700 mb-2">Delivery Costs</h3>
          <div className="text-2xl font-bold text-orange-900">${calculatedValues.deliveryCosts.toFixed(2)}</div>
          <div className="text-xs text-orange-600 mt-1">$4.99 per delivered order</div>
        </div>

        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
          <h3 className="text-sm font-medium text-teal-700 mb-2">Return Costs</h3>
          <div className="text-2xl font-bold text-teal-900">${calculatedValues.returnCosts.toFixed(2)}</div>
          <div className="text-xs text-teal-600 mt-1">$2.99 per returned order</div>
        </div>

        <div className="bg-lime-50 rounded-xl p-4 border border-lime-100">
          <h3 className="text-sm font-medium text-lime-700 mb-2">COD Fees</h3>
          <div className="text-2xl font-bold text-lime-900">${calculatedValues.codFees.toFixed(2)}</div>
          <div className="text-xs text-lime-600 mt-1">5% of revenue (delivered orders × selling price)</div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <h3 className="text-sm font-medium text-emerald-700 mb-2">Call Center Costs</h3>
          <div className="text-2xl font-bold text-emerald-900">${calculatedValues.callCenterCosts.toFixed(2)}</div>
          <div className="text-xs text-emerald-600 mt-1">Based on leads volume and conversion rates</div>
        </div>
      </div>
    </div>
  );
}