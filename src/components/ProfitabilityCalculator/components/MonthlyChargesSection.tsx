import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';
import { inputClasses } from '../constants';

interface MonthlyChargesSectionProps {
  monthlyCharges: number;
  onMonthlyChargesChange: (value: number) => void;
}

export function MonthlyChargesSection({
  monthlyCharges,
  onMonthlyChargesChange
}: MonthlyChargesSectionProps) {
  const handleValueChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      onMonthlyChargesChange(numValue);
    }
  };

  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={20} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-900">Monthly Charges</h3>
      </div>
      
      <div className="relative">
        <input
          type="number"
          min="0"
          step="0.01"
          value={monthlyCharges || ''}
          onChange={(e) => handleValueChange(e.target.value)}
          className={inputClasses}
          placeholder="Enter monthly charges"
        />
        <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400" />
      </div>
    </div>
  );
}