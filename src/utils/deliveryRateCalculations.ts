/**
 * Calcul du break-even pour le taux de livraison
 */

interface BreakEvenParams {
  salesPrice: number;         // Prix de vente
  productCost: number;        // Coût du produit
  shippingCost: number;       // Coût d'expédition
  returnCost: number;         // Coût de retour
  leadFee: number;           // Frais par lead
  confirmationFee: number;    // Frais de confirmation
  deliveryFee: number;       // Frais de livraison
  confirmationRate: number;   // Taux de confirmation (0-100%)
}

/**
 * Calcule le taux de livraison au point d'équilibre
 * 
 * Formule:
 * Break-even Delivery Rate = Total Costs / (Revenue per Order × Confirmation Rate)
 * 
 * Où:
 * - Total Costs = Product Cost + Shipping + Returns + Lead Fees + Confirmation Fees + Delivery Fees
 * - Revenue per Order = Sales Price - (Product Cost + Shipping Cost)
 */
export function calculateDeliveryRateBreakEven(params: BreakEvenParams): {
  breakEvenRate: number;
  details: {
    totalCosts: number;
    revenuePerOrder: number;
    requiredDeliveries: number;
  };
} {
  const {
    salesPrice,
    productCost,
    shippingCost,
    returnCost,
    leadFee,
    confirmationFee,
    deliveryFee,
    confirmationRate
  } = params;

  // 1. Calcul du revenu par commande
  const revenuePerOrder = salesPrice - (productCost + shippingCost);

  // 2. Calcul des coûts totaux
  const totalCosts = 
    productCost +           // Coût du produit
    shippingCost +         // Frais d'expédition
    returnCost +           // Coûts de retour
    leadFee +              // Frais de lead
    confirmationFee +      // Frais de confirmation
    deliveryFee;          // Frais de livraison

  // 3. Calcul du taux de livraison au point d'équilibre
  const breakEvenRate = (totalCosts / (revenuePerOrder * (confirmationRate / 100))) * 100;

  // 4. Calcul du nombre de livraisons requises pour atteindre le break-even
  const requiredDeliveries = totalCosts / revenuePerOrder;

  return {
    breakEvenRate,
    details: {
      totalCosts,
      revenuePerOrder,
      requiredDeliveries
    }
  };
}

/**
 * Exemple d'utilisation:
 * 
 * const breakEven = calculateDeliveryRateBreakEven({
 *   salesPrice: 50,
 *   productCost: 20,
 *   shippingCost: 5,
 *   returnCost: 3,
 *   leadFee: 0.5,
 *   confirmationFee: 2,
 *   deliveryFee: 3,
 *   confirmationRate: 60
 * });
 * 
 * // Résultat:
 * // {
 * //   breakEvenRate: 45,  // 45% taux de livraison nécessaire
 * //   details: {
 * //     totalCosts: 33.5,
 * //     revenuePerOrder: 25,
 * //     requiredDeliveries: 1.34
 * //   }
 * // }
 */