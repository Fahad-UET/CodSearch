import React from 'react';
import { useKpiStore } from '../../../store/kpiStore';

interface KpiMetric {
  id: string;
  label: string;
  unit: string;
}

interface KpiInputSectionProps {
  title: string;
  metrics: KpiMetric[];
  selectedCountry: string;
}

export function KpiInputSection({ title, metrics, selectedCountry }: KpiInputSectionProps) {
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
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {metrics.map(({ id, label, unit }) => (
          <div key={id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                {label}
              </label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-100" title="Low" />
                  <div className="w-3 h-3 rounded-full bg-yellow-100" title="Medium" />
                  <div className="w-3 h-3 rounded-full bg-green-100" title="High" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={unit === '%' ? "100" : "1000"}
                  step={unit === '%' ? "1" : "0.1"}
                  value={settings[id as keyof typeof settings].high}
                  onChange={(e) => handleValueChange(id, e.target.value)}
                  className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {settings[id as keyof typeof settings].low}{unit}
                  </span>
                  <span className="text-xs text-gray-500">
                    {settings[id as keyof typeof settings].medium}{unit}
                  </span>
                  <span className="text-xs text-gray-500">
                    {settings[id as keyof typeof settings].high}{unit}
                  </span>
                </div>
              </div>
              <div className="w-24">
                <input
                  type="number"
                  min="0"
                  max={unit === '%' ? 100 : undefined}
                  step={unit === '%' ? 1 : 0.1}
                  value={settings[id as keyof typeof settings].high}
                  onChange={(e) => handleValueChange(id, e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 text-right pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}