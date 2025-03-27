import React from 'react';
import { Settings } from 'lucide-react';

interface ServiceInfoProps {
  formData: {
    serviceProvider: string;
    country: string;
    productType: string;
    hasCallCenter: boolean;
  };
  onChange: (data: Partial<ServiceInfoProps['formData']>) => void;
}

export function ServiceInfo({ formData, onChange }: ServiceInfoProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Service Information</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Provider
          </label>
          <select
            value={formData.serviceProvider}
            onChange={(e) => onChange({ serviceProvider: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            <option value="COD NETWORK">COD NETWORK</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            value={formData.country}
            onChange={(e) => onChange({ country: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            <option value="KSA">Saudi Arabia</option>
            <option value="UAE">United Arab Emirates</option>
            <option value="BHR">Bahrain</option>
            <option value="KWT">Kuwait</option>
            <option value="OMN">Oman</option>
            <option value="QAT">Qatar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={formData.productType === 'cosmetic'}
                onChange={() => onChange({ productType: 'cosmetic' })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Cosmetic</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={formData.productType === 'gadget'}
                onChange={() => onChange({ productType: 'gadget' })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Gadget</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Call Center Service
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={formData.hasCallCenter}
                onChange={() => onChange({ hasCallCenter: true })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">With Call Center</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={!formData.hasCallCenter}
                onChange={() => onChange({ hasCallCenter: false })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm text-gray-700">Without Call Center</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}