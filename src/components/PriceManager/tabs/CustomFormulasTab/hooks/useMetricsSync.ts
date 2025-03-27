import { useEffect, useState } from 'react';
import { useProductStore } from '../../../../../store';
import { SalesPriceMetrics } from '../types';

export function useMetricsSync(productId: string) {
  const [metrics, setMetrics] = useState<SalesPriceMetrics>({
    requiredLeads: 0,
    totalSale: 0,
    purchasePrice: 0,
    cpl: 0,
    confirmationRate: 0,
    deliveryRate: 0
  });

  const product = useProductStore(state => 
    state.products.find(p => p.id === productId)
  );

  useEffect(() => {
    if (product?.metrics) {
      setMetrics({
        requiredLeads: product.metrics.requiredLeads || 0,
        totalSale: product.metrics.totalSale || 0,
        purchasePrice: product.price?.purchasePrice || 0,
        cpl: product.metrics.cpl || 0,
        confirmationRate: product.metrics.confirmationRate || 0,
        deliveryRate: product.metrics.deliveryRate || 0
      });
    }
  }, [product]);

  return metrics;
}