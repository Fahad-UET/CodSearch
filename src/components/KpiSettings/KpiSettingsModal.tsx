import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Save, AlertCircle } from 'lucide-react';
import { useKpiStore } from '../../store/kpiStore';
import { DEFAULT_KPI_SETTINGS, CountryKpiSettings } from '../../types/kpi';
import { CountrySelector } from './CountrySelector';
import { KpiThresholdInput } from './KpiThresholdInput';

interface KpiSettingsModalProps {
  onClose: () => void;
}

export function KpiSettingsModal({ onClose }: KpiSettingsModalProps) {
  const { settings, updateCountrySettings, resetToDefaults, getCountrySettings } = useKpiStore();
  const [selectedCountry, setSelectedCountry] = useState('SAR');
  const [localSettings, setLocalSettings] = useState<CountryKpiSettings>(
    getCountrySettings('SAR')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setLocalSettings(getCountrySettings(selectedCountry));
  }, [selectedCountry, getCountrySettings]);

  const handleSave = () => {
    setIsSaving(true);
    updateCountrySettings(selectedCountry, localSettings);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const handleReset = () => {
    resetToDefaults(selectedCountry);
    setLocalSettings(DEFAULT_KPI_SETTINGS);
    setShowResetConfirm(false);
  };

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setLocalSettings(getCountrySettings(countryCode));
  };

  const updateThreshold = (
    kpi: keyof CountryKpiSettings,
    low: number,
    medium: number,
    high: number
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [kpi]: { low, medium, high }
    }));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md z-[100] flex items-center justify-center">
      <div className="bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-xl w-full max-w-5xl shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-purple-900">KPI Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-130px)]">
          <div className="flex justify-between items-center mb-6">
            <CountrySelector
              selectedCountry={selectedCountry}
              onCountryChange={handleCountryChange}
            />
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset to Defaults
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <KpiThresholdInput
              label="Cost Per Click (CPC)"
              value={localSettings.cpc}
              onChange={(low, medium, high) => updateThreshold('cpc', low, medium, high)}
              unit="€"
            />
            <KpiThresholdInput
              label="Cost Per Lead (CPL)"
              value={localSettings.cpl}
              onChange={(low, medium, high) => updateThreshold('cpl', low, medium, high)}
              unit="€"
            />
            <KpiThresholdInput
              label="Cost Per Mille (CPM)"
              value={localSettings.cpm}
              onChange={(low, medium, high) => updateThreshold('cpm', low, medium, high)}
              unit="€"
            />
            <KpiThresholdInput
              label="Return on Ad Spend (ROAS)"
              value={localSettings.roas}
              onChange={(low, medium, high) => updateThreshold('roas', low, medium, high)}
              unit="%"
            />
            <KpiThresholdInput
              label="Click-Through Rate (CTR)"
              value={localSettings.ctr}
              onChange={(low, medium, high) => updateThreshold('ctr', low, medium, high)}
              unit="%"
            />
            <KpiThresholdInput
              label="Confirmation Rate"
              value={localSettings.confirmationRate}
              onChange={(low, medium, high) => updateThreshold('confirmationRate', low, medium, high)}
              unit="%"
            />
            <KpiThresholdInput
              label="Delivery Rate"
              value={localSettings.deliveryRate}
              onChange={(low, medium, high) => updateThreshold('deliveryRate', low, medium, high)}
              unit="%"
            />
            <KpiThresholdInput
              label="Profit Margin"
              value={localSettings.profitMargin}
              onChange={(low, medium, high) => updateThreshold('profitMargin', low, medium, high)}
              unit="%"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-white/80 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Settings
              </>
            )}
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle size={24} className="text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Reset to Defaults?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    This will reset all KPI thresholds for {selectedCountry} to their default values. This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}