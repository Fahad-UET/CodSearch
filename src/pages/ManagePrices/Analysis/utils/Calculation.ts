import { ProfitMetrics } from '../types/chart';

// Calculs de base
export function calculateLeads(
  stock: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  return Math.ceil(stock / ((confirmationRate / 100) * (deliveryRate / 100)));
}

export function calculateRevenue(stock: number, sellingPrice: number): number {
  // Revenu total basé sur le stock vendu
  return stock * sellingPrice;
}

// Calculs des coûts
export function calculateAdvertisingCosts(leads: number, cpl: number): number {
  // Coût total de la publicité

  return leads * cpl;
}

export function calculateStockCosts(stock: number, purchasePrice: number): number {
  // Coût total d'achat du stock
  return stock * purchasePrice;
}

export function calculateCallCenterCosts(
  requiredLeads: number,
  confirmationRate: number,
  deliveryRate: number,
  callCenterFees?: any
): number {
  const leadFees = requiredLeads * callCenterFees?.lead;

  // Confirmation Fees
  const confirmationFees = requiredLeads * (confirmationRate / 100) * callCenterFees?.confirmation;

  // Delivery Fees
  const deliveryFees =
    requiredLeads * (confirmationRate / 100) * (deliveryRate / 100) * callCenterFees?.delivered;

  const totalCallCenter = leadFees + confirmationFees + deliveryFees;

  return totalCallCenter;
}

export function calculateCallCenterLocal(requiredLeads: number, callCentreCost: number) {
  return requiredLeads * callCentreCost;
}

export function calculateDeliveryCosts(
  leads: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  // Coût de livraison fixe par commande livrée
  const deliveryCostPerOrder = 4.99;
  return leads * (confirmationRate / 100) * (deliveryRate / 100) * deliveryCostPerOrder;
}

export function calculateReturnCosts(
  leads: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  // Coût fixe par retour
  const returnCostPerOrder = 2.99;

  // Calcul des commandes confirmées mais non livrées (retours)
  const confirmedOrders = leads * (confirmationRate / 100);
  const deliveredOrders = leads * (confirmationRate / 100) * (deliveryRate / 100);
  const returnedOrders = confirmedOrders - deliveredOrders;

  return returnedOrders * returnCostPerOrder;
}

export function calculateCODFees(
  sellingPrice: number,
  stockAvailable: number,
  codFee: number
): number {
  // Frais de paiement à la livraison (5% du revenu)
  const codFees = (sellingPrice * stockAvailable * codFee) / 100;
  return codFees;
}

// Calculs de rentabilité
export function calculateTotalProfit(metrics: ProfitMetrics): number {
  const leads = calculateLeads(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );

  // Calcul du revenu
  const revenue = calculateRevenue(metrics.availableStock, metrics.sellingPrice);

  // Calcul de tous les coûts
  const advertisingCosts = calculateAdvertisingCosts(leads, metrics.baseCPL);
  const stockCosts = calculateStockCosts(metrics.availableStock, metrics.purchasePrice);
  const callCenterCosts = calculateCallCenterCosts(
    metrics.availableStock,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const deliveryCosts = calculateDeliveryCosts(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const returnCosts = calculateReturnCosts(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate
  );
  const codFees = calculateCODFees(
    leads,
    metrics.baseConfirmationRate,
    metrics.baseDeliveryRate,
    // metrics.sellingPrice
  );

  // Calcul des coûts totaux
  const totalCosts =
    stockCosts + advertisingCosts + deliveryCosts + returnCosts + callCenterCosts + codFees;

  // Profit = Revenu - Coûts totaux
  return revenue - totalCosts;
}

export function calculateROI(profit: number, totalCosts: number): number {
  // ROI = (Profit / Coûts totaux) * 100
  return totalCosts === 0 ? 0 : (profit / totalCosts) * 100;
}

export function calculateProfitPerDelivered(
  profit: number,
  leads: number,
  confirmationRate: number,
  deliveryRate: number
): number {
  // Calcul du nombre d'unités livrées
  const deliveredUnits = leads * (confirmationRate / 100) * (deliveryRate / 100);

  // Profit par unité livrée
  return deliveredUnits === 0 ? 0 : profit / deliveredUnits;
}

export function calculateProfitMargin(profitPerDelivered: number, sellingPrice: number): number {
  // Marge bénéficiaire = (Profit par unité / Prix de vente) * 100
  return sellingPrice === 0 ? 0 : (profitPerDelivered / sellingPrice) * 100;
}
