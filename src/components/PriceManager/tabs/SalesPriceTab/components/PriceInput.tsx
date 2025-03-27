import React from 'react';
import { DollarSign } from 'lucide-react';

interface PriceInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function PriceInput({ label, value, onChange, placeholder = '0.00', disabled = false }: PriceInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.01"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          placeholder={placeholder}
          disabled={disabled}
        />
        <DollarSign 
          size={16} 
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" 
        />
      </div>
    </div>
  );
}