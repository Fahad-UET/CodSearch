import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { countries } from '../constants';

interface ServiceSettingsModalProps {
  onClose: () => void;
}

export function ServiceSettingsModal({ onClose }: ServiceSettingsModalProps) {
  const [selectedProvider, setSelectedProvider] = useState('COD NETWORK');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[400]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <Settings size={24} className="text-purple-600" />
            <h2 className="text-xl font-semibold">Service Provider Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              <option value="COD NETWORK">COD NETWORK</option>
            </select>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Costs by Country</h3>
            <div className="space-y-4">
              {countries.map((country) => (
                <div key={country.code} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{country.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">With Call Center</p>
                      <div className="flex justify-between text-sm">
                        <span>Shipping: ${country.shippingCosts.with.shipping}</span>
                        <span>Return: ${country.shippingCosts.with.return * 1.5}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Without Call Center</p>
                      <div className="flex justify-between text-sm">
                        <span>Shipping: ${country.shippingCosts.without.shipping * 0.8}</span>
                        <span>Return: ${country.shippingCosts.without.return * 1.2}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}