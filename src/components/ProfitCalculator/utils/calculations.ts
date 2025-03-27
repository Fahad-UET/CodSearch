import { ProfitMetrics } from '../types';

export function calculateProfitMetrics(metrics: ProfitMetrics) {
  const {
    availableStock,
    sellingPrice,
    purchasePrice,
    baseCPL,
    baseConfirmationRate,
    baseDeliveryRate
  } = metrics;

  // Calculate expected leads and orders
  const expectedLeads = Math.ceil(availableStock / ((baseConfirmationRate / 100) * (baseDeliveryRate / 100)));
  const confirmedOrders = Math.round((expectedLeads * baseConfirmationRate) / 100);
  const deliveredOrders = Math.round((confirmedOrders * baseDeliveryRate) / 100);
  const returnedOrders = confirmedOrders - deliveredOrders;

  // Calculate revenue
  const totalRevenue = deliveredOrders * sellingPrice;

  // Calculate costs
  const advertisingCosts = expectedLeads * baseCPL;
  const stockCosts = availableStock * purchasePrice;
  const deliveryCosts = confirmedOrders * 5; // Assuming $5 per delivery
  const returnCosts = returnedOrders * 3; // Assuming $3 per return
  const codFees = totalRevenue * 0.05; // Assuming 5% COD fee
  const callCenterCosts = confirmedOrders * 2; // Assuming $2 per confirmed order

  const totalCosts = advertisingCosts + stockCosts + deliveryCosts + returnCosts + codFees + callCenterCosts;
  const totalProfit = totalRevenue - totalCosts;

  // Calculate performance metrics
  const roi = totalCosts > 0 ? (totalProfit / totalCosts) * 100 : 0;
  const profitPerUnit = deliveredOrders > 0 ? totalProfit / deliveredOrders : 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return {
    expectedLeads,
    totalRevenue,
    totalProfit,
    roi,
    profitPerUnit,
    profitMargin,
    advertisingCosts,
    stockCosts,
    deliveryCosts,
    returnCosts,
    codFees,
    callCenterCosts,
    confirmedOrders,
    deliveredOrders,
    returnedOrders
  };
}

export function calculateBreakEvenPoint(metrics: ProfitMetrics): number {
  let low = 0;
  let high = 10000;
  let iterations = 0;
  const maxIterations = 50;
  const tolerance = 0.01;

  while (iterations < maxIterations) {
    const mid = Math.floor((low + high) / 2);
    const testMetrics = { ...metrics, availableStock: mid };
    const { totalProfit } = calculateProfitMetrics(testMetrics);

    if (Math.abs(totalProfit) < tolerance) {
      return mid;
    }

    if (totalProfit < 0) {
      low = mid;
    } else {
      high = mid;
    }

    iterations++;
  }

  return Math.floor((low + high) / 2);
}