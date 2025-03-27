import React from 'react';
import { ProfitIcon } from '../icons/ProfitIcon';

interface ProfitDisplayProps {
  purchasePrice: number;
  salePrice: number;
}

export function ProfitDisplay({ purchasePrice, salePrice }: ProfitDisplayProps) {
  const profit = salePrice - purchasePrice;
  
  return (
    <button
      title="Profit"
      className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors w-[95px] justify-center"
    >
      <ProfitIcon className="text-green-600 group-hover:scale-110 transition-transform" />
      <span className="text-xs font-medium text-green-600">
        {profit.toFixed(0)} $
      </span>
    </button>
  );
}