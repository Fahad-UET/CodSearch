import React from 'react';
import { DollarSign, Percent } from 'lucide-react';
import { useKpiStore } from '../../store/kpiStore';
import { KpiAnalytics } from './KpiTab/components/KpiAnalytics';

interface KpiTabProps {
  selectedCountry: string;
}

export function KpiTab({ selectedCountry }: KpiTabProps) {
  const { getCountrySettings, updateCountrySettings } = useKpiStore();
  const settings = getCountrySettings(selectedCountry);

  // Sample metrics data - in a real app, this would come from your analytics
  const metrics = {
    cpc: 1.2,
    cpl: 3.5,
    cpm: 8.0,
    roas: 2.8,
    ctr: 2.1,
    confirmationRate: 65,
    deliveryRate: 80,
    profitMargin: 35
  };

  const handleValueChange = (metricId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const updatedSettings = {
        ...settings,
        [metricId]: {
          ...settings[metricId as keyof typeof settings],
          high: numValue
        }
      };
      updateCountrySettings(selectedCountry, updatedSettings);
    }
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      {/* Analytics Section */}
      <KpiAnalytics 
        selectedCountry={selectedCountry}
        metrics={metrics}
      />

      {/* KPI Settings Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Cost Metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Metrics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Per Click (CPC)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0.00"
                  onChange={(e) => handleValueChange('cpc', e.target.value)}
                />
                <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Per Lead (CPL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0.00"
                  onChange={(e) => handleValueChange('cpl', e.target.value)}
                />
                <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Per Mille (CPM)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0.00"
                  onChange={(e) => handleValueChange('cpm', e.target.value)}
                />
                <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return on Ad Spend (ROAS)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0"
                  onChange={(e) => handleValueChange('roas', e.target.value)}
                />
                <Percent size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Click-Through Rate (CTR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0"
                  onChange={(e) => handleValueChange('ctr', e.target.value)}
                />
                <Percent size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profit Margin
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0"
                  onChange={(e) => handleValueChange('profitMargin', e.target.value)}
                />
                <Percent size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0"
                  onChange={(e) => handleValueChange('deliveryRate', e.target.value)}
                />
                <Percent size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmation Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0"
                  onChange={(e) => handleValueChange('confirmationRate', e.target.value)}
                />
                <Percent size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}