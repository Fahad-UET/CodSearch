import { useState, useEffect } from 'react';
import { useProductStore } from '../../../../../store';

interface SalesPriceMetrics {
  requiredLeads: number;
  salePrice: number;
  sourcingPrice: number;
  profitPerProduct: number;
}

export function useSalesPriceMetrics(productId: string) {
  const [metrics, setMetrics] = useState<SalesPriceMetrics>({
    requiredLeads: 0,
    salePrice: 0,
    sourcingPrice: 0,
    profitPerProduct: 0
  });

  const product = useProductStore(state => 
    state.products.find(p => p.id === productId)
  );

  useEffect(() => {
    if (product?.price) {
      const salePrice = product.price.salePrice || 0;
      const sourcingPrice = product.price.sourcingPrice || 0;
      
      setMetrics({
        requiredLeads: product.metrics?.requiredLeads || 0,
        salePrice,
        sourcingPrice,
        profitPerProduct: salePrice - sourcingPrice
      });
    }
  }, [product]);

  return metrics;
}