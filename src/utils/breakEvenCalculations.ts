import { BreakEvenInputs } from '../types';

export interface BreakEvenResults {
  cpl: number;
  confirmationRate: number;
  deliveryRate: number;
  sellingPrice: number;
  stock: number;
}

// Helper function for safe division
function safeDivide(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return numerator / denominator;
}

export function calculateBreakEvenPoints(inputs: BreakEvenInputs): BreakEvenResults {
  // 1. Break-even Selling Price
  // At break-even: Revenue = Total Costs
  // Total Costs = Fixed Costs + Variable Costs + Monthly Charges
  // Revenue = Units × Price × (ConfRate/100) × (DelRate/100)
  const calculateBreakEvenSellingPrice = () => {
    const totalCosts = inputs.fixedCosts + inputs.monthlyCharges + 
                      (inputs.variableCosts * inputs.units);
    const expectedSales = inputs.units * (inputs.confirmationRate / 100) * 
                         (inputs.deliveryRate / 100);
    
    return safeDivide(totalCosts, expectedSales);
  };

  // 2. Break-even Stock (Units)
  // At break-even: Revenue = Total Costs
  // Price × Units × (ConfRate/100) × (DelRate/100) = FC + MC + (VC × Units)
  // Units × [Price × (ConfRate/100) × (DelRate/100) - VC] = FC + MC
  const calculateBreakEvenStock = () => {
    const revenuePerUnit = inputs.sellingPrice * (inputs.confirmationRate / 100) * 
                          (inputs.deliveryRate / 100);
    const contributionMargin = revenuePerUnit - inputs.variableCosts;
    
    if (contributionMargin <= 0) return 0; // Cannot break even
    
    return Math.ceil(
      safeDivide(
        inputs.fixedCosts + inputs.monthlyCharges,
        contributionMargin
      )
    );
  };

  // 3. Break-even Confirmation Rate
  // At break-even: Revenue = Total Costs
  // Price × Units × ConfRate × DelRate = FC + MC + (VC × Units)
  const calculateBreakEvenConfirmationRate = () => {
    const totalCosts = inputs.fixedCosts + inputs.monthlyCharges + 
                      (inputs.variableCosts * inputs.units);
    const potentialRevenue = inputs.sellingPrice * inputs.units * 
                            (inputs.deliveryRate / 100);
    
    return safeDivide(totalCosts * 100, potentialRevenue);
  };

  // 4. Break-even Delivery Rate
  // Similar to confirmation rate but based on confirmed orders
  const calculateBreakEvenDeliveryRate = () => {
    const totalCosts = inputs.fixedCosts + inputs.monthlyCharges + 
                      (inputs.variableCosts * inputs.units);
    const potentialRevenue = inputs.sellingPrice * inputs.confirmedOrders;
    
    return safeDivide(totalCosts * 100, potentialRevenue);
  };

  // 5. Break-even CPL (Cost Per Lead)
  // At break-even: Revenue - Marketing Costs = Other Costs
  // Price × Units × (ConfRate/100) × (DelRate/100) - (CPL × Leads) = FC + MC + (VC × Units)
  const calculateBreakEvenCPL = () => {
    const revenue = inputs.sellingPrice * inputs.units * 
                   (inputs.confirmationRate / 100) * (inputs.deliveryRate / 100);
    const otherCosts = inputs.fixedCosts + inputs.monthlyCharges + 
                      (inputs.variableCosts * inputs.units);
    
    return safeDivide(revenue - otherCosts, inputs.leads);
  };

  return {
    sellingPrice: calculateBreakEvenSellingPrice(),
    stock: calculateBreakEvenStock(),
    confirmationRate: calculateBreakEvenConfirmationRate(),
    deliveryRate: calculateBreakEvenDeliveryRate(),
    cpl: calculateBreakEvenCPL()
  };
}

// Helper function to calculate current profit/loss
export function calculateProfitLoss(
  inputs: BreakEvenInputs,
  actual: {
    cpl: number;
    confirmationRate: number;
    deliveryRate: number;
    sellingPrice: number;
    stock: number;
  }
): number {
  // Calculate revenue
  const expectedSales = actual.stock * (actual.confirmationRate / 100) * 
                       (actual.deliveryRate / 100);
  const revenue = expectedSales * actual.sellingPrice;

  // Calculate total costs
  const fixedCosts = inputs.fixedCosts + inputs.monthlyCharges;
  const variableCosts = actual.stock * inputs.variableCosts;
  const marketingCosts = actual.cpl * inputs.leads;
  const totalCosts = fixedCosts + variableCosts + marketingCosts;

  return revenue - totalCosts;
}

// Helper function to check if we've reached break-even
export function hasReachedBreakEven(
  actual: {
    cpl: number;
    confirmationRate: number;
    deliveryRate: number;
    sellingPrice: number;
    stock: number;
  },
  breakEven: BreakEvenResults
): boolean {
  return actual.sellingPrice >= breakEven.sellingPrice &&
         actual.stock >= breakEven.stock &&
         actual.confirmationRate >= breakEven.confirmationRate &&
         actual.deliveryRate >= breakEven.deliveryRate &&
         actual.cpl <= breakEven.cpl;
}

// Helper function to calculate percentage to break-even
export function calculateBreakEvenPercentage(actual: number, breakEven: number): number {
  return safeDivide(actual, breakEven) * 100;
}

/**
 * Calcule le taux de livraison minimum nécessaire pour atteindre le seuil de rentabilité
 * @param productCost - Coût du produit
 * @param shippingCost - Coût d'expédition
 * @param sellingPrice - Prix de vente
 * @param fixedCosts - Coûts fixes (marketing, frais généraux, etc.)
 * @returns Le taux de livraison minimum nécessaire en pourcentage
 */
export function calculateDeliveryRateBreakEven(
  productCost: number,
  shippingCost: number,
  sellingPrice: number,
  fixedCosts: number
): number {
  // Coût total par unité
  const totalUnitCost = productCost + shippingCost;
  
  // Marge par unité
  const unitMargin = sellingPrice - totalUnitCost;
  
  // Nombre d'unités nécessaires pour couvrir les coûts fixes
  const unitsNeeded = fixedCosts / unitMargin;
  
  // Taux de livraison minimum requis (en pourcentage)
  const minimumDeliveryRate = (unitsNeeded / (fixedCosts / productCost)) * 100;
  
  return Math.max(0, Math.min(100, minimumDeliveryRate));
}