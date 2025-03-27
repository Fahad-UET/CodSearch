export interface KpiThreshold {
  low: number;
  medium: number;
  high: number;
}

export interface CountryKpiSettings {
  cpc: KpiThreshold;
  cpl: KpiThreshold;
  cpm: KpiThreshold;
  roas: KpiThreshold;
  ctr: KpiThreshold;
  confirmationRate: KpiThreshold;
  deliveryRate: KpiThreshold;
  profitMargin: KpiThreshold;
}

export interface KpiSettings {
  [countryCode: string]: CountryKpiSettings;
}

export const DEFAULT_KPI_SETTINGS: CountryKpiSettings = {
  cpc: { low: 2, medium: 1, high: 0.5 },
  cpl: { low: 6, medium: 4, high: 2 },
  cpm: { low: 15, medium: 10, high: 5 },
  roas: { low: 1.5, medium: 2.5, high: 3.5 },
  ctr: { low: 0.5, medium: 1.5, high: 2.5 },
  confirmationRate: { low: 30, medium: 50, high: 70 },
  deliveryRate: { low: 50, medium: 70, high: 85 },
  profitMargin: { low: 15, medium: 30, high: 45 }
};