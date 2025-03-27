export interface SalesPriceFormData {
  salePrice: number;
  confirmationRate: number;
  deliveryRate: number;
  cpl: number;
  profitPerUnit: number;
  stock: number;
  productType: 'cosmetic' | 'gadget';
  serviceType: 'with' | 'without';
}

export interface NetworkStats {
  spend: number;
  leads: number;
  cpl: number;
  roi: number;
}

export interface CalculationResult {
  totalSales: number;
  totalCosts: number;
  profitMargin: number;
  expectedDeliveries: number;
  expectedReturns: number;
  networkStats: Record<string, NetworkStats>;
}