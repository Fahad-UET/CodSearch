import React from 'react';
import { Building } from 'lucide-react';
import { useServiceProviderStore } from '../../../store/serviceProviderStore';

interface ServiceProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
}

export function ServiceProviderSelector({
  selectedProvider,
  onProviderChange
}: ServiceProviderSelectorProps) {
  const { providers } = useServiceProviderStore();

  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-purple-100 rounded-lg">
        <Building size={20} className="text-purple-600" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Provider
        </label>
        <select
          value={selectedProvider}
          onChange={(e) => onProviderChange(e.target.value)}
          className="w-64 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
        >
          {providers.map(provider => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}