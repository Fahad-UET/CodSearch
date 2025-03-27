export function calculateProfitPerUnit(revenue: number, costs: number): number {
  return revenue - costs;
}

export function calculateProfitChange(
  currentProfit: number,
  previousProfit: number
): number {
  if (!previousProfit) return 0;
  return ((currentProfit - previousProfit) / previousProfit) * 100;
}

export function formatCurrency(
  amount: number,
  currency: string = '$',
  decimals: number = 2
): string {
  return `${currency}${amount.toFixed(decimals)}`;
}