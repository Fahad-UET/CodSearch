import React from 'react';
import { inputClasses } from '../constants';

interface PerformanceSectionProps {
  numberOfLeads: number;
  confirmationRate: number;
  deliveryRate: number;
  onNumberOfLeadsChange: (value: number) => void;
  onConfirmationRateChange: (value: number) => void;
  onDeliveryRateChange: (value: number) => void;
}

export function PerformanceSection({
  numberOfLeads,
  confirmationRate,
  deliveryRate,
  onNumberOfLeadsChange,
  onConfirmationRateChange,
  onDeliveryRateChange
}: PerformanceSectionProps) {
  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-purple-100">
      <h3 className="text-lg font-semibold text-purple-900 mb-4">Performance</h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Number of Leads</label>
          <input
            type="number"
            min="0"
            value={numberOfLeads}
            onChange={(e) => onNumberOfLeadsChange(parseInt(e.target.value))}
            className={inputClasses}
            placeholder="Enter number of leads"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-purple-700">Confirmation Rate</label>
            <span className="text-sm font-medium text-purple-600">{confirmationRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={confirmationRate}
            onChange={(e) => onConfirmationRateChange(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-purple-500">0%</span>
            <span className="text-xs text-purple-500">100%</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-purple-700">Delivery Rate</label>
            <span className="text-sm font-medium text-purple-600">{deliveryRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={deliveryRate}
            onChange={(e) => onDeliveryRateChange(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-purple-500">0%</span>
            <span className="text-xs text-purple-500">100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}