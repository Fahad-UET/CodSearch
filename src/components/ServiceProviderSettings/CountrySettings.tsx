import React from 'react';
import { Globe, DollarSign, Truck, Phone } from 'lucide-react';
import { CountrySettingsData } from '../../services/serviceProviders/types';
import { COUNTRIES } from '../../services/codNetwork/constants';

interface CountrySettingsProps {
  countryCode: string;
  settings: CountrySettingsData;
  onUpdate: (settings: CountrySettingsData) => void;
}

export function CountrySettings({ countryCode, settings, onUpdate }: CountrySettingsProps) {
  const country = COUNTRIES[countryCode as keyof typeof COUNTRIES];

  const handleShippingChange = (
    type: 'withCallCenter' | 'withoutCallCenter',
    field: 'shipping' | 'return',
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    onUpdate({
      ...settings,
      shippingCosts: {
        ...settings.shippingCosts,
        [type]: {
          ...settings.shippingCosts[type],
          [field]: numValue
        }
      }
    });
  };

  const handleCodFeeChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    onUpdate({
      ...settings,
      codFee: numValue
    });
  };

  const handleCallCenterFeeChange = (
    type: 'gadget' | 'cosmetic',
    field: 'lead' | 'confirmation' | 'delivered',
    value: string
  ) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    onUpdate({
      ...settings,
      callCenterFees: {
        ...settings.callCenterFees,
        [type]: {
          ...settings.callCenterFees[type],
          [field]: numValue
        }
      }
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Globe size={20} className="text-purple-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">{country?.name || countryCode}</h3>
      </div>

      <div className="space-y-6">
        {/* Shipping Costs */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Shipping & Return Costs</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* With Call Center */}
            <div className="space-y-3">
              <h5 className="text-sm text-gray-600">With Call Center</h5>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Shipping Cost</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shippingCosts.withCallCenter.shipping}
                    onChange={(e) => handleShippingChange('withCallCenter', 'shipping', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Return Cost</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shippingCosts.withCallCenter.return}
                    onChange={(e) => handleShippingChange('withCallCenter', 'return', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Without Call Center */}
            <div className="space-y-3">
              <h5 className="text-sm text-gray-600">Without Call Center</h5>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Shipping Cost</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shippingCosts.withoutCallCenter.shipping}
                    onChange={(e) => handleShippingChange('withoutCallCenter', 'shipping', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Return Cost</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.shippingCosts.withoutCallCenter.return}
                    onChange={(e) => handleShippingChange('withoutCallCenter', 'return', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COD Fee */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">COD Fee</h4>
          <div className="relative w-48">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.codFee}
              onChange={(e) => handleCodFeeChange(e.target.value)}
              className="w-full pl-8 pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
        </div>

        {/* Call Center Fees */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Call Center Fees</h4>
          <div className="grid grid-cols-2 gap-6">
            {/* Gadget Products */}
            <div className="space-y-3">
              <h5 className="text-sm text-gray-600">Gadget Products</h5>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lead Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.callCenterFees.gadget.lead}
                    onChange={(e) => handleCallCenterFeeChange('gadget', 'lead', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Confirmation Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.callCenterFees.gadget.confirmation}
                    onChange={(e) => handleCallCenterFeeChange('gadget', 'confirmation', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Delivery Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.callCenterFees.gadget.delivered}
                    onChange={(e) => handleCallCenterFeeChange('gadget', 'delivered', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Cosmetic Products */}
            <div className="space-y-3">
              <h5 className="text-sm text-gray-600">Cosmetic Products</h5>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lead Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.callCenterFees.cosmetic.lead}
                    onChange={(e) => handleCallCenterFeeChange('cosmetic', 'lead', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Confirmation Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.callCenterFees.cosmetic.confirmation}
                    onChange={(e) => handleCallCenterFeeChange('cosmetic', 'confirmation', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Delivery Fee</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.callCenterFees.cosmetic.delivered}
                    onChange={(e) => handleCallCenterFeeChange('cosmetic', 'delivered', e.target.value)}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}