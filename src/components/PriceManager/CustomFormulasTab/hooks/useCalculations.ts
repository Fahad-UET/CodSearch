import { useMemo, useState } from 'react';
import { CustomFormulasTabProps, CalculationResults } from '../types';
import { calculateMetrics } from '../utils/calculations';

export function useCalculations(variables: CustomFormulasTabProps['variables']): CalculationResults {
  const [serviceParticipationRate, setServiceParticipationRate] = useState(30); // Default 30%

  return useMemo(() => calculateMetrics(variables, {
    serviceParticipationRate,
    setServiceParticipationRate
  }), [variables, serviceParticipationRate]);
}