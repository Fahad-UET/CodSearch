import React from 'react';
import { DollarSign, Percent } from 'lucide-react';
import { useKpiStore } from '../../../store/kpiStore';
import { KpiThresholdInput } from '../../KpiSettings/KpiThresholdInput';

interface KpiValuesTabProps {
  selectedCountry: string;
}

export function KpiValuesTab({ selectedCountry }: KpiValuesTabProps) {
  const { getCountrySettings, updateCountrySettings } = useKpiStore();
  const settings = getCountrySettings(selectedCountry);

  const handleThresholdChange = (
    metricId: keyof typeof settings,
    low: number,
    medium: number,
    high: number
  ) => {
    const updatedSettings = {
      ...settings,
      [metricId]: { low, medium, high }
    };
    updateCountrySettings(selectedCountry, updatedSettings);
  };

  return (
    <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-6">
        {/* Cost Metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Metrics</h3>
          <div className="space-y-6">
            <KpiThresholdInput
              label="Cost Per Click (CPC)"
              value={settings.cpc}
              onChange={(low, medium, high) => handleThresholdChange('cpc', low, medium, high)}
              unit="$"
            />
            <KpiThresholdInput
              label="Cost Per Lead (CPL)"
              value={settings.cpl}
              onChange={(low, medium, high) => handleThresholdChange('cpl', low, medium, high)}
              unit="$"
            />
            <KpiThresholdInput
              label="Cost Per Mille (CPM)"
              value={settings.cpm}
              onChange={(low, medium, high) => handleThresholdChange('cpm', low, medium, high)}
              unit="$"
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="space-y-6">
            <KpiThresholdInput
              label="Return on Ad Spend (ROAS)"
              value={settings.roas}
              onChange={(low, medium, high) => handleThresholdChange('roas', low, medium, high)}
              unit="%"
            />
            <KpiThresholdInput
              label="Click-Through Rate (CTR)"
              value={settings.ctr}
              onChange={(low, medium, high) => handleThresholdChange('ctr', low, medium, high)}
              unit="%"
            />
            <KpiThresholdInput
              label="Profit Margin"
              value={settings.profitMargin}
              onChange={(low, medium, high) => handleThresholdChange('profitMargin', low, medium, high)}
              unit="%"
            />
          </div>
        </div>

        {/* Delivery Metrics */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Performance</h3>
          <div className="space-y-6">
            <KpiThresholdInput
              label="Delivery Rate"
              value={settings.deliveryRate}
              onChange={(low, medium, high) => handleThresholdChange('deliveryRate', low, medium, high)}
              unit="%"
            />
            <KpiThresholdInput
              label="Confirmation Rate"
              value={settings.confirmationRate}
              onChange={(low, medium, high) => handleThresholdChange('confirmationRate', low, medium, high)}
              unit="%"
            />
          </div>
        </div>

        {/* Threshold Legend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Threshold Guide</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-100"></div>
              <div>
                <p className="font-medium text-gray-900">Low Threshold</p>
                <p className="text-sm text-gray-500">Below acceptable performance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-100"></div>
              <div>
                <p className="font-medium text-gray-900">Medium Threshold</p>
                <p className="text-sm text-gray-500">Meeting basic targets</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-100"></div>
              <div>
                <p className="font-medium text-gray-900">High Threshold</p>
                <p className="text-sm text-gray-500">Exceeding expectations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}