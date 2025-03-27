import React from 'react';
import { X, TrendingUp, DollarSign, Percent, Package, CheckCircle2, Truck, BarChart2 } from 'lucide-react';
import { ProductMetrics } from '../types';

interface MetricsModalProps {
  metrics: ProductMetrics;
  onClose: () => void;
}

export function MetricsModal({ metrics, onClose }: MetricsModalProps) {
  const formatMetric = (value: number | undefined, suffix: string = '') => {
    if (value === undefined) return '-';
    return `${value.toFixed(2)}${suffix}`;
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <BarChart2 size={24} className="text-purple-600" />
            <h2 className="text-xl font-semibold">Performance Metrics</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* CPM Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} className="text-blue-200" />
                <h3 className="font-medium">Cost Per Mille (CPM)</h3>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(metrics.cpm)}</p>
              <p className="text-sm text-blue-200 mt-1">Cost per 1,000 impressions</p>
            </div>

            {/* CPC Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} className="text-green-200" />
                <h3 className="font-medium">Cost Per Click (CPC)</h3>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(metrics.cpc)}</p>
              <p className="text-sm text-green-200 mt-1">Average cost per click</p>
            </div>

            {/* CPL Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} className="text-purple-200" />
                <h3 className="font-medium">Cost Per Lead (CPL)</h3>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(metrics.cpl)}</p>
              <p className="text-sm text-purple-200 mt-1">Average cost per lead</p>
            </div>

            {/* CTR Card */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Percent size={20} className="text-yellow-200" />
                <h3 className="font-medium">Click-Through Rate (CTR)</h3>
              </div>
              <p className="text-3xl font-bold">{formatMetric(metrics.ctr, '%')}</p>
              <p className="text-sm text-yellow-200 mt-1">Clicks per impression</p>
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={20} className="text-orange-200" />
                <h3 className="font-medium">Conversion Rate (CR)</h3>
              </div>
              <p className="text-3xl font-bold">{formatMetric(metrics.cr, '%')}</p>
              <p className="text-sm text-orange-200 mt-1">Leads to sales ratio</p>
            </div>

            {/* Delivery Rate Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Truck size={20} className="text-emerald-200" />
                <h3 className="font-medium">Delivery Rate</h3>
              </div>
              <p className="text-3xl font-bold">{formatMetric(metrics.deliveryRate, '%')}</p>
              <p className="text-sm text-emerald-200 mt-1">Successful deliveries</p>
            </div>

            {/* Confirmation Rate Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={20} className="text-indigo-200" />
                <h3 className="font-medium">Confirmation Rate</h3>
              </div>
              <p className="text-3xl font-bold">{formatMetric(metrics.confirmationRate, '%')}</p>
              <p className="text-sm text-indigo-200 mt-1">Order confirmation rate</p>
            </div>

            {/* ROAS Card */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-red-200" />
                <h3 className="font-medium">ROAS</h3>
              </div>
              <p className="text-3xl font-bold">{formatMetric(metrics.roas, 'x')}</p>
              <p className="text-sm text-red-200 mt-1">Return on ad spend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}