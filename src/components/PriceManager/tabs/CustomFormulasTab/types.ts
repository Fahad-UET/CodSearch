export interface SalesPriceMetrics {
  requiredLeads: number;
  totalSale: number;
  purchasePrice: number;
  cpl: number;
  confirmationRate: number;
  deliveryRate: number;
}

export interface CalculatedMetrics {
  expectedLeads: number;
  totalRevenue: number;
  totalProfit: number;
  roi: number;
  profitPerUnit: number;
  profitMargin: number;
}

export interface CostBreakdown {
  advertisingCosts: number;
  stockCosts: number;
  deliveryCosts: number;
  returnCosts: number;
  codFees: number;
  callCenterCosts: number;
}

export interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  format: 'currency' | 'number' | 'percentage';
  color: 'blue' | 'green' | 'purple' | 'indigo' | 'cyan' | 'emerald';
}