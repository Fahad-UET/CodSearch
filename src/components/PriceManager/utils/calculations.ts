import { PriceFormData, PriceCalculationResult } from '../types';

export function calculatePriceMetrics(data: PriceFormData): PriceCalculationResult {
  const profit = data.salePrice - data.purchasePrice;
  const margin = data.salePrice > 0 ? (profit / data.salePrice) * 100 : 0;
  const roi = data.purchasePrice > 0 ? (profit / data.purchasePrice) * 100 : 0;
  
  // Simple break-even calculation
  const breakEvenPoint = data.purchasePrice > 0 ? 
    Math.ceil(data.purchasePrice / profit) : 
    0;

  return {
    profit,
    margin,
    roi,
    breakEvenPoint
  };
}

export function calculatePersonalROI(totalInvestment: number, totalProfit: number, serviceParticipation: number): number {
  if (totalInvestment === 0) return 0;
  const personalInvestment = totalInvestment * (1 - serviceParticipation / 100);
  return (totalProfit / personalInvestment) * 100;
}

export function calculateTotalROI(totalInvestment: number, totalProfit: number): number {
  if (totalInvestment === 0) return 0;
  return (totalProfit / totalInvestment) * 100;
}

export function calculateRevenueFromAds(totalRevenue: number, adSpend: number): number {
  if (adSpend === 0) return 0;
  return totalRevenue * (adSpend / 1);
        // remove the upper line and uncomment the lower line and check what is totalExpenses
  // return totalRevenue * (adSpend / totalExpenses);
}

export function calculatePersonalCapitalRoi(
  revenue: number,
  personalInvestment: number,
  expenses: number
): number {
  if (personalInvestment === 0) return 0;
  return ((revenue - expenses) / personalInvestment) * 100;
}

export function calculateTotalExpenses(
  adSpend: number,
  operatingCosts: number
): number {
  return adSpend + operatingCosts;
}