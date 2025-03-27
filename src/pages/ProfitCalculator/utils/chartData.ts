import { MetricsState, ChartDataPoint, RateChange } from '../types';
import {
  calculateTotalProfit,
  calculateBreakEvenPrice,
  calculateBreakEvenCPL,
  calculateBreakEvenStock,
  calculateBreakEvenRate,
  calculateLeads,
  calculateCallCenterCosts,
} from './calculations';

function getValueAtDay(changes: RateChange[], day: number, defaultValue: number): number {
  const applicableChanges = changes
    .filter(change => change.day <= day)
    .sort((a, b) => b.day - a.day);

  return applicableChanges[0]?.value ?? defaultValue;
}

export function generateChartData(metrics: MetricsState, days: number = 180): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  for (let day = 0; day <= days; day++) {
    // Get current values based on changes
    const currentStock = getValueAtDay(metrics.stockChanges, day, metrics.availableStock);
    const currentPrice = getValueAtDay(metrics.priceChanges, day, metrics.sellingPrice);
    const currentCPL = getValueAtDay(metrics.advertisingChanges, day, metrics.baseCPL);
    const currentConfirmationRate = getValueAtDay(
      metrics.confirmationChanges,
      day,
      metrics.baseConfirmationRate
    );
    const currentDeliveryRate = getValueAtDay(
      metrics.deliveryChanges,
      day,
      metrics.baseDeliveryRate
    );

    // Calculate metrics for current day
    const currentMetrics = {
      availableStock: currentStock,
      sellingPrice: currentPrice,
      purchasePrice: metrics.purchasePrice,
      baseCPL: currentCPL,
      baseConfirmationRate: currentConfirmationRate,
      baseDeliveryRate: currentDeliveryRate,
    };

    const expectedLeads = metrics?.leads;
    const profit = metrics?.profit;
    const callCenterCost = metrics?.callCenterCost;
    const totalExpenses = metrics?.totalExpenses;
    const advertisingCost = metrics?.advertisingCost;

    // Calculate break-even points
    const breakEvenPrice = calculateBreakEvenPrice(
      currentMetrics,
      expectedLeads,
      currentConfirmationRate,
      currentDeliveryRate
    );
    const breakEvenCPL = calculateBreakEvenCPL(
      currentMetrics,
      expectedLeads,
      currentConfirmationRate,
      currentDeliveryRate
    );
    const breakEvenStock = calculateBreakEvenStock(
      currentMetrics,
      expectedLeads,
      currentConfirmationRate,
      currentDeliveryRate
    );
    const breakEvenConfirmationRate = calculateBreakEvenRate(
      currentMetrics,
      expectedLeads,
      currentConfirmationRate,
      true,
      currentDeliveryRate
    );
    const breakEvenDeliveryRate = calculateBreakEvenRate(
      currentMetrics,
      expectedLeads,
      currentDeliveryRate,
      false,
      currentConfirmationRate
    );

    data.push({
      day,
      profit,
      availableStock: currentStock,
      sellingPrice: currentPrice,
      advertisingCost: currentCPL,
      confirmationRate: currentConfirmationRate,
      deliveryRate: currentDeliveryRate,
      expectedLeads,
      callCenterCost,
      breakEvenStock,
      breakEvenPrice,
      breakEvenCPL,
      cpl: metrics?.baseCPL,
      breakEvenConfirmationRate,
      breakEvenDeliveryRate,
      totalExpenses,
    });
  }

  return data;
}
