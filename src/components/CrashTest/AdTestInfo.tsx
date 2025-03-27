import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';

interface AdTestInfoProps {
  formData: {
    hasAdTest: boolean;
    testDuration: number;
    adBudget: number;
    results: {
      impressions: number;
      clicks: number;
      leads: number;
      sales: number;
    };
    metrics: {
      cpl: number;
      cpm: number;
      cpc: number;
    };
  };
  onChange: (data: Partial<AdTestInfoProps['formData']>) => void;
}

export function AdTestInfo({ formData, onChange }: AdTestInfoProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Advertising Test</h3>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.hasAdTest}
            onChange={(e) => onChange({ hasAdTest: e.target.checked })}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="ml-2 text-sm text-gray-700">
            Has advertising test been conducted?
          </span>
        </label>
      </div>

      {formData.hasAdTest && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Duration (days)
              </label>
              <input
                type="number"
                min="1"
                value={formData.testDuration}
                onChange={(e) => onChange({ testDuration: parseInt(e.target.value) })}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Budget
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.adBudget}
                  onChange={(e) => onChange({ adBudget: parseFloat(e.target.value) })}
                  className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="0.00"
                />
                <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Test Results</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Impressions
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.results.impressions}
                  onChange={(e) => onChange({
                    results: {
                      ...formData.results,
                      impressions: parseInt(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clicks
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.results.clicks}
                  onChange={(e) => onChange({
                    results: {
                      ...formData.results,
                      clicks: parseInt(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leads
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.results.leads}
                  onChange={(e) => onChange({
                    results: {
                      ...formData.results,
                      leads: parseInt(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.results.sales}
                  onChange={(e) => onChange({
                    results: {
                      ...formData.results,
                      sales: parseInt(e.target.value)
                    }
                  })}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPL
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.metrics.cpl}
                    onChange={(e) => onChange({
                      metrics: {
                        ...formData.metrics,
                        cpl: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    placeholder="0.00"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPM
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.metrics.cpm}
                    onChange={(e) => onChange({
                      metrics: {
                        ...formData.metrics,
                        cpm: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    placeholder="0.00"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPC
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.metrics.cpc}
                    onChange={(e) => onChange({
                      metrics: {
                        ...formData.metrics,
                        cpc: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    placeholder="0.00"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}