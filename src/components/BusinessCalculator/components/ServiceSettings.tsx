import React from 'react';
import { Settings } from 'lucide-react';

interface ServiceSettingsProps {
  isCosmetic: boolean;
  withCallCenter: boolean;
  selectedCountry: string;
  onCosmeticChange: (value: boolean) => void;
  onCallCenterChange: (value: boolean) => void;
  onCountryChange: (value: string) => void;
}

const countries = [
  { code: 'KSA', name: 'Saudi Arabia', serviceFee: 5 },
  { code: 'UAE', name: 'United Arab Emirates', serviceFee: 5 }
];

export function ServiceSettings({
  isCosmetic,
  withCallCenter,
  selectedCountry,
  onCosmeticChange,
  onCallCenterChange,
  onCountryChange
}: ServiceSettingsProps) {
  const selectedCountryFee = countries.find(c => c.code === selectedCountry)?.serviceFee || 5;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={20} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Service Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Service Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Provider
          </label>
          <select
            value="COD NETWORK"
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            disabled
          >
            <option value="COD NETWORK">COD NETWORK</option>
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Fee (%)
          </label>
          <input
            type="number"
            value={selectedCountryFee}
            disabled
            className="w-full rounded-lg border-gray-300 bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Toggle Buttons */}
        <div className="space-y-4 pt-2">
          {/* Product Type Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Product Type</span>
            <button
              onClick={() => onCosmeticChange(!isCosmetic)}
              className={`relative inline-flex h-9 w-40 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                isCosmetic ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                  isCosmetic ? 'translate-x-32' : 'translate-x-1'
                }`}
              />
              <span className={`absolute left-3 text-sm font-medium ${isCosmetic ? 'text-white/0' : 'text-gray-900'}`}>
                Gadget
              </span>
              <span className={`absolute right-3 text-sm font-medium ${isCosmetic ? 'text-white' : 'text-gray-900/0'}`}>
                Cosmetic
              </span>
            </button>
          </div>

          {/* Call Center Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Call Center</span>
            <button
              onClick={() => onCallCenterChange(!withCallCenter)}
              className={`relative inline-flex h-9 w-40 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                withCallCenter ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                  withCallCenter ? 'translate-x-32' : 'translate-x-1'
                }`}
              />
              <span className={`absolute left-3 text-sm font-medium ${withCallCenter ? 'text-white/0' : 'text-gray-900'}`}>
                Without
              </span>
              <span className={`absolute right-3 text-sm font-medium ${withCallCenter ? 'text-white' : 'text-gray-900/0'}`}>
                With
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}