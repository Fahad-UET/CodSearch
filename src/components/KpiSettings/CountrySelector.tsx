import React from 'react';
import { Globe } from 'lucide-react';
import { COUNTRIES } from '../../services/codNetwork/constants';

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (countryCode: string) => void;
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <Globe size={20} className="text-purple-600" />
      <select
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
      >
        {Object.entries(COUNTRIES).map(([code, { name }]) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
    </div>
  );
}