import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { CostInputs } from './components/CostInputs';
import { BreakEvenChart } from './components/BreakEvenChart';
import { ResultsDisplay } from './components/ResultsDisplay';
import { calculateBreakEven } from './utils/calculations';
import { Product } from '../../../../types';

interface BreakEvenTabProps {
  product: Product;
}

export function BreakEvenTab({ product }: BreakEvenTabProps) {
  const [fixedCosts, setFixedCosts] = useState(0);
  const [variableCosts, setVariableCosts] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(product.salePrice || 0);

  const results = calculateBreakEven({
    fixedCosts,
    variableCosts,
    sellingPrice
  });

  useEffect(() => {
    if (product.salePrice) {
      setSellingPrice(product.salePrice);
    }
  }, [product.salePrice]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white p-6 rounded-xl border border-gray-200">
        <Calculator className="w-6 h-6 text-purple-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Break Even Analysis</h2>
          <p className="text-sm text-gray-500">Calculate your break-even point and profit margins</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          <CostInputs
            fixedCosts={fixedCosts}
            variableCosts={variableCosts}
            sellingPrice={sellingPrice}
            onFixedCostsChange={setFixedCosts}
            onVariableCostsChange={setVariableCosts}
            onSellingPriceChange={setSellingPrice}
          />
        </div>

        {/* Middle Column - Chart */}
        <div className="col-span-2">
          <BreakEvenChart
            // fixedCosts={fixedCosts}
            // variableCosts={variableCosts}
            // sellingPrice={sellingPrice}
            breakEvenPoint={results.breakEvenUnits}
          />
        </div>
      </div>

      {/* Results Section */}
      <ResultsDisplay results={results} />
    </div>
  );
}