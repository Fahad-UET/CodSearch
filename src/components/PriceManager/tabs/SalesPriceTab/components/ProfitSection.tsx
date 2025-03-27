import React, { useState, useEffect } from 'react';
import { ProfitAnalysis } from '../../../components/ProfitAnalysis';
import {
  calculateProfitPerUnit,
  calculateProfitChange
} from '../../../utils/profitCalculations';

interface ProfitSectionProps {
  revenue: number;
  costs: number;
  currency?: string;
}

export function ProfitSection({
  revenue,
  costs,
  currency = '$'
}: ProfitSectionProps) {
  const [previousProfit, setPreviousProfit] = useState<number>();
  const profitPerUnit = calculateProfitPerUnit(revenue, costs);

  useEffect(() => {
    // Store current profit as previous when it changes
    setPreviousProfit(profitPerUnit);
  }, [revenue, costs]);

  return (
    <ProfitAnalysis
      profitPerProduct={profitPerUnit}
      previousProfit={previousProfit}
      currency={currency}
    />
  );
}