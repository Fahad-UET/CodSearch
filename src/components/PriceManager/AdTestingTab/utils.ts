import { DailyMetrics } from '@/types';
import { DEFAULT_NETWORK_METRICS } from './constants';
import { DayData, NetworkMetrics, CalculatedMetrics, AverageMetrics } from './types';

export function calculateDailyMetrics(day: DayData): CalculatedMetrics {
  let totalLeads = 0;
  let totalSpend = 0;

  Object.values(day.networks).forEach(network => {
    if (network.isActive) {
      totalLeads += network.metrics.leads;
      totalSpend += network.metrics.budget;
    }
  });

  const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
  const deliveryRate = 0; // To be calculated based on orders data
  const confirmationRate = 0; // To be calculated based on orders data
  const roas = 0; // To be calculated based on revenue data

  return {
    cpl,
    deliveryRate,
    confirmationRate,
    roas
  };
}

export function calculateAverageMetrics(days: DayData[]): AverageMetrics {
  if (days.length === 0) {
    return {
      cpm: 0,
      cpc: 0,
      ctr: 0,
      budget: 0,
      impressions: 0,
      clicks: 0,
      leads: 0,
      cpl: 0,
      deliveryRate: 0,
      confirmationRate: 0,
      roas: 0
    };
  }

  const totals = days.reduce((acc, day) => {
    let dayTotals = {
      cpm: 0,
      cpc: 0,
      ctr: 0,
      budget: 0,
      impressions: 0,
      clicks: 0,
      leads: 0
    };

    Object.values(day.networks).forEach(network => {
      if (network.isActive) {
        const m = network.metrics;
        dayTotals.cpm += m.cpm;
        dayTotals.cpc += m.cpc;
        dayTotals.ctr += m.ctr;
        dayTotals.budget += m.budget;
        dayTotals.impressions += m.impressions;
        dayTotals.clicks += m.clicks;
        dayTotals.leads += m.leads;
      }
    });

    return {
      cpm: acc.cpm + dayTotals.cpm,
      cpc: acc.cpc + dayTotals.cpc,
      ctr: acc.ctr + dayTotals.ctr,
      budget: acc.budget + dayTotals.budget,
      impressions: acc.impressions + dayTotals.impressions,
      clicks: acc.clicks + dayTotals.clicks,
      leads: acc.leads + dayTotals.leads
    };
  }, {
    cpm: 0,
    cpc: 0,
    ctr: 0,
    budget: 0,
    impressions: 0,
    clicks: 0,
    leads: 0
  });

  const averages: NetworkMetrics = {
    cpm: totals.cpm / days.length,
    cpc: totals.cpc / days.length,
    ctr: totals.ctr / days.length,
    budget: totals.budget / days.length,
    impressions: totals.impressions / days.length,
    clicks: totals.clicks / days.length,
    leads: totals.leads / days.length
  };

  const totalSpend = totals.budget;
  const totalLeads = totals.leads;

  return {
    ...averages,
    cpl: totalLeads > 0 ? totalSpend / totalLeads : 0,
    deliveryRate: 0, // To be calculated based on orders data
    confirmationRate: 0, // To be calculated based on orders data
    roas: 0 // To be calculated based on revenue data
  };
}

export function calculateMetrics(days: DailyMetrics[]): AverageMetrics {
  // to resolve build issue please check this
  // if (days.length === 0) return DEFAULT_METRICS;
  if (days.length === 0) return DEFAULT_NETWORK_METRICS;
  // if (days.length === 0) return DEFAULT_METRICS;

  // Calculate totals and averages
  const totals = days.reduce((acc, day) => ({
    impressions: acc.impressions + day.impressions,
    clicks: acc.clicks + day.clicks,
    leads: acc.leads + day.leads,
    confirmedOrders: acc.confirmedOrders + day.confirmedOrders,
    deliveredOrders: acc.deliveredOrders + day.deliveredOrders,
    adBudget: acc.adBudget + day.adBudget, // Keep as sum for total spend
  }), {
    impressions: 0,
    clicks: 0,
    leads: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    adBudget: 0,
  });

  return {
    impressions: Math.round(totals.impressions / days.length),
    clicks: Math.round(totals.clicks / days.length),
    leads: Math.round(totals.leads / days.length),
    confirmedOrders: Math.round(totals.confirmedOrders / days.length),
    deliveredOrders: Math.round(totals.deliveredOrders / days.length),
    adBudget: totals.adBudget, // Use total sum instead of average
    ctr: (totals.clicks/ totals.impressions),
    cpl: (totals.adBudget/ totals.leads),
    confirmationRate: (totals.confirmedOrders/ totals.leads),
    deliveryRate: (totals.deliveredOrders - totals.confirmedOrders),
    roas: (totals.deliveredOrders/ totals.adBudget),
    // ctr: calculateCTR(totals.clicks, totals.impressions),
    // cpl: calculateCPL(totals.adBudget, totals.leads),
    // confirmationRate: calculateRate(totals.confirmedOrders, totals.leads),
    // deliveryRate: calculateRate(totals.deliveredOrders, totals.confirmedOrders),
    // roas: calculateROAS(totals.deliveredOrders, totals.adBudget),

  };
}