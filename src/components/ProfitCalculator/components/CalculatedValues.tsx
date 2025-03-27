import React from 'react';
import { DollarSign, TrendingUp, Package, Truck, RefreshCw, Phone } from 'lucide-react';

interface CalculatedValuesProps {
  metrics: {
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

export function CalculatedValues({ metrics }: CalculatedValuesProps) {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      {/* ROI Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          title="Return on Investment"
          value={formatPercent(metrics.roi)}
          icon={<TrendingUp className="text-indigo-600" />}
          color="indigo"
          large
        />
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          title="Expected Leads"
          value={metrics.expectedLeads.toString()}
          icon={<TrendingUp className="text-blue-600" />}
          color="blue"
        />
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon={<DollarSign className="text-green-600" />}
          color="green"
        />
        <MetricCard
          title="Total Profit"
          value={formatCurrency(metrics.totalProfit)}
          icon={<DollarSign className="text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Profit per Unit"
          value={formatCurrency(metrics.profitPerUnit)}
          icon={<Package className="text-cyan-600" />}
          color="cyan"
        />
        <MetricCard
          title="Profit Margin"
          value={formatPercent(metrics.profitMargin)}
          icon={<TrendingUp className="text-emerald-600" />}
          color="emerald"
        />
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          <CostItem
            label="Advertising Costs"
            value={formatCurrency(metrics.advertisingCosts)}
            icon={<TrendingUp size={16} />}
          />
          <CostItem
            label="Stock Purchase Costs"
            value={formatCurrency(metrics.stockCosts)}
            icon={<Package size={16} />}
          />
          <CostItem
            label="Delivery Costs"
            value={formatCurrency(metrics.deliveryCosts)}
            icon={<Truck size={16} />}
          />
          <CostItem
            label="Return Costs"
            value={formatCurrency(metrics.returnCosts)}
            icon={<RefreshCw size={16} />}
          />
          <CostItem
            label="COD Fees"
            value={formatCurrency(metrics.codFees)}
            icon={<DollarSign size={16} />}
          />
          <CostItem
            label="Call Center Costs"
            value={formatCurrency(metrics.callCenterCosts)}
            icon={<Phone size={16} />}
          />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'indigo' | 'cyan' | 'emerald';
  large?: boolean;
}

function MetricCard({ title, value, icon, color, large }: MetricCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    indigo: 'from-indigo-500 to-indigo-600',
    cyan: 'from-cyan-500 to-cyan-600',
    emerald: 'from-emerald-500 to-emerald-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl ${large ? 'p-8' : 'p-6'} text-white`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className={`font-medium ${large ? 'text-lg' : ''}`}>{title}</h3>
      </div>
      <p className={`font-bold ${large ? 'text-4xl' : 'text-3xl'}`}>{value}</p>
    </div>
  );
}

interface CostItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function CostItem({ label, value, icon }: CostItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <div className="text-gray-500">{icon}</div>
        <span className="text-gray-700">{label}</span>
      </div>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}