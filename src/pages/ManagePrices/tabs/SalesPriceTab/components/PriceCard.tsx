import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PriceCardProps {
  title: string;
  price: number;
  currencyUtils: {
    formatLocalPrice: (price: number) => string;
    convertToUSD: (price: number) => number;
    convertFromUSD: (price: number) => number;
    currencySymbol: string;
  };
  disabled?: boolean;
  isReadOnly?: boolean;
  showPerUnit?: boolean;
  onPriceChange?: (price: number) => void;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export function PriceCard({
  title,
  price,
  currencyUtils,
  disabled = false,
  isReadOnly = false,
  showPerUnit = false,
  onPriceChange,
  actionButton
}: PriceCardProps) {
  const { convertFromUSD, convertToUSD, currencySymbol } = currencyUtils;

  return (
    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>

      <div className="space-y-4">
        {/* Price Input/Display */}
        <div className="relative">
          {isReadOnly ? (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">
                ${price.toFixed(2)}
              </span>
              {showPerUnit && (
                <span className="text-lg text-white/70">per unit</span>
              )}
            </div>
          ) : (
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={convertFromUSD(price)}
                disabled={disabled}
                onChange={e => {
                  const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                  if (!isNaN(numValue) && onPriceChange) {
                    const usdPrice = convertToUSD(numValue);
                    onPriceChange(usdPrice);
                  }
                }}
                className="w-full pl-12 h-14 text-2xl font-medium bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/20"
                placeholder="0.00"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-xl">
                {currencySymbol}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          >
            {actionButton.icon && <actionButton.icon size={20} />}
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
}