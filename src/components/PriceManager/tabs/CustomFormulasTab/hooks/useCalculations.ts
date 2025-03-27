import { useMemo } from 'react';
import { formulaCalculations } from '../../../../../utils/formulaCalculations';
import { CalculatedMetrics } from '../types';
// CalculationInputs types for props

export function useCalculations(inputs: any) {
  return useMemo(() => {
    const {
      requiredLeads,
      totalSale,
      purchasePrice,
      cpl,
      confirmationRate,
      deliveryRate
    } = inputs;

    // Use Required Leads from Sales Price page
    const expectedLeads = requiredLeads;

    // Use Total Sale from Sales Price page
    const totalRevenue = totalSale;

    // Calculate all costs
    const advertisingCosts = formulaCalculations.calculateAdvertisingCosts(expectedLeads, cpl);
    const stockCosts = formulaCalculations.calculateStockCosts(
      Math.ceil(expectedLeads * (confirmationRate / 100) * (deliveryRate / 100)), 
      purchasePrice
    );
    const callCenterCosts = formulaCalculations.calculateCallCenterCosts(
      expectedLeads,
      confirmationRate,
      deliveryRate
    );
    const deliveryCosts = formulaCalculations.calculateDeliveryCosts(
      expectedLeads,
      confirmationRate,
      deliveryRate
    );
    const returnCosts = formulaCalculations.calculateReturnCosts(
      expectedLeads,
      confirmationRate,
      deliveryRate
    );
    const codFees = formulaCalculations.calculateCODFees(
      expectedLeads,
      confirmationRate,
      deliveryRate,
      totalSale / expectedLeads // Calculate per-unit selling price
    );

    // Calculate total costs
    const totalCosts = formulaCalculations.calculateTotalCosts({
      stockCosts,
      advertisingCosts,
      deliveryCosts,
      returnCosts,
      callCenterCosts,
      codFees
    });

    // Calculate profit and related metrics
    const totalProfit = formulaCalculations.calculateTotalProfit(totalRevenue, totalCosts);
    const roi = formulaCalculations.calculateROI(totalProfit, totalCosts);
    const profitPerUnit = formulaCalculations.calculateProfitPerDelivered(
      totalProfit,
      expectedLeads,
      confirmationRate,
      deliveryRate
    );
    const profitMargin = formulaCalculations.calculateProfitMargin(profitPerUnit, totalSale / expectedLeads);

    return {
      metrics: {
        expectedLeads,
        totalRevenue,
        totalProfit,
        roi,
        profitPerUnit,
        profitMargin
      },
      costs: {
        advertisingCosts,
        stockCosts,
        deliveryCosts,
        returnCosts,
        codFees,
        callCenterCosts
      }
    };
  }, [inputs]);
}