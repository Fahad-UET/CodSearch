import { DailyMetrics, CalculatedMetrics, AverageMetrics } from '../types';

export function calculateMonthlyAmount(charge: {
  amount: number;
  quantity?: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  isActive: boolean;
}): number {
  if (!charge.isActive) return 0;
  
  const baseAmount = charge.amount * (charge.quantity || 1);
  
  switch (charge.period) {
    case 'daily':
      return baseAmount * 30; // 30 days per month
    case 'weekly':
      return baseAmount * 4; // 4 weeks per month
    case 'yearly':
      return baseAmount / 12; // Divide annual amount by 12
    default:
      return baseAmount; // Monthly amount stays as is
  }
}

export function calculateDailyMetrics(metrics: DailyMetrics): CalculatedMetrics {
  const cpl = metrics.leads > 0 ? metrics.adBudget / metrics.leads : 0;
  const deliveryRate = metrics.confirmedOrders > 0 
    ? (metrics.deliveredOrders / metrics.confirmedOrders) * 100 
    : 0;
  const confirmationRate = metrics.leads > 0 
    ? (metrics.confirmedOrders / metrics.leads) * 100 
    : 0;

  return {
    cpl,
    deliveryRate,
    confirmationRate
  };
}

export function calculateAverageMetrics(days: DailyMetrics[]): AverageMetrics {
  if (days.length === 0) {
    return {
      id: 'average',
      day: 0,
      sellingPrice: 0,
      cpc: 0,
      cpm: 0,
      ctr: 0,
      adBudget: 0,
      leads: 0,
      confirmedOrders: 0,
      deliveredOrders: 0,
      cpl: 0,
      deliveryRate: 0,
      confirmationRate: 0
    };
  }

  const sum = days.reduce((acc, day) => {
    const calculated = calculateDailyMetrics(day);
    return {
      sellingPrice: acc.sellingPrice + day.sellingPrice,
      cpc: acc.cpc + day.cpc,
      cpm: acc.cpm + day.cpm,
      ctr: acc.ctr + day.ctr,
      adBudget: acc.adBudget + day.adBudget,
      leads: acc.leads + day.leads,
      confirmedOrders: acc.confirmedOrders + day.confirmedOrders,
      deliveredOrders: acc.deliveredOrders + day.deliveredOrders,
      cpl: acc.cpl + calculated.cpl,
      deliveryRate: acc.deliveryRate + calculated.deliveryRate,
      confirmationRate: acc.confirmationRate + calculated.confirmationRate
    };
  }, {
    sellingPrice: 0,
    cpc: 0,
    cpm: 0,
    ctr: 0,
    adBudget: 0,
    leads: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    cpl: 0,
    deliveryRate: 0,
    confirmationRate: 0
  });

  return {
    id: 'average',
    day: days.length,
    sellingPrice: sum.sellingPrice / days.length,
    cpc: sum.cpc / days.length,
    cpm: sum.cpm / days.length,
    ctr: sum.ctr / days.length,
    adBudget: sum.adBudget / days.length,
    leads: sum.leads / days.length,
    confirmedOrders: sum.confirmedOrders / days.length,
    deliveredOrders: sum.deliveredOrders / days.length,
    cpl: sum.cpl / days.length,
    deliveryRate: sum.deliveryRate / days.length,
    confirmationRate: sum.confirmationRate / days.length
  };
}

export function formatCurrency(
  amount: number,
  currency: string = '$',
  decimals: number = 2
): string {
  return `${currency}${amount.toFixed(decimals)}`;
}