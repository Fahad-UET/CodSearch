import React from 'react';
import { Building, Globe, Settings } from 'lucide-react';
import { COUNTRIES } from '../../../../../services/codNetwork/constants';

interface ServiceSettingsProps {
  settings: {
    confirmationRate: number;
    deliveryRate: number;
    cpl: number;
    chargePerProduct: number;
    stock: number;
    productType: 'cosmetic' | 'gadget';
    serviceType: 'with' | 'without';
  };
  onSettingsChange: (settings: ServiceSettingsProps['settings']) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export function ServiceSettings({
  settings,
  onSettingsChange,
  selectedCountry,
  onCountryChange
}: ServiceSettingsProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Settings size={20} className="text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Service Settings</h3>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Service Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Building size={16} className="text-purple-600" />
              Service Provider
            </div>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-purple-600" />
              Country
            </div>
          </label>
          <select
            value={selectedCountry}
            onChange={e => onCountryChange(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            {Object.entries(COUNTRIES).map(([code, { name }]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
          <select
            value={settings.productType}
            onChange={e => onSettingsChange({
              ...settings,
              productType: e.target.value as 'cosmetic' | 'gadget'
            })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            <option value="cosmetic">Cosmetic</option>
            <option value="gadget">Gadget</option>
          </select>
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
          <select
            value={settings.serviceType}
            onChange={e => onSettingsChange({
              ...settings,
              serviceType: e.target.value as 'with' | 'without'
            })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            <option value="with">With Call Center</option>
            <option value="without">Without Call Center</option>
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Stock</label>
          <input
            type="number"
            min="0"
            value={settings.stock}
            onChange={e => onSettingsChange({
              ...settings,
              stock: parseInt(e.target.value) || 0
            })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>

        {/* CPL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost Per Lead (CPL)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.1"
              value={settings.cpl}
              onChange={e => onSettingsChange({
                ...settings,
                cpl: parseFloat(e.target.value) || 0
              })}
              className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          </div>
        </div>
      </div>
    </div>
  );
}