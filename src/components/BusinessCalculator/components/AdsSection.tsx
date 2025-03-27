import React from 'react';
import { DollarSign } from 'lucide-react';
import { inputClasses } from '../constants';

interface AdsSectionProps {
  adsCpl: number;
  adsCpc: number;
  adsCpm: number;
  onAdsCplChange: (value: number) => void;
  onAdsCpcChange: (value: number) => void;
  onAdsCpmChange: (value: number) => void;
}

export function AdsSection({
  adsCpl,
  adsCpc,
  adsCpm,
  onAdsCplChange,
  onAdsCpcChange,
  onAdsCpmChange
}: AdsSectionProps) {
  const handleValueChange = (value: string, setter: (value: number) => void) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setter(numValue);
    }
  };

  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-purple-100">
      <h3 className="text-lg font-semibold text-purple-900 mb-4">Advertising Costs</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">
            CPL - Cost Per Lead
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={adsCpl || ''}
              onChange={(e) => handleValueChange(e.target.value, onAdsCplChange)}
              className={inputClasses}
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">
            CPC - Cost Per Click
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={adsCpc || ''}
              onChange={(e) => handleValueChange(e.target.value, onAdsCpcChange)}
              className={inputClasses}
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">
            CPM - Cost Per Thousand Impressions
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={adsCpm || ''}
              onChange={(e) => handleValueChange(e.target.value, onAdsCpmChange)}
              className={inputClasses}
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
}