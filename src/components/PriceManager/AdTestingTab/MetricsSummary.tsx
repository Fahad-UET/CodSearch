import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Package, Users, Truck } from 'lucide-react';
import { AverageMetrics } from './types';

interface MetricsSummaryProps {
  metrics: AverageMetrics;
}

export function MetricsSummary({ metrics }: MetricsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Cost Metrics */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-purple-200" />
          <h3 className="font-medium">Cost Metrics</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-purple-200">CPC</div>
            <div className="text-2xl font-bold">${metrics.cpc.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-purple-200">CPM</div>
            <div className="text-2xl font-bold">${metrics.cpm.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-purple-200">CPL</div>
            <div className="text-2xl font-bold">${metrics.cpl.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-blue-200" />
          <h3 className="font-medium">Performance</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-blue-200">CTR</div>
            <div className="text-2xl font-bold">{metrics.ctr.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-blue-200">Confirmation Rate</div>
            <div className="text-2xl font-bold">{metrics.confirmationRate.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-blue-200">Delivery Rate</div>
            <div className="text-2xl font-bold">{metrics.deliveryRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} className="text-green-200" />
          <h3 className="font-medium">Orders</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-green-200">Leads</div>
            <div className="text-2xl font-bold">{Math.round(metrics.leads)}</div>
          </div>
          <div>
            <div className="text-sm text-green-200">Confirmed</div>
            <div className="text-2xl font-bold">{Math.round(metrics.confirmedOrders)}</div>
          </div>
          <div>
            <div className="text-sm text-green-200">Delivered</div>
            <div className="text-2xl font-bold">{Math.round(metrics.deliveredOrders)}</div>
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={20} className="text-amber-200" />
          <h3 className="font-medium">Financial</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-sm text-amber-200">Selling Price</div>
            <div className="text-2xl font-bold">${metrics.sellingPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-amber-200">Daily Ad Budget</div>
            <div className="text-2xl font-bold">${metrics.adBudget.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}