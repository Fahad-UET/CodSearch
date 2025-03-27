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
  calculateCallCenterLocal,
} from './Calculation';

const MONTHS = Array.from({ length: 12 }, (_, i) => `X${i + 1}`);

export function calculateMonthlyData(
  product: any,
  cplChangeRate: number,
  deliveryRateChange: number,
  confirmationRateChange: number,
  stockRateChange: number,
  priceRateChange: number
) {
  let currentCPL = product?.price?.cpl;
  let currentDeliveryRate = product?.price?.deliveryRate;
  let currentConfirmationRate = product?.price?.confirmationRate;
  let currentStock = product?.price?.stock;
  let currentPrice = product?.price?.salePrice;

  return MONTHS.map((month, index) => {
    // Adjust CPL by the specified rate each month
    currentCPL = index === 0 ? product?.price?.cpl : currentCPL * (1 + cplChangeRate / 100);
    // Adjust delivery rate by the specified percentage each month
    currentDeliveryRate =
      index === 0
        ? product?.price?.deliveryRate
        : Math.min(100, Math.max(0, currentDeliveryRate * (1 + deliveryRateChange / 100)));
    // Adjust confirmation rate by the specified percentage each month
    currentConfirmationRate =
      index === 0
        ? product?.price?.confirmationRate
        : Math.min(100, Math.max(0, currentConfirmationRate * (1 + confirmationRateChange / 100)));
    // Adjust stock by the specified percentage each month
    currentStock =
      index === 0 ? product?.price?.stock : Math.max(0, currentStock * (1 + stockRateChange / 100));
    // Adjust price by the specified percentage each month
    currentPrice =
      index === 0
        ? product?.price?.salePrice
        : Math.max(0, currentPrice * (1 + priceRateChange / 100));

    const leads = calculateLeads(currentStock, currentConfirmationRate, currentDeliveryRate);
    // const stockCosts = product?.price?.companyServicesFee?.totalProductCost
    // ;
    // const callCenterCosts = product?.price?.companyServicesFee?.totalCallCenterFees

    // const deliveryCosts = product?.price?.companyServicesFee?.shippingCost

    // const returnCosts =product?.price?.companyServicesFee?.totalReturnCost

    // const codFees = product?.price?.companyServicesFee?.totalCodFees

    const revenue = calculateRevenue(currentStock, currentPrice);

    const advertisingCosts = calculateAdvertisingCosts(leads, currentCPL);
    const stockCosts =
      product?.category === 'ECOM_LOCAL'
        ? calculateStockCosts(currentStock, product?.price?.purchasePrice)
        : calculateStockCosts(currentStock, product?.price?.sourcingPrice);

    const callCenterCosts =
      product?.category === 'ECOM_LOCAL'
        ? calculateCallCenterLocal(leads, product?.price?.callCenterFees)
        : product?.price?.companyServicesFee?.totalCallCenterFees
        ? calculateCallCenterCosts(
            leads,
            currentConfirmationRate,
            currentDeliveryRate,
            product?.price?.callCenterFees
          )
        : 0;
    // const callCenterLocal =
    const deliveryCosts = product?.price?.companyServicesFee?.shippingCost;
    const returnCosts = product?.price?.companyServicesFee?.totalReturnCost;
    const codFees = calculateCODFees(currentPrice, currentStock, product?.price?.codFee);

    const totalExpenses =
      (stockCosts || 0) +
      (advertisingCosts || 0) +
      (deliveryCosts || 0) +
      (returnCosts || 0) +
      (callCenterCosts || 0) +
      (codFees || 0);

    const profit = Math.floor(
      revenue - totalExpenses - (product?.price?.netProfitAnalysis?.operatingExpenses || 0)
    );

    return {
      month,
      revenue,
      advertisingCosts: advertisingCosts || 0,
      stockCosts: stockCosts || 0,
      callCenterCosts: callCenterCosts || 0,
      deliveryCosts: deliveryCosts || 0,
      returnCosts: returnCosts || 0,
      codFees: codFees || 0,
      profit: profit,
      loss: profit,
      cpl: currentCPL || 0,
      confirmationRate: currentConfirmationRate || 0,
      deliveryRate: currentDeliveryRate || 0,
      stock: currentStock || 0,
      price: currentPrice || 0,
    };
  });
}
