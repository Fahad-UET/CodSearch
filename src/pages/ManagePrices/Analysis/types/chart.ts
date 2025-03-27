export interface ChartDataPoint {
  day: number;
  profit: number;
  cpl: number;
  breakEvenCPL: number;
  sellingPrice: number;
  confirmationRate: number;
  deliveryRate: number;
  leadCost: number;
  leads: number;
  callCenterCost: number;
  breakEvenPrice: number;
  breakEvenConfirmationRate: number;
  breakEvenDeliveryRate: number;
  breakEvenStock: number;
  availableStock: number;
  advertisingCosts: number;
  stockCosts: number;
  deliveryCosts: number;
  returnCosts: number;
  codFees: number;
  revenue: number;
  isAdjusted: boolean;
}

export interface CPLChange {
  id: string;
  day: number;
  value: number;
}

export interface RateChange {
  id: string;
  day: number;
  percentage: number;
  type: 'confirmation' | 'delivery';
}

export interface PriceChange {
  id: string;
  day: number;
  price: number;
}

export interface StockChange {
  id: string;
  day: number;
  stock: number;
}

export interface ProfitMetrics {
  availableStock: number;
  sellingPrice: number;
  purchasePrice: number;
  deliveryServiceCosts: number;
  monthlyFixedCosts: number;
  baseCPL: number;
  baseConfirmationRate: number;
  baseDeliveryRate: number;
  price?: any;
}
