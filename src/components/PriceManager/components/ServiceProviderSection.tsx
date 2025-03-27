import React from 'react';
import { Settings, Building } from 'lucide-react';
import { COUNTRIES } from '../../../services/codNetwork/constants';

interface ServiceProviderSectionProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  onOpenSettings: () => void;
}

export function ServiceProviderSection({
  selectedCountry,
  onCountryChange,
  onOpenSettings
}: ServiceProviderSectionProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-700 font-medium">COD NETWORK</span>
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Service Provider Settings"
          >
            <Settings size={16} />
          </button>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 bg-white text-gray-900 font-medium min-w-[200px]"
            defaultValue="SAR"
          >
            {Object.entries(COUNTRIES).map(([code, { name }]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}