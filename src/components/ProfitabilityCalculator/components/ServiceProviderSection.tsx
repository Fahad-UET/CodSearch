import React, { useState } from 'react';
import { Settings, ChevronDown, Truck, RotateCcw, Headphones, Users } from 'lucide-react';
import { selectClasses, countries } from '../constants';

interface ServiceProviderSectionProps {
  selectedCountry: string;
  productType: 'cosmetic' | 'gadget';
  serviceType: 'with' | 'without';
  onCountryChange: (value: string) => void;
  onProductTypeChange: (value: 'cosmetic' | 'gadget') => void;
  onServiceTypeChange: (value: 'with' | 'without') => void;
  onOpenSettings: () => void;
}

export function ServiceProviderSection({
  selectedCountry,
  productType,
  serviceType,
  onCountryChange,
  onProductTypeChange,
  onServiceTypeChange,
  onOpenSettings
}: ServiceProviderSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const selectedCountryData = countries.find(c => c.code === selectedCountry);
  const shippingCosts = selectedCountryData?.shippingCosts[serviceType] || { shipping: 0, return: 0 };
  const callCenterFees = selectedCountryData?.callCenterFees[productType] || { lead: 0, confirmation: 0, delivered: 0 };

  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-purple-100">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-lg font-semibold text-purple-900 hover:text-purple-700 transition-colors"
        >
          Service Provider
          <ChevronDown
            size={20}
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
        <button
          type="button"
          onClick={onOpenSettings  }
          className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          title="Provider Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Cost Summary Cards */}
      <div className="mt-4 grid grid-cols-1 gap-3">
        {/* Lead Costs */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-purple-600" />
            <h3 className="font-medium text-purple-900">Lead Costs</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">Cost per Lead:</span>
              <span className="font-medium text-purple-900">${Math.round(callCenterFees.lead)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">Confirmation Fee:</span>
              <span className="font-medium text-purple-900">${Math.round(callCenterFees.confirmation)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-700">Delivery Fee:</span>
              <span className="font-medium text-purple-900">${Math.round(callCenterFees.delivered)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Costs */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Truck size={20} className="text-blue-600" />
            <h3 className="font-medium text-blue-900">Shipping Costs</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Delivery Cost:</span>
              <span className="font-medium text-blue-900">${Math.round(shippingCosts.shipping)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Return Cost:</span>
              <span className="font-medium text-blue-900">${Math.round(shippingCosts.return)}</span>
            </div>
          </div>
        </div>

        {/* COD Fee */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <RotateCcw size={20} className="text-amber-600" />
            <h3 className="font-medium text-amber-900">COD Fee</h3>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-amber-700">Fee Percentage:</span>
            <span className="font-medium text-amber-900">{selectedCountryData?.codFee}%</span>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className={`mt-4 space-y-4 ${isExpanded ? '' : 'hidden'}`}>
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Provider</label>
          <select
            value="COD NETWORK"
            className={selectClasses}
            disabled
          >
            <option value="COD NETWORK">COD NETWORK</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Country</label>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className={selectClasses}
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Product Type</label>
          <select
            value={productType}
            onChange={(e) => onProductTypeChange(e.target.value as 'cosmetic' | 'gadget')}
            className={selectClasses}
          >
            <option value="cosmetic">Cosmetic</option>
            <option value="gadget">Gadget</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Call Center</label>
          <select
            value={serviceType}
            onChange={(e) => onServiceTypeChange(e.target.value as 'with' | 'without')}
            className={selectClasses}
          >
            <option value="with">With Call Center</option>
            <option value="without">Without Call Center</option>
          </select>
        </div>
      </div>

      {/* Summary when collapsed */}
      {!isExpanded && (
        <div className="mt-4 flex items-center gap-4 text-sm text-purple-600">
          <span>{selectedCountryData?.name}</span>
          <span>•</span>
          <span>{productType === 'cosmetic' ? 'Cosmetic' : 'Gadget'}</span>
          <span>•</span>
          <span>{serviceType === 'with' ? 'With Call Center' : 'Without Call Center'}</span>
        </div>
      )}
    </div>
  );
}