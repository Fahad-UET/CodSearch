export interface CompetitorPrice {
  id: string;
  name: string;
  value: number;
}

export interface Country {
  code: string;
  name: string;
  serviceFee: number;
}

export interface CalculationResults {
  productsReturned: number;
  productsDelivered: number;
  totalSales: number;
  totalShippingCost: number;
  shippingCost: number;
  returnCost: number;
  numberOfLeads: number;
  confirmationRate: number;
  deliveryRate: number;
  salePrice: number;
}