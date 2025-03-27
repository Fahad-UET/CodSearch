/**
 * Calculs détaillés des frais de service de l'entreprise
 */

interface ServiceFeesParams {
  stock: number;              // Quantité en stock
  confirmationRate: number;   // Taux de confirmation (0-100%)
  deliveryRate: number;       // Taux de livraison (0-100%)
  leadFeePerUnit: number;     // Frais par lead
  confirmationFeePerUnit: number; // Frais de confirmation par unité
  deliveryFeePerUnit: number; // Frais de livraison par unité
}

/**
 * 1. CALCUL DES LEADS REQUIS
 * --------------------------
 * Formule: Required Leads = stock / (confirmationRate * deliveryRate)
 * Cette formule calcule le nombre de leads nécessaires pour vendre tout le stock
 */
export function calculateRequiredLeads(params: {
  stock: number;
  confirmationRate: number;  // en pourcentage
  deliveryRate: number;      // en pourcentage
}): number {
  const { stock, confirmationRate, deliveryRate } = params;
  return stock / ((confirmationRate / 100) * (deliveryRate / 100));
}

/**
 * 2. CALCUL DES FRAIS DE SERVICE DÉTAILLÉS
 * ---------------------------------------
 * Calcule tous les frais de service avec une décomposition détaillée
 */
export function calculateServiceFees(params: ServiceFeesParams): {
  leadFees: number;
  confirmationFees: number;
  deliveryFees: number;
  totalFees: number;
  requiredLeads: number;
  confirmedOrders: number;
  deliveredOrders: number;
} {
  const {
    stock,
    confirmationRate,
    deliveryRate,
    leadFeePerUnit,
    confirmationFeePerUnit,
    deliveryFeePerUnit
  } = params;

  // 1. Calcul des leads requis
  const requiredLeads = calculateRequiredLeads({
    stock,
    confirmationRate,
    deliveryRate
  });

  // 2. Calcul des commandes confirmées
  const confirmedOrders = requiredLeads * (confirmationRate / 100);

  // 3. Calcul des commandes livrées
  const deliveredOrders = confirmedOrders * (deliveryRate / 100);

  // 4. Calcul des différents frais
  const leadFees = requiredLeads * leadFeePerUnit;
  const confirmationFees = confirmedOrders * confirmationFeePerUnit;
  const deliveryFees = deliveredOrders * deliveryFeePerUnit;

  // 5. Calcul du total des frais
  const totalFees = leadFees + confirmationFees + deliveryFees;

  return {
    leadFees,
    confirmationFees,
    deliveryFees,
    totalFees,
    requiredLeads,
    confirmedOrders,
    deliveredOrders
  };
}

/**
 * Exemple d'utilisation:
 * 
 * const fees = calculateServiceFees({
 *   stock: 100,
 *   confirmationRate: 60,    // 60%
 *   deliveryRate: 45,        // 45%
 *   leadFeePerUnit: 0.5,     // $0.50 par lead
 *   confirmationFeePerUnit: 2, // $2 par confirmation
 *   deliveryFeePerUnit: 3,   // $3 par livraison
 * });
 * 
 * // Résultat:
 * // {
 * //   leadFees: 186,          // (371 leads × $0.50)
 * //   confirmationFees: 445,  // (223 confirmations × $2)
 * //   deliveryFees: 301,      // (100 livraisons × $3)
 * //   totalFees: 931,
 * //   requiredLeads: 371,
 * //   confirmedOrders: 223,
 * //   deliveredOrders: 100
 * // }
 */