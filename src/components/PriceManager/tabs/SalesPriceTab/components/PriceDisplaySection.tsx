import React from 'react';
import { DollarSign, Calculator, Save } from 'lucide-react';
import { useCurrencyDisplay } from '../../../../../hooks/useCurrencyDisplay';

interface PriceDisplaySectionProps {
  salePrice: number;
  sourcingPrice: number;
  onSalePriceChange: (price: number) => void;
  onCalculateClick: () => void;
  selectedCountry: string;
}

export function PriceDisplaySection({
  salePrice,
  sourcingPrice,
  onSalePriceChange,
  onCalculateClick,
  selectedCountry,
}: PriceDisplaySectionProps) {
  const { formatLocalPrice, convertToUSD, convertFromUSD, currencySymbol } =
    useCurrencyDisplay(selectedCountry);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Sales Price Column */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Sale Price</h3>
        </div>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.01"
            value={convertFromUSD(salePrice)}
            disabled={!sourcingPrice}
            onChange={e => {
              const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
              if (!isNaN(numValue)) {
                const usdPrice = convertToUSD(numValue);
                onSalePriceChange(usdPrice);
              }
            }}
            className="w-full pl-12 h-12 text-2xl font-medium bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/20"
            placeholder="0.00"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 text-xl">
            {currencySymbol}
          </span>
        </div>
        <div className="mt-3 text-white/70">
          <div className="text-sm mb-1">USD Conversion</div>
          <div className="text-2xl font-bold text-white">${salePrice.toFixed(2)}</div>
        </div>
      </div>

      {/* Sourcing Price Column */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Sourcing Price</h3>
          <button
            onClick={onCalculateClick}
            className="px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Calculator size={20} />
            Calculate Price
          </button>
        </div>

        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Alibaba Price:</span>
              <span className="text-xl font-bold text-white">${sourcingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Shipping:</span>
              <span className="text-xl font-bold text-white">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Import Duty:</span>
              <span className="text-xl font-bold text-white">$0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">VAT:</span>
              <span className="text-xl font-bold text-white">$0.00</span>
            </div>
            <div className="border-t border-white/20 my-4" />
            <div className="flex justify-between items-center">
              <span className="text-white/80">Total Cost:</span>
              <span className="text-2xl font-bold text-white">${sourcingPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-white/70">
          Click "Calculate Price" to update sourcing costs
        </div>
      </div>
    </div>
  );
}