export interface ProfitMetrics {
  availableStock: number;
  sellingPrice: number;
  purchasePrice: number;
  baseCPL: number;
  baseConfirmationRate: number;
  baseDeliveryRate: number;
}

export interface CalculatedMetrics {
  expectedLeads: number;
  totalRevenue: number;
  totalProfit: number;
  roi: number;
  profitPerUnit: number;
  profitMargin: number;
  advertisingCosts: number;
  stockCosts: number;
  deliveryCosts: number;
  returnCosts: number;
  codFees: number;
  callCenterCosts: number;
  confirmedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
}