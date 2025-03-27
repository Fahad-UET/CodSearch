// Utility functions for formula calculations
export const formulaCalculations = {
  // 1. Expected Leads
  calculateExpectedLeads(availableStock: number, confirmationRate: number, deliveryRate: number): number {
    if (confirmationRate === 0 || deliveryRate === 0) return 0;
    return Math.ceil(availableStock / ((confirmationRate / 100) * (deliveryRate / 100)));
  },

  // 2. Total Revenue
  calculateTotalRevenue(availableStock: number, sellingPrice: number): number {
    return Math.max(0, availableStock * sellingPrice);
  },

  // 3. Total Profit
  calculateTotalProfit(revenue: number, totalCosts: number): number {
    return Math.max(0, revenue - totalCosts);
  },

  // 4. ROI
  calculateROI(profit: number, totalCosts: number): number {
    return totalCosts === 0 ? 0 : Math.max(0, (profit / totalCosts) * 100);
  },

  // 5. Profit per Delivered Unit
  calculateProfitPerDelivered(
    profit: number,
    leads: number,
    confirmationRate: number,
    deliveryRate: number
  ): number {
    const deliveredUnits = leads * (confirmationRate / 100) * (deliveryRate / 100);
    return deliveredUnits === 0 ? 0 : profit / deliveredUnits;
  },

  // 6. Profit Margin
  calculateProfitMargin(profitPerDelivered: number, sellingPrice: number): number {
    return sellingPrice === 0 ? 0 : Math.min(100, (profitPerDelivered / sellingPrice) * 100);
  },

  // Cost Calculations
  calculateAdvertisingCosts(leads: number, cpl: number): number {
    return Math.max(0, leads * cpl);
  },

  calculateStockCosts(stock: number, purchasePrice: number): number {
    return Math.max(0, stock * purchasePrice);
  },

  calculateCallCenterCosts(
    leads: number,
    confirmationRate: number,
    deliveryRate: number
  ): number {
    const baseCost = leads * 0.5;
    const confirmedLeadsCost = leads * (confirmationRate / 100) * 1;
    const deliveredOrdersCost = leads * (confirmationRate / 100) * (deliveryRate / 100) * 2;
    return Math.max(0, baseCost + confirmedLeadsCost + deliveredOrdersCost);
  },

  calculateDeliveryCosts(
    leads: number,
    confirmationRate: number,
    deliveryRate: number
  ): number {
    const deliveryCostPerOrder = 4.99;
    return Math.max(0, leads * (confirmationRate / 100) * (deliveryRate / 100) * deliveryCostPerOrder);
  },

  calculateReturnCosts(
    leads: number,
    confirmationRate: number,
    deliveryRate: number
  ): number {
    const returnCostPerOrder = 2.99;
    const confirmedOrders = leads * (confirmationRate / 100);
    const deliveredOrders = leads * (confirmationRate / 100) * (deliveryRate / 100);
    const returnedOrders = confirmedOrders - deliveredOrders;
    return Math.max(0, returnedOrders * returnCostPerOrder);
  },

  calculateCODFees(
    leads: number,
    confirmationRate: number,
    deliveryRate: number,
    sellingPrice: number
  ): number {
    const codFeePercentage = 0.05;
    const revenue = leads * (confirmationRate / 100) * (deliveryRate / 100) * sellingPrice;
    return Math.max(0, revenue * codFeePercentage);
  },

  // Calculate total costs
  calculateTotalCosts(costs: {
    stockCosts: number;
    advertisingCosts: number;
    deliveryCosts: number;
    returnCosts: number;
    callCenterCosts: number;
    codFees: number;
  }): number {
    return Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  }
};