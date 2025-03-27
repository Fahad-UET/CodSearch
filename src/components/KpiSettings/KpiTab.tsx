import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { useKpiStore } from '../../store/kpiStore';

interface KpiTabProps {
  selectedCountry: string;
}

export function KpiTab({ selectedCountry }: KpiTabProps) {
  const { getCountrySettings, updateCountrySettings } = useKpiStore();
  const settings = getCountrySettings(selectedCountry);

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
      {/* Ads Metrics */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Ads Metrics</h3>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {/* Cost Per Click (CPC) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cost Per Click (CPC)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.cpc.high}
                onChange={(e) => handleValueChange('cpc', e.target.value)}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Cost Per Lead (CPL) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cost Per Lead (CPL)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.cpl.high}
                onChange={(e) => handleValueChange('cpl', e.target.value)}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Cost Per Mille (CPM) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cost Per Mille (CPM)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={settings.cpm.high}
                onChange={(e) => handleValueChange('cpm', e.target.value)}
                className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Return on Ad Spend (ROAS) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Return on Ad Spend (ROAS)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.roas.high}
                onChange={(e) => handleValueChange('roas', e.target.value)}
                className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>

          {/* Click-Through Rate (CTR) */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Click-Through Rate (CTR)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.ctr.high}
                onChange={(e) => handleValueChange('ctr', e.target.value)}
                className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>

          {/* Profit Margin */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Profit Margin</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.profitMargin.high}
                onChange={(e) => handleValueChange('profitMargin', e.target.value)}
                className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Performance */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Performance</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Delivery Rate</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.deliveryRate.high}
                onChange={(e) => handleValueChange('deliveryRate', e.target.value)}
                className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Confirmation Rate</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={settings.confirmationRate.high}
                onChange={(e) => handleValueChange('confirmationRate', e.target.value)}
                className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}