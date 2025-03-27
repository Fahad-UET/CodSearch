import { CustomFormulasTabProps, CalculationResults } from '../types';

export function calculateMetrics(
  variables: CustomFormulasTabProps['variables'],
  options: { 
    serviceParticipationRate: number;
    setServiceParticipationRate: (rate: number) => void;
  }
): CalculationResults {
  const stockInvestment = variables.purchasePrice * variables.stock || 0;
  const serviceInvestment = stockInvestment * options.serviceParticipationRate / 100;
  const personalInvestment = stockInvestment - serviceInvestment;

  const adSpend = variables.cpc * variables.leads || 0;
  const operatingCosts = variables.chargePerProduct * variables.stock || 0;
  
  // Calculate detailed expenses
  const deliveryCosts = variables.stock * 5; // Assuming $5 per delivery
  const returnRate = 0.15; // 15% return rate
  const returnCosts = variables.stock * returnRate * 3; // $3 per return
  const callCenterCosts = variables.leads * 0.5; // $0.50 per lead
  const codFees = variables.salePrice * variables.stock * 0.05; // 5% COD fee

  const expenseBreakdown = {
    advertisingCosts: adSpend,
    deliveryCosts,
    returnCosts,
    callCenterCosts,
    codFees
  };

  const totalExpenses = Object.values(expenseBreakdown).reduce((sum, cost) => sum + cost, 0);

  const totalRevenue = variables.salePrice * variables.stock || 0;
  const revenueFromAds = totalExpenses > 0 ? totalRevenue * (adSpend / totalExpenses) : 0;
  const personalCapitalRoi = personalInvestment > 0 
    ? ((totalRevenue - totalExpenses) / personalInvestment) * 100 
    : 0;

  return {
    stockInvestment,
    serviceInvestment,
    personalInvestment,
    serviceParticipationRate: options.serviceParticipationRate,
    setServiceParticipationRate: options.setServiceParticipationRate,
    revenueFromAds,
    personalCapitalRoi,
    totalExpenses,
    expenseBreakdown
  };
}