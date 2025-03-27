import React from 'react';
import { Settings, Truck, DollarSign } from 'lucide-react';

interface ServiceSettings {
  shippingCost: number;
  codFee: number;
  callCenterFee: number;
}

interface ServiceSettingsProps {
  settings: ServiceSettings;
  onUpdateSettings: (updates: Partial<ServiceSettings>) => void;
}

export function ServiceSettings({ settings, onUpdateSettings }: ServiceSettingsProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Settings size={24} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Service Settings</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Shipping Cost</p>
              <p className="text-sm text-gray-500">Per unit shipping fee</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.shippingCost}
              onChange={(e) => onUpdateSettings({ shippingCost: parseFloat(e.target.value) || 0 })}
              className="w-32 pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <DollarSign size={20} className="text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">COD Fee</p>
              <p className="text-sm text-gray-500">Cash on delivery fee</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={settings.codFee}
              onChange={(e) => onUpdateSettings({ codFee: parseFloat(e.target.value) || 0 })}
              className="w-32 pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}