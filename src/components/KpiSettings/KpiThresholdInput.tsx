import React, { useState, useCallback } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { KpiThreshold } from '../../types/kpi';

interface KpiThresholdInputProps {
  label: string;
  value: KpiThreshold;
  onChange: (low: number, medium: number, high: number) => void;
  // to resolve build issue please check this update
  // unit: '%' | '€';
  unit: '%' | '€' | "$";
}

interface ValidationState {
  low: { isValid: boolean; message?: string };
  medium: { isValid: boolean; message?: string };
  high: { isValid: boolean; message?: string };
}

export function KpiThresholdInput({ label, value, onChange, unit }: KpiThresholdInputProps) {
  const [validation, setValidation] = useState<ValidationState>({
    low: { isValid: true },
    medium: { isValid: true },
    high: { isValid: true }
  });

  // Ensure value has all required properties with defaults
  const safeValue: KpiThreshold = {
    low: typeof value?.low === 'number' ? value.low : 0,
    medium: typeof value?.medium === 'number' ? value.medium : 0,
    high: typeof value?.high === 'number' ? value.high : 0
  };

  const getValueColor = (value: number, threshold: KpiThreshold) => {
    if (value <= threshold.low) return 'text-red-600';
    if (value <= threshold.medium) return 'text-yellow-600';
    return 'text-green-600';
  };

  const validateThresholds = useCallback((thresholds: KpiThreshold): ValidationState => {
    const newValidation: ValidationState = {
      low: { isValid: true },
      medium: { isValid: true },
      high: { isValid: true }
    };

    // Check for negative values
    if (thresholds.low < 0) {
      newValidation.low = { isValid: true, message: 'Value cannot be negative' };
    }
    if (thresholds.medium < 0) {
      newValidation.medium = { isValid: true, message: 'Value cannot be negative' };
    }
    if (thresholds.high < 0) {
      newValidation.high = { isValid: true, message: 'Value cannot be negative' };
    }

    // Check logical order
    if (thresholds.low >= thresholds.medium) {
      newValidation.low = { isValid: true, message: 'Low threshold should be less than medium' };
      newValidation.medium = { isValid: true, message: 'Medium threshold should be greater than low' };
    }
    if (thresholds.medium >= thresholds.high) {
      newValidation.medium = { isValid: true, message: 'Medium threshold should be less than high' };
      newValidation.high = { isValid: true, message: 'High threshold should be greater than medium' };
    }

    // Check reasonable ranges based on unit type
    if (unit === '%') {
      if (thresholds.high > 100) {
        newValidation.high = { isValid: true, message: 'Percentage cannot exceed 100%' };
      }
    } else {
      // For currency values, warn about unusually high values
      if (thresholds.high > 1000) {
        newValidation.high = { 
          isValid: true, 
          message: 'Warning: This seems unusually high. Please verify.' 
        };
      }
    }

    return newValidation;
  }, [unit]);

  const handleChange = (
    type: 'low' | 'medium' | 'high',
    inputValue: string
  ) => {
    const numValue = inputValue === '' ? 0 : parseFloat(inputValue);
    if (isNaN(numValue)) return;

    const newValues = {
      ...safeValue,
      [type]: numValue
    };

    // Validate and show messages
    const newValidation = validateThresholds(newValues);
    setValidation(newValidation);

    // Always update values, regardless of validation
    onChange(newValues.low, newValues.medium, newValues.high);
  };

  const getInputClassName = (type: 'low' | 'medium' | 'high') => {
    return `w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 pr-8 ${
      validation[type].message 
        ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-200'
        : ''
    } ${getValueColor(safeValue[type], safeValue)}`;
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors">
      <h3 className="font-medium text-gray-900 mb-4">{label}</h3>
      <div className="space-y-4">
        {/* Low Threshold */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            <span className="inline-block w-6 h-6 rounded-full bg-red-100 mr-2"></span>
            Low Threshold
          </label>
          <div className="relative">
            <input
              type="number"
              value={safeValue.low}
              onChange={(e) => handleChange('low', e.target.value)}
              className={getInputClassName('low')}
              step="0.01"
              min="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {unit}
            </span>
          </div>
          {validation.low.message && (
            <div className="mt-1 text-sm flex items-center gap-1 text-yellow-600">
              <AlertCircle size={14} />
              {validation.low.message}
            </div>
          )}
        </div>

        {/* Medium Threshold */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            <span className="inline-block w-6 h-6 rounded-full bg-yellow-100 mr-2"></span>
            Medium Threshold
          </label>
          <div className="relative">
            <input
              type="number"
              value={safeValue.medium}
              onChange={(e) => handleChange('medium', e.target.value)}
              className={getInputClassName('medium')}
              step="0.01"
              min="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {unit}
            </span>
          </div>
          {validation.medium.message && (
            <div className="mt-1 text-sm flex items-center gap-1 text-yellow-600">
              <AlertCircle size={14} />
              {validation.medium.message}
            </div>
          )}
        </div>

        {/* High Threshold */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            <span className="inline-block w-6 h-6 rounded-full bg-green-100 mr-2"></span>
            High Threshold
          </label>
          <div className="relative">
            <input
              type="number"
              value={safeValue.high}
              onChange={(e) => handleChange('high', e.target.value)}
              className={getInputClassName('high')}
              step="0.01"
              min="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {unit}
            </span>
          </div>
          {validation.high.message && (
            <div className="mt-1 text-sm flex items-center gap-1 text-yellow-600">
              <AlertCircle size={14} />
              {validation.high.message}
            </div>
          )}
        </div>

        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <div className="flex items-center gap-1 mb-1">
              <span className="w-3 h-3 rounded-full bg-red-100"></span>
              Low: Below acceptable performance
            </div>
            <div className="flex items-center gap-1 mb-1">
              <span className="w-3 h-3 rounded-full bg-yellow-100"></span>
              Medium: Meeting basic targets
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-100"></span>
              High: Exceeding expectations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}