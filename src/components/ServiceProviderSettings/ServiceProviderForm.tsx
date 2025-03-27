import React, { useState } from 'react';
import { Save, X, Plus, AlertCircle } from 'lucide-react';
import { ServiceProviderData, CountrySettingsData } from '../../services/serviceProviders/types';
import { CountrySettings } from './CountrySettings';
import { COUNTRIES } from '../../services/codNetwork/constants';

interface ServiceProviderFormProps {
  provider?: ServiceProviderData | null;
  onSave: (provider: ServiceProviderData) => void;
  onCancel: () => void;
}

const DEFAULT_COUNTRY_SETTINGS: CountrySettingsData = {
  shippingCosts: {
    withCallCenter: { shipping: 0, return: 0 },
    withoutCallCenter: { shipping: 0, return: 0 }
  },
  codFee: 5,
  callCenterFees: {
    gadget: { lead: 0, confirmation: 0, delivered: 0 },
    cosmetic: { lead: 0, confirmation: 0, delivered: 0 }
  }
};

export function ServiceProviderForm({ provider, onSave, onCancel }: ServiceProviderFormProps) {
  const [formData, setFormData] = useState<ServiceProviderData>(provider || {
    id: `provider-${Date.now()}`,
    name: '',
    isDefault: false,
    countries: {}
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Provider name is required');
      return;
    }

    if (Object.keys(formData.countries).length === 0) {
      setError('At least one country must be configured');
      return;
    }

    try {
      onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save provider');
    }
  };

  const handleAddCountry = (countryCode: string) => {
    setFormData(prev => ({
      ...prev,
      countries: {
        ...prev.countries,
        [countryCode]: DEFAULT_COUNTRY_SETTINGS
      }
    }));
  };

  const handleCountrySettingsUpdate = (countryCode: string, settings: CountrySettingsData) => {
    setFormData(prev => ({
      ...prev,
      countries: {
        ...prev.countries,
        [countryCode]: settings
      }
    }));
  };

  const handleRemoveCountry = (countryCode: string) => {
    const { [countryCode]: _, ...remainingCountries } = formData.countries;
    setFormData(prev => ({
      ...prev,
      countries: remainingCountries
    }));
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Provider Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            placeholder="Enter provider name"
          />
        </div>

        {/* Country Settings */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Country Settings</h3>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddCountry(e.target.value);
                  e.target.value = ''; // Reset select
                }
              }}
              className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              value=""
            >
              <option value="">Add Country...</option>
              {Object.entries(COUNTRIES)
                .filter(([code]) => !formData.countries[code])
                .map(([code, { name }]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
            </select>
          </div>

          <div className="space-y-6">
            {Object.entries(formData.countries).map(([countryCode, settings]) => (
              <div key={countryCode} className="relative">
                <button
                  type="button"
                  onClick={() => handleRemoveCountry(countryCode)}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X size={16} />
                </button>
                <CountrySettings
                  countryCode={countryCode}
                  settings={settings}
                  onUpdate={(settings) => handleCountrySettingsUpdate(countryCode, settings)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Save size={16} />
            Save Provider
          </button>
        </div>
      </form>
    </div>
  );
}