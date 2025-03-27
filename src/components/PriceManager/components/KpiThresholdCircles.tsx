import React from 'react';
import { KpiThreshold } from '../../../types/kpi';

interface KpiThresholdCirclesProps {
  threshold: KpiThreshold;
  currentValue: number;
  onSelect: (value: number) => void;
  unit: '%' | '$';
}

export function KpiThresholdCircles({ threshold, currentValue, onSelect, unit }: KpiThresholdCirclesProps) {
  const formatValue = (value: number) => {
    return unit === '%' ? `${value}%` : `$${value.toFixed(2)}`;
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onSelect(threshold.low)}
        className={`w-4 h-4 rounded-full transition-all ${
          currentValue === threshold.low
            ? 'ring-2 ring-red-400 ring-offset-2 bg-red-500'
            : 'bg-red-200 hover:bg-red-300'
        }`}
        title={`Low: ${formatValue(threshold.low)}`}
      />
      <button
        onClick={() => onSelect(threshold.medium)}
        className={`w-4 h-4 rounded-full transition-all ${
          currentValue === threshold.medium
            ? 'ring-2 ring-yellow-400 ring-offset-2 bg-yellow-500'
            : 'bg-yellow-200 hover:bg-yellow-300'
        }`}
        title={`Medium: ${formatValue(threshold.medium)}`}
      />
      <button
        onClick={() => onSelect(threshold.high)}
        className={`w-4 h-4 rounded-full transition-all ${
          currentValue === threshold.high
            ? 'ring-2 ring-green-400 ring-offset-2 bg-green-500'
            : 'bg-green-200 hover:bg-green-300'
        }`}
        title={`High: ${formatValue(threshold.high)}`}
      />
    </div>
  );
}