import { ProfitMetrics } from '../types';

// Base calculations
export function calculateLeads(stock: number, confirmationRate: number, deliveryRate: number): number {
  return stock / ((confirmationRate / 100) * (deliveryRate / 100));
}

export function calculateRevenue(stock: number, sellingPrice: number): number {
  return stock * sellingPrice;
}

// Cost calculations
export function calculateAdvertisingCosts(leads: number, cpl: number): number {
  return leads * cpl;
}

export function calculateStockCosts(stock: number, purchasePrice: number): number {
  return stock * purchasePrice;
}

export function calculateCallCenterCosts(
  stock: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  const leads = calculateLeads(stock, confirmationRate, deliveryRate);
  const baseCost = leads * 0.5;
  const confirmedLeadsCost = leads * (confirmationRate / 100) * 1;
  const deliveredOrdersCost = leads * (confirmationRate / 100) * (deliveryRate / 100) * 2;
  return baseCost + confirmedLeadsCost + deliveredOrdersCost;
}

export function calculateDeliveryCosts(
  leads: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  const deliveryCostPerOrder = 4.99;
  return leads * (confirmationRate / 100) * (deliveryRate / 100) * deliveryCostPerOrder;
}

export function calculateReturnCosts(
  leads: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  const returnCostPerOrder = 2.99;
  const confirmedOrders = leads * (confirmationRate / 100);
  const deliveredOrders = leads * (confirmationRate / 100) * (deliveryRate / 100);
  const returnedOrders = confirmedOrders - deliveredOrders;
  return returnedOrders * returnCostPerOrder;
}

export function calculateCODFees(
  leads: number,
  confirmationRate: number,
  deliveryRate: number,
  sellingPrice: number
): number {
  const codFeePercentage = 0.05;
  const revenue = leads * (confirmationRate / 100) * (deliveryRate / 100) * sellingPrice;
  return revenue * codFeePercentage;
}

// Total profit calculation
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
    metrics.sellingPrice
  );
  
  const totalCosts = stockCosts + advertisingCosts + deliveryCosts + 
                    returnCosts + callCenterCosts + codFees;
  
  return revenue - totalCosts;
}

// Break-even calculations
export function calculateBreakEvenPrice(
  metrics: ProfitMetrics,
  leads: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  let price = metrics.purchasePrice;
  let step = price * 0.1;
  let direction = 1;
  let iterations = 0;
  const maxIterations = 100;

  while (iterations < maxIterations) {
    const revenue = calculateRevenue(metrics.availableStock, price);
    const advertisingCosts = calculateAdvertisingCosts(leads, metrics.baseCPL);
    const callCenterCosts = calculateCallCenterCosts(
      metrics.availableStock,
      confirmationRate,
      deliveryRate
    );
    const deliveryCosts = calculateDeliveryCosts(leads, confirmationRate, deliveryRate);
    const returnCosts = calculateReturnCosts(leads, confirmationRate, deliveryRate);
    const codFees = calculateCODFees(leads, confirmationRate, deliveryRate, price);
    const stockCosts = metrics.availableStock * metrics.purchasePrice;
    
    const totalCosts = stockCosts + advertisingCosts + deliveryCosts + 
                      returnCosts + callCenterCosts + codFees;
    
    const profit = revenue - totalCosts;
    
    if (Math.abs(profit) < 1) break;
    
    if ((profit > 0 && direction > 0) || (profit < 0 && direction < 0)) {
      direction = -direction;
      step /= 2;
    }
    
    price += direction * step;
    iterations++;
  }
  
  return Math.max(price, metrics.purchasePrice);
}

export function calculateBreakEvenCPL(
  metrics: ProfitMetrics,
  leads: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  let cpl = metrics.baseCPL;
  let step = cpl * 0.1;
  let direction = 1;
  let iterations = 0;
  const maxIterations = 100;

  while (iterations < maxIterations) {
    const revenue = calculateRevenue(metrics.availableStock, metrics.sellingPrice);
    const advertisingCosts = calculateAdvertisingCosts(leads, cpl);
    const callCenterCosts = calculateCallCenterCosts(
      metrics.availableStock,
      confirmationRate,
      deliveryRate
    );
    const deliveryCosts = calculateDeliveryCosts(leads, confirmationRate, deliveryRate);
    const returnCosts = calculateReturnCosts(leads, confirmationRate, deliveryRate);
    const codFees = calculateCODFees(
      leads,
      confirmationRate,
      deliveryRate,
      metrics.sellingPrice
    );
    const stockCosts = metrics.availableStock * metrics.purchasePrice;
    
    const totalCosts = stockCosts + advertisingCosts + deliveryCosts + 
                      returnCosts + callCenterCosts + codFees;
    
    const profit = revenue - totalCosts;
    
    if (Math.abs(profit) < 1) break;
    
    if ((profit > 0 && direction > 0) || (profit < 0 && direction < 0)) {
      direction = -direction;
      step /= 2;
    }
    
    cpl += direction * step;
    iterations++;
  }
  
  return Math.max(cpl, 0.01);
}

export function calculateBreakEvenStock(
  metrics: ProfitMetrics,
  leads: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  let stock = metrics.availableStock;
  let step = stock * 0.1;
  let direction = 1;
  let iterations = 0;
  const maxIterations = 100;

  while (iterations < maxIterations) {
    const revenue = calculateRevenue(stock, metrics.sellingPrice);
    const advertisingCosts = calculateAdvertisingCosts(leads, metrics.baseCPL);
    const callCenterCosts = calculateCallCenterCosts(
      stock,
      confirmationRate,
      deliveryRate
    );
    const deliveryCosts = calculateDeliveryCosts(leads, confirmationRate, deliveryRate);
    const returnCosts = calculateReturnCosts(leads, confirmationRate, deliveryRate);
    const codFees = calculateCODFees(
      leads,
      confirmationRate,
      deliveryRate,
      metrics.sellingPrice
    );
    const stockCosts = stock * metrics.purchasePrice;
    
    const totalCosts = stockCosts + advertisingCosts + deliveryCosts + 
                      returnCosts + callCenterCosts + codFees;
    
    const profit = revenue - totalCosts;
    
    if (Math.abs(profit) < 1) break;
    
    if ((profit > 0 && direction > 0) || (profit < 0 && direction < 0)) {
      direction = -direction;
      step /= 2;
    }
    
    stock += direction * step;
    iterations++;
  }
  
  return Math.max(stock, 0);
}

export function calculateBreakEvenRate(
  metrics: ProfitMetrics,
  leads: number,
  currentRate: number,
  isConfirmation: boolean,
  otherRate: number
): number {
  let rate = currentRate;
  let step = 1.0;
  let direction = 1;
  let iterations = 0;
  const maxIterations = 100;

  while (iterations < maxIterations) {
    const confirmationRate = isConfirmation ? rate : metrics.baseConfirmationRate;
    const deliveryRate = isConfirmation ? metrics.baseDeliveryRate : rate;
    
    const revenue = calculateRevenue(metrics.availableStock, metrics.sellingPrice);
    const advertisingCosts = calculateAdvertisingCosts(leads, metrics.baseCPL);
    const callCenterCosts = calculateCallCenterCosts(
      metrics.availableStock,
      confirmationRate,
      deliveryRate
    );
    const deliveryCosts = calculateDeliveryCosts(leads, confirmationRate, deliveryRate);
    const returnCosts = calculateReturnCosts(leads, confirmationRate, deliveryRate);
    const codFees = calculateCODFees(
      leads,
      confirmationRate,
      deliveryRate,
      metrics.sellingPrice
    );
    const stockCosts = metrics.availableStock * metrics.purchasePrice;
    
    const totalCosts = stockCosts + advertisingCosts + deliveryCosts + 
                      returnCosts + callCenterCosts + codFees;
    
    const profit = revenue - totalCosts;
    
    if (Math.abs(profit) < 1) break;
    
    if ((profit > 0 && direction > 0) || (profit < 0 && direction < 0)) {
      direction = -direction;
      step /= 2;
    }
    
    rate += direction * step;
    iterations++;
  }
  
  return Math.min(Math.max(rate, 0), 100);
}