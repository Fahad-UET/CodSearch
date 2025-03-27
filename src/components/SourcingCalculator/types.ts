export interface SourcingCalculation {
  id: string;
  userId: string;
  sourcingPrice: number;
  shippingCost: number;
  customsDuty: number;
  vat: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SourcingFormData {
  alibabaPrice: number;
  chargeableWeight: number;
  shippingMethod: 'air' | 'sea';
  customsDutyRate: number;
  vatRate: number;
  declaredValue: number;
  shippingRate: number;
}

export interface CalculationResult {
  shippingCost: number;
  customsDuty: number;
  vat: number;
  totalPrice: number;
  ratePerKg: number;
  formula: {
    volumetricWeight: string;
    shippingCost: string;
    customsDuty: string;
    vat: string;
    total: string;
  };
}
