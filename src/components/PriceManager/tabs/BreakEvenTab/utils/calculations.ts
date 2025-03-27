export interface BreakEvenResults {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  profitPerUnit: number;
}

interface BreakEvenParams {
  fixedCosts: number;
  variableCosts: number;
  sellingPrice: number;
}

export function calculateBreakEven({
  fixedCosts,
  variableCosts,
  sellingPrice
}: BreakEvenParams): BreakEvenResults {
  // Avoid division by zero
  if (sellingPrice <= variableCosts) {
    return {
      breakEvenUnits: 0,
      breakEvenRevenue: 0,
      contributionMargin: 0,
      contributionMarginRatio: 0,
      profitPerUnit: 0
    };
  }

  const contributionMargin = sellingPrice - variableCosts;
  const contributionMarginRatio = (contributionMargin / sellingPrice) * 100;
  const breakEvenUnits = fixedCosts / contributionMargin;
  const breakEvenRevenue = breakEvenUnits * sellingPrice;

  return {
    breakEvenUnits,
    breakEvenRevenue,
    contributionMargin,
    contributionMarginRatio,
    profitPerUnit: contributionMargin
  };
}