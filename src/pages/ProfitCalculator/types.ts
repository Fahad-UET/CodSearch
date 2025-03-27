export interface ProfitMetrics {
  availableStock: number;
  sellingPrice: number;
  purchasePrice: number;
  baseCPL: number;
  baseConfirmationRate: number;
  baseDeliveryRate: number;
}

export interface RateChange {
  day: number;
  value: number;
}

export interface ChartDataPoint {
  day: number;
  profit: number;
  availableStock: number;
  sellingPrice: number;
  advertisingCost: number;
  confirmationRate: number;
  deliveryRate: number;
  expectedLeads: number;
  callCenterCost: number;
  breakEvenStock?: number;
  breakEvenPrice?: number;
  breakEvenCPL?: number;
  breakEvenConfirmationRate?: number;
  breakEvenDeliveryRate?: number;
  cpl?: any;
  totalExpenses?: any;
}

export interface MetricsState extends ProfitMetrics {
  advertisingChanges: RateChange[];
  confirmationChanges: RateChange[];
  deliveryChanges: RateChange[];
  priceChanges: RateChange[];
  stockChanges: RateChange[];
  leads?: any;
  profit?: any;
  callCenterCost?: any;
  totalExpenses?: any;
  advertisingCost?: any;
}