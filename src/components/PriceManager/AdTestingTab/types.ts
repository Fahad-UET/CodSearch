export interface NetworkMetrics {
  cpm?: number;
  cpc?: number;
  ctr: number;
  budget?: number;
  impressions: number;
  clicks: number;
  leads: number;
  sellingPrice?: any;
}

export interface NetworkData {
  isActive: boolean;
  metrics: NetworkMetrics;
  notes: string;
}

export interface DayData {
  id: string;
  date: Date;
  time: string;
  notes?: string;
  networks: {
    [key: string]: NetworkData;
  };
}

export interface CalculatedMetrics {
  cpl?: number;
  deliveryRate?: number;
  confirmationRate?: number;
  roas?: number;
  // to resolve build issue please check this added
  confirmedOrders?: number;
  deliveredOrders?: number;
  adBudget?: number;
}

export interface AverageMetrics extends NetworkMetrics, CalculatedMetrics {}

export interface PerDollarMetrics {
  impressions: number;
  clicks: number;
  leads: number;
}