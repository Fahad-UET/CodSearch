export interface BreakEvenInputs {
  // Fixed inputs
  fixedCosts: number;
  monthlyCharges: number;
  variableCosts: number;
  
  // Sales metrics
  sellingPrice: number;
  units: number;
  leads: number;
  confirmedOrders: number;
  
  // Rates
  confirmationRate: number;
  deliveryRate: number;
}

export interface BreakEvenResults {
  cpl: number;
  confirmationRate: number;
  deliveryRate: number;
  sellingPrice: number;
  stock: number;
}