import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ProfitAnalysisProps {
  profitPerProduct: number;
  previousProfit?: number;
  currency?: string;
}

export function ProfitAnalysis({
  profitPerProduct,
  previousProfit,
  currency = '$'
}: ProfitAnalysisProps) {
  const percentageChange = useMemo(() => {
    if (!previousProfit) return null;
    return ((profitPerProduct - previousProfit) / previousProfit) * 100;
  }, [profitPerProduct, previousProfit]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Profit per Delivered Unit
      </h3>
      
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {currency}{profitPerProduct.toFixed(2)}
        </span>
        
        {percentageChange !== null && (
          <div className={`flex items-center gap-1 text-sm ${
            percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {percentageChange >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(percentageChange).toFixed(1)}%</span>
          </div>
        )}
      </div>

      {previousProfit && (
        <div className="mt-2 text-sm text-gray-500">
          Previous: {currency}{previousProfit.toFixed(2)}
        </div>
      )}
    </div>
  );
}