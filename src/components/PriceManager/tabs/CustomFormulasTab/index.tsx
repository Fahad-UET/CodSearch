import React, { useState } from 'react';
import { SalesPriceMetrics } from './components/SalesPriceMetrics';
import { MetricsGrid } from './components/MetricsGrid';
import { CostBreakdown } from './components/CostBreakdown';
import { CustomFormulasSection } from './components/CustomFormulasSection';
import { useMetricsSync } from './hooks/useMetricsSync';
import { useSalesPriceMetrics } from './hooks/useSalesPriceMetrics';
import { formulaCalculations } from '../../../../utils/formulaCalculations';
import { useFormulaStore } from '@/store/formulaStore';
import { SavedPricesRoi } from './components/SavedPricesRoi';
import { Formula } from '@/types/formula';
import { InvestmentCalculator } from './components/InvestmentCalculator';

interface CustomFormulasTabProps {
  productId: string;
  product: any;
}

export function CustomFormulasTab({ productId, product }: CustomFormulasTabProps) {
  const metrics = useMetricsSync(productId);
  const salesPriceMetrics = useSalesPriceMetrics(productId);
  const { formulas, addFormula, updateFormula, deleteFormula } = useFormulaStore();
  const [selectedFormula, setSelectedFormula] = useState<any | null>(null);
  // const [selectedFormula, setSelectedFormula] = useState<SavedFormula | null>(null);
  const [showFormulaEditor, setShowFormulaEditor] = useState(false);
  const [investmentShare, setInvestmentShare] = useState(0);

  // Calculate all metrics based on synced values
  const calculatedMetrics = {
    expectedLeads: metrics.requiredLeads,
    totalRevenue: metrics.totalSale,
    totalProfit: 0,
    roi: 0,
    profitPerUnit: 0,
    profitMargin: 0
  };

  // Calculate costs
  const costs = {
    advertisingCosts: formulaCalculations.calculateAdvertisingCosts(
      metrics.requiredLeads,
      metrics.cpl
    ),
    stockCosts: formulaCalculations.calculateStockCosts(
      Math.ceil(metrics.requiredLeads * (metrics.confirmationRate / 100) * (metrics.deliveryRate / 100)),
      metrics.purchasePrice
    ),
    deliveryCosts: formulaCalculations.calculateDeliveryCosts(
      metrics.requiredLeads,
      metrics.confirmationRate,
      metrics.deliveryRate
    ),
    returnCosts: formulaCalculations.calculateReturnCosts(
      metrics.requiredLeads,
      metrics.confirmationRate,
      metrics.deliveryRate
    ),
    codFees: formulaCalculations.calculateCODFees(
      metrics.requiredLeads,
      metrics.confirmationRate,
      metrics.deliveryRate,
      metrics.totalSale / metrics.requiredLeads
    ),
    callCenterCosts: formulaCalculations.calculateCallCenterCosts(
      metrics.requiredLeads,
      metrics.confirmationRate,
      metrics.deliveryRate
    )
  };

  // Calculate total costs and update metrics
  const totalCosts = formulaCalculations.calculateTotalCosts(costs);
  calculatedMetrics.totalProfit = formulaCalculations.calculateTotalProfit(
    metrics.totalSale,
    totalCosts
  );
  calculatedMetrics.roi = formulaCalculations.calculateROI(
    calculatedMetrics.totalProfit,
    totalCosts
  );
  calculatedMetrics.profitPerUnit = formulaCalculations.calculateProfitPerDelivered(
    calculatedMetrics.totalProfit,
    metrics.requiredLeads,
    metrics.confirmationRate,
    metrics.deliveryRate
  );
  calculatedMetrics.profitMargin = formulaCalculations.calculateProfitMargin(
    calculatedMetrics.profitPerUnit,
    metrics.totalSale / metrics.requiredLeads
  );

  // Prepare variables for custom formulas
  const variables = {
    ...metrics,
    ...calculatedMetrics,
    ...costs,
    totalCosts,
    salePrice: salesPriceMetrics.salePrice,
    sourcingPrice: salesPriceMetrics.sourcingPrice,
    profitPerProduct: salesPriceMetrics.profitPerProduct
  };

  return (
    <div className="space-y-6">
      {/* Sales Price Metrics */}
      <SalesPriceMetrics
        requiredLeads={salesPriceMetrics.requiredLeads}
        salePrice={salesPriceMetrics.salePrice}
        sourcingPrice={salesPriceMetrics.sourcingPrice}
        profitPerProduct={salesPriceMetrics.profitPerProduct}
      />

      {/* Custom Formulas Section */}
      <CustomFormulasSection variables={variables} />

      {/* Other Metrics */}
      <MetricsGrid metrics={calculatedMetrics} />
      <CostBreakdown costs={costs} />

      {/* Saved Prices ROI Analysis */}
      <div className="mt-8">
        <SavedPricesRoi savedPrices={product.savedPrices || []} />
      </div>
    </div>
  );
}