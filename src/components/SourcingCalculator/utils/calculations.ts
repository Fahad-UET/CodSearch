import { SourcingFormData, CalculationResult } from '../types';

// Shipping rates per kg
export const SHIPPING_RATES = {
  air: {
    base: 10, // Base rate for air freight per kg
    min: 50, // Minimum shipping cost
  },
  sea: {
    base: 5, // Base rate for sea freight per kg
    min: 150, // Minimum shipping cost
  },
};

export function calculateVolumetricWeight(length: number, width: number, height: number): number {
  // Volumetric weight formula: (L × W × H) ÷ 5000
  return (length * width * height) / 5000;
}

export function calculateSourcingPrice(params: SourcingFormData): CalculationResult {
  const {
    alibabaPrice,
    chargeableWeight,
    customsDutyRate,
    vatRate,
    shippingRate, // Shipping rate provided in formData
  } = params;

  // If no Alibaba price and no weight, return zeros
  if (alibabaPrice === 0 && chargeableWeight === 0) {
    return {
      shippingCost: 0,
      customsDuty: 0,
      vat: 0,
      totalPrice: 0,
      ratePerKg: shippingRate || 0,
      formula: {
        volumetricWeight: '(L × W × H) ÷ 5000',
        shippingCost: 'Chargeable Weight × Shipping Rate',
        customsDuty: 'Product Price × Duty Rate',
        vat: '(Product Price + Shipping + Duty) × VAT Rate',
        total: 'Product Price + Shipping + Duty + VAT',
      },
    };
  }

  // Calculate Shipping Cost (Chargeable Weight × Shipping Rate)
  const shippingCost = chargeableWeight * (shippingRate || 0);

  // Calculate Customs Duty (Product Price × Duty Rate)
  const customsDuty = alibabaPrice * (customsDutyRate / 100);

  // Calculate VAT ((Product Price + Shipping + Duty) × VAT Rate)
  const vatableAmount = alibabaPrice + shippingCost + customsDuty;
  const vat = vatableAmount * (vatRate / 100);

  // Calculate Total Price (Product Price + Shipping + Duty + VAT)
  const totalPrice = alibabaPrice + shippingCost + customsDuty + vat;

  return {
    shippingCost,
    customsDuty,
    vat,
    totalPrice,
    ratePerKg: shippingRate || 0,
    formula: {
      volumetricWeight: '(L × W × H) ÷ 5000',
      shippingCost: 'Chargeable Weight × Shipping Rate',
      customsDuty: 'Product Price × Duty Rate',
      vat: '(Product Price + Shipping + Duty) × VAT Rate',
      total: 'Product Price + Shipping + Duty + VAT',
    },
  };
}
