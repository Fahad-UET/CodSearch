import { useState } from 'react';
import { SourcingFormData, CalculationResult } from '../types';
import { calculateSourcingPrice } from '../utils/calculations';

export function useCalculation() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculate = (formData: SourcingFormData) => {
    try {
      setError(null);
      const calculationResult = calculateSourcingPrice(formData);
      setResult(calculationResult);
      return calculationResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate price');
      return null;
    }
  };

  return {
    result,
    error,
    calculate,
  };
}
