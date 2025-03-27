export interface CustomFormulasTabProps {
  variables: {
    purchasePrice: number;
    salePrice: number;
    stock: number;
    leads: number;
    cpc: number;
    chargePerProduct: number;
    [key: string]: number;
  };
}

export interface CalculationResults {
  stockInvestment: number;
  serviceInvestment: number;
  personalInvestment: number;
  serviceParticipationRate: number;
  setServiceParticipationRate: (rate: number) => void;
  revenueFromAds: number;
  personalCapitalRoi: number;
  totalExpenses: number;
  expenseBreakdown: {
    advertisingCosts: number;
    deliveryCosts: number;
    returnCosts: number;
    callCenterCosts: number;
    codFees: number;
  };
}