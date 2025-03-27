import { CountrySettingsData } from '../../../services/serviceProviders/types';
import { CountryKpiSettings } from '../../../types/kpi';

interface CalculationParams {
  purchasePrice: number;
  salePrice: number;
  unitCount: number;
  requiredLeads: number;
  confirmationRate: number;
  deliveryRate: number;
  countrySettings: CountrySettingsData;
  kpiSettings: CountryKpiSettings;
  productType: 'cosmetic' | 'gadget';
  serviceType: 'with' | 'without';
}

interface CalculationResults {
  totalSales: number;
  shippingCost: number;
  returnCost: number;
  totalShipping: number;
  totalCallCenter: number;
  leadFees: number;
  confirmationFees: number;
  deliveryFees: number;
  codFees: number;
  adsFees: number;
  totalMonthlyCharges: number;
  totalCosts: number;
  totalProfit: number;
  profitPerDelivered: number;
  profitMargin: number;
  confirmedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  monthlyChargesPerProduct: number;
  adsCpl: number;
  shippingCosts: {
    shipping: number;
    return: number;
  };
  callCenterFees: {
    lead: number;
    confirmation: number;
    delivered: number;
  };
}

export function calculateProfitability(params: CalculationParams): CalculationResults {
  const {
    purchasePrice,
    salePrice,
    unitCount,
    requiredLeads,
    confirmationRate,
    deliveryRate,
    countrySettings,
    kpiSettings,
    productType,
    serviceType
  } = params;

  // Get shipping costs based on service type
  const shippingCosts = serviceType === 'with'
    ? countrySettings.shippingCosts.withCallCenter
    : countrySettings.shippingCosts.withoutCallCenter;

  // Get call center fees based on product type
  const callCenterFees = countrySettings.callCenterFees[productType];
  
  // Calculate confirmed and delivered orders based on rates
  const confirmedOrders = Math.round(requiredLeads * (confirmationRate / 100));
  const deliveredOrders = Math.round(confirmedOrders * (deliveryRate / 100));
  const returnedOrders = confirmedOrders - deliveredOrders;
  
  // Shipping calculations
  const shippingCost = confirmedOrders * shippingCosts.shipping;
  const returnCost = returnedOrders * shippingCosts.return;
  const totalShipping = shippingCost + returnCost;
  
  // Call center costs with new formula based on required leads
  const leadFees = requiredLeads * callCenterFees.lead;
  const confirmationFees = confirmedOrders * callCenterFees.confirmation;
  const deliveryFees = deliveredOrders * callCenterFees.delivered;
  const totalCallCenter = serviceType === 'with' ? (leadFees + confirmationFees + deliveryFees) : 0;

  // Ad costs - using CPL from KPI settings
  const adsCpl = kpiSettings.cpl.high;
  const adsFees = requiredLeads * adsCpl;

  // Monthly charges calculation
  const monthlyChargesPerProduct = 2.45; // Default value
  const totalMonthlyCharges = monthlyChargesPerProduct * unitCount;
  
  // COD fees
  const codFees = salePrice * deliveredOrders * (countrySettings.codFee / 100);
  
  // Final calculations
  const totalSales = salePrice * deliveredOrders;
  const totalCosts = (purchasePrice * deliveredOrders) + totalShipping + totalCallCenter + codFees + adsFees + totalMonthlyCharges;
  const totalProfit = totalSales - totalCosts;
  const profitPerDelivered = deliveredOrders > 0 ? totalProfit / deliveredOrders : 0;
  const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

  return {
    totalSales,
    shippingCost,
    returnCost,
    totalShipping,
    totalCallCenter,
    leadFees,
    confirmationFees,
    deliveryFees,
    codFees,
    adsFees,
    totalMonthlyCharges,
    totalCosts,
    totalProfit,
    profitPerDelivered,
    profitMargin,
    confirmedOrders,
    deliveredOrders,
    returnedOrders,
    monthlyChargesPerProduct,
    adsCpl,
    shippingCosts,
    callCenterFees
  };
}