import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw } from 'lucide-react';
import { inputClasses } from '../constants';

interface PricingSectionProps {
  purchasePrice: number;
  salePrice: number;
  onPurchasePriceChange: (value: number) => void;
  onSalePriceChange: (value: number) => void;
}

const CURRENCIES = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 1.08 },
  GBP: { symbol: '£', rate: 1.26 },
  SAR: { symbol: 'SAR', rate: 0.27 },
  AED: { symbol: 'AED', rate: 0.27 },
  KWD: { symbol: 'KWD', rate: 3.25 },
  QAR: { symbol: 'QAR', rate: 0.27 },
  BHD: { symbol: 'BHD', rate: 2.65 },
  OMR: { symbol: 'OMR', rate: 2.60 },
};

export function PricingSection({
  purchasePrice,
  salePrice,
  onPurchasePriceChange,
  onSalePriceChange
}: PricingSectionProps) {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [localSalePrice, setLocalSalePrice] = useState(salePrice);

  useEffect(() => {
    // Convert local price to USD when currency or local price changes
    const usdPrice = localSalePrice * CURRENCIES[selectedCurrency as keyof typeof CURRENCIES].rate;
    onSalePriceChange(usdPrice);
  }, [selectedCurrency, localSalePrice]);

  const handlePriceChange = (value: string, setter: (value: number) => void) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setter(numValue);
    }
  };

  const handleLocalPriceChange = (value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setLocalSalePrice(numValue);
    }
  };

  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-purple-100">
      <h3 className="text-lg font-semibold text-purple-900 mb-4">Pricing</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-700 mb-1">Purchase Price ($)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={purchasePrice || ''}
              onChange={(e) => handlePriceChange(e.target.value, onPurchasePriceChange)}
              className={inputClasses}
              placeholder="0.00"
            />
            <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-purple-700">Sale Price</label>
          
          {/* Local Currency Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="0.01"
                value={localSalePrice || ''}
                onChange={(e) => handleLocalPriceChange(e.target.value)}
                className={inputClasses}
                placeholder="0.00"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-400 font-medium">
                {CURRENCIES[selectedCurrency as keyof typeof CURRENCIES].symbol}
              </span>
            </div>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-24 rounded-lg bg-purple-50/50 border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 text-purple-900"
            >
              {Object.entries(CURRENCIES).map(([code]) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          {/* USD Conversion Display */}
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <RefreshCw size={14} />
            <span>
              ${Math.round(salePrice)} USD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}