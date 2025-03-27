import { ProfitMetrics } from '../types/chart';
import {
  calculateLeads,
  calculateAdvertisingCosts,
  calculateCallCenterCosts,
  calculateDeliveryCosts,
  calculateReturnCosts,
  calculateCODFees,
  calculateStockCosts,
  calculateRevenue,
} from './Calculation';

export function calculateTotalRevenue(metrics: ProfitMetrics): number {
  return calculateRevenue(metrics?.price?.stock, metrics?.price?.salePrice);
}

export function calculateTotalProfit(metrics: ProfitMetrics): number {
  const leads = calculateLeads(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );

  const revenue = calculateRevenue(metrics.availableStock, metrics.sellingPrice);
  const advertisingCosts = calculateAdvertisingCosts(leads, metrics.baseCPL);
  const stockCosts = calculateStockCosts(metrics.availableStock, metrics.purchasePrice);
  const callCenterCosts = calculateCallCenterCosts(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const deliveryCosts = calculateDeliveryCosts(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const returnCosts = calculateReturnCosts(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const codFees = calculateCODFees(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate,
    // metrics.sellingPrice
  );

  return (
    revenue -
    (stockCosts + advertisingCosts + deliveryCosts + returnCosts + callCenterCosts + codFees)
  );
}

export function calculateROAS(metrics: ProfitMetrics): number {
  const leads = calculateLeads(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );

  const revenue = calculateRevenue(metrics.availableStock, metrics.sellingPrice);
  const advertisingCosts = calculateAdvertisingCosts(leads, metrics.baseCPL);

  return advertisingCosts === 0 ? 0 : revenue / advertisingCosts;
}

export function calculatePersonalCapitalROI(
  metrics: ProfitMetrics,
  personalInvestment: number
): number {
  const profit = calculateTotalProfit(metrics);
  return personalInvestment === 0 ? 0 : profit / personalInvestment;
}

export function calculateTotalExpenses(metrics: ProfitMetrics): number {
  const leads = calculateLeads(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );

  const advertisingCosts = calculateAdvertisingCosts(leads, metrics.baseCPL);
  const stockCosts = calculateStockCosts(metrics.availableStock, metrics.purchasePrice);
  const callCenterCosts = calculateCallCenterCosts(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const deliveryCosts = calculateDeliveryCosts(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const returnCosts = calculateReturnCosts(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const codFees = calculateCODFees(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate,
    // metrics.sellingPrice
  );

  return stockCosts + advertisingCosts + deliveryCosts + returnCosts + callCenterCosts + codFees;
}

export function calculateDetailedExpenses(metrics: ProfitMetrics) {
  const leads = calculateLeads(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );

  const advertisingCosts = calculateAdvertisingCosts(leads, metrics.baseCPL);
  const stockCosts = calculateStockCosts(metrics.availableStock, metrics.purchasePrice);
  const callCenterCosts = calculateCallCenterCosts(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate,
    metrics.sellingPrice
  );
  const deliveryCosts = calculateDeliveryCosts(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const returnCosts = calculateReturnCosts(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const codFees = calculateCODFees(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate,
    // metrics.sellingPrice
  );

  return {
    advertisingCosts,
    stockCosts,
    callCenterCosts,
    deliveryCosts,
    returnCosts,
    codFees,
  };
}

export function calculateProfitMargin(totalProfit: number, totalRevenue: number): number {
  return totalRevenue === 0 ? 0 : (totalProfit / totalRevenue) * 100;
}

export function calculateProfitPerDelivered(metrics: ProfitMetrics): number {
  const leads = calculateLeads(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );

  const deliveredUnits =
    leads * (metrics.baseConfirmationRate / 100) * (metrics.baseDeliveryRate / 100);
  const totalProfit = calculateTotalProfit(metrics);

  return deliveredUnits === 0 ? 0 : totalProfit / deliveredUnits;
}
