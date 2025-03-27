import React, { useState } from 'react';
import { X, Plus, Trash2, RotateCcw, Edit2, Check, AlertCircle } from 'lucide-react';

interface CallCenterFees {
  gadget: {
    lead: number;
    confirmation: number;
    delivered: number;
  };
  cosmetic: {
    lead: number;
    confirmation: number;
    delivered: number;
  };
}

interface Region {
  name: string;
  shippingCostWithCallCenter: number;
  shippingCostWithoutCallCenter: number;
  returnCostWithCallCenter: number;
  returnCostWithoutCallCenter: number;
  codFee: number;
  callCenterFees: CallCenterFees;
}

interface ServiceProvider {
  name: string;
  country: string;
  regions: Region[];
}

interface ServiceSettingsModalProps {
  providers: ServiceProvider[];
  onSave: (providers: ServiceProvider[]) => void;
  onClose: () => void;
}

const DEFAULT_PROVIDER: ServiceProvider = {
  name: 'COD NETWORK',
  country: 'KSA',
  regions: []
};

export function ServiceSettingsModal({ providers = [], onSave, onClose }: ServiceSettingsModalProps) {
  const [localProviders, setLocalProviders] = useState<ServiceProvider[]>(providers.length > 0 ? providers : [DEFAULT_PROVIDER]);
  const [selectedProvider, setSelectedProvider] = useState<string>(DEFAULT_PROVIDER.name);
  const [selectedCountry, setSelectedCountry] = useState<string>(DEFAULT_PROVIDER.country);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countries = [
    { code: 'KSA', name: 'Saudi Arabia' },
    { code: 'UAE', name: 'United Arab Emirates' },
    { code: 'BHR', name: 'Bahrain' },
    { code: 'OMN', name: 'Oman' },
    { code: 'KWT', name: 'Kuwait' },
    { code: 'QTR', name: 'Qatar' },
    { code: 'ESP', name: 'Spain' },
    { code: 'PRT', name: 'Portugal' },
    { code: 'POL', name: 'Poland' },
    { code: 'CZE', name: 'Czech Republic' },
    { code: 'HUN', name: 'Hungary' },
    { code: 'SVK', name: 'Slovakia' },
    { code: 'ROU', name: 'Romania' },
    { code: 'LTU', name: 'Lithuania' },
    { code: 'SVN', name: 'Slovenia' },
    { code: 'HRV', name: 'Croatia' },
    { code: 'COL', name: 'Colombia' },
    { code: 'PAN', name: 'Panama' }
  ];

  const handleResetToDefaults = () => {
    const defaultProvider = {
      name: 'COD NETWORK',
      country: 'KSA',
      regions: []
    };

    setLocalProviders([defaultProvider]);
    setSelectedProvider(defaultProvider.name);
    setSelectedCountry(defaultProvider.country);
    setShowResetConfirm(false);
  };

  const handleSave = () => {
    onSave(localProviders);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Service Providers Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Manage shipping and call center fees</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset to Defaults
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Service Provider Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              >
                <option value="COD NETWORK">COD NETWORK</option>
                {localProviders
                  .filter(provider => provider.name !== 'COD NETWORK')
                  .map((provider) => (
                    <option key={provider.name} value={provider.name}>
                      {provider.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[80]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-100 rounded-full">
                <AlertCircle size={24} className="text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Reset to Defaults?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  This will reset all service providers to their default settings. This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResetToDefaults}
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
  );
}