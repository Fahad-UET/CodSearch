import React, { useState, useEffect } from 'react';
import { PriceInput } from './components/PriceInput';
import { ProfitSection } from './components/ProfitSection';
import { ServiceSettings } from './components/ServiceSettings';
import { PriceAnalytics } from './components/PriceAnalytics';
import { useProductStore } from '../../../../store';

interface SalesPriceTabProps {
  productId: string;
  intialCountry: string;
  onPriceCalculated: (price: number) => void;
  product: any;
}

export function SalesPriceTab({ 
  productId, 
  intialCountry, 
  onPriceCalculated,
  product 
}: SalesPriceTabProps) {
  const [purchasePrice, setPurchasePrice] = useState(product?.purchasePrice || 0);
  const [salePrice, setSalePrice] = useState(product?.salePrice || 0);
  const [serviceSettings, setServiceSettings] = useState({
    shippingCost: 4.99,
    codFee: 5,
    callCenterFee: 2
  });

  const updateProduct = useProductStore(state => state.updateProduct);

  // Calculate profit metrics
  const profit = salePrice - purchasePrice - serviceSettings.shippingCost;
  const profitMargin = salePrice > 0 ? (profit / salePrice) * 100 : 0;

  // Example analytics data
  const analytics = {
    averagePrice: 49.99,
    priceRange: { min: 29.99, max: 69.99 },
    profitTrend: 12.5
  };

  const handleSave = async () => {
    try {
      await updateProduct(productId, {
        purchasePrice,
        salePrice,
        profit,
        profitMargin
      });
      onPriceCalculated(salePrice);
    } catch (error) {
      console.error('Failed to save prices:', error);
    }
  };

  useEffect(() => {
    handleSave();
  }, [purchasePrice, salePrice]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <PriceInput
            label="Purchase Price"
            value={purchasePrice}
            onChange={setPurchasePrice}
          />
          <PriceInput
            label="Sale Price"
            value={salePrice}
            onChange={setSalePrice}
          />
        </div>
        <ProfitSection
          revenue={profit}
          costs={profitMargin}
        />
      </div>

      <ServiceSettings
        settings={serviceSettings}
        onUpdateSettings={(updates) => setServiceSettings(prev => ({ ...prev, ...updates }))}
      />

      <PriceAnalytics metrics={analytics} />
    </div>
  );
}