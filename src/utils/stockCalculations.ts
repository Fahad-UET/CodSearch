import { KpiThreshold } from '../types/kpi';

export interface StockCalculationResult {
  stock: number;
  leads: number;
  expectedDeliveries: number;
  expectedReturns: number;
}

export function calculateStock(
  leads: number,
  deliveryRate: number,
  confirmationRate: number
): StockCalculationResult {
  const confirmedOrders = Math.round((leads * confirmationRate) / 100);
  const deliveredOrders = Math.round((confirmedOrders * deliveryRate) / 100);
  const returnedOrders = confirmedOrders - deliveredOrders;

  return {
    stock: deliveredOrders,
    leads: Math.round(leads),
    expectedDeliveries: deliveredOrders,
    expectedReturns: returnedOrders
  };
}

export function calculateRequiredLeads(
  targetStock: number,
  deliveryRate: number,
  confirmationRate: number
): number {
  // Reverse calculate required leads from target stock
  // stock = leads * (confirmationRate/100) * (deliveryRate/100)
  // leads = stock / ((confirmationRate/100) * (deliveryRate/100))
  const conversionRate = (deliveryRate / 100) * (confirmationRate / 100);
  if (conversionRate === 0) return 0;
  return Math.ceil(targetStock / conversionRate);
}

export function getEffectiveRate(threshold: KpiThreshold): number {
  // Use the high threshold as the effective rate for calculations
  return threshold.high;
}