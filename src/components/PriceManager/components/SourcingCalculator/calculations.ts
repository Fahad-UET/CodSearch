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

interface CalculationParams {
  alibabaPrice: number;
  chargeableWeight: number;
  shippingMethod: 'air' | 'sea';
  customsDutyRate: number;
  vatRate: number;
  declaredValue: number;
  shippingRates?: {
    air: { base: number; min: number };
    sea: { base: number; min: number };
  };
}

export function calculateSourcingPrice(params: CalculationParams) {
  const {
    alibabaPrice,
    chargeableWeight,
    shippingMethod,
    customsDutyRate,
    vatRate,
    shippingRates = SHIPPING_RATES,
  } = params;

  // If no Alibaba price and no weight, return zeros
  if (alibabaPrice === 0 && chargeableWeight === 0) {
    return {
      shippingCost: 0,
      customsDuty: 0,
      vat: 0,
      totalPrice: 0,
      ratePerKg: shippingRates[shippingMethod].base,
      formula: {
        volumetricWeight: '(L × W × H) ÷ 5000',
        shippingCost: 'Chargeable Weight × Shipping Rate',
        customsDuty: 'Product Price × Duty Rate',
        vat: '(Product Price + Shipping + Duty) × VAT Rate',
        total: 'Product Price + Shipping + Duty + VAT',
      },
    };
  }

  // Calculate shipping cost based on chargeable weight and rate per kg
  const baseShippingCost = chargeableWeight * shippingRates[shippingMethod].base;
  const shippingCost = Math.max(baseShippingCost, shippingRates[shippingMethod].min);

  // Calculate customs duty on product value
  const customsDuty = alibabaPrice * (customsDutyRate / 100);

  // Calculate VAT on total value (product + shipping + duty)
  const vatableAmount = alibabaPrice + shippingCost + customsDuty;
  const vat = vatableAmount * (vatRate / 100);

  // Calculate total price
  const totalPrice = alibabaPrice + shippingCost + customsDuty + vat;

  return {
    shippingCost: baseShippingCost, // Return actual calculated cost before minimum
    customsDuty,
    vat,
    totalPrice,
    ratePerKg: shippingRates[shippingMethod].base,
    formula: {
      volumetricWeight: '(L × W × H) ÷ 5000',
      shippingCost: 'Chargeable Weight × Shipping Rate',
      customsDuty: 'Product Price × Duty Rate',
      vat: '(Product Price + Shipping + Duty) × VAT Rate',
      total: 'Product Price + Shipping + Duty + VAT',
    },
  };
}
