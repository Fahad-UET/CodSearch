import React from 'react';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { ProfitIcon } from '../../icons/ProfitIcon';
import { useLanguageStore } from '../../../store/languageStore';

interface PriceBarProps {
  salePrice: number;
  sourcePrice: number;
  profit: number;
  title: string;
}

export function PriceBar({ salePrice, sourcePrice, profit, title }: PriceBarProps) {
  const { t } = useLanguageStore();
  
  return (
    <div className="flex w-full justify-between absolute bottom-1 px-2 z-50">
      <button
        title={t('Sales Price')}
        className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors w-[95px] justify-center"
      >
        <ShoppingCart size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-medium text-blue-700">{`${salePrice.toFixed(0)} $`}</span>
      </button>
      
      <button
        title={t(title)}
        className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors w-[95px] justify-center"
      >
        <ShoppingBag size={18} className="text-orange-600 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-medium text-orange-700">{`${sourcePrice} $`}</span>
      </button>
      
      <button
        title={t('Profit')}
        className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg group hover:bg-blue-100 transition-colors w-[95px] justify-center"
      >
        <ProfitIcon />
        <span className="text-xs font-medium text-green-600">{`${profit.toFixed(0)} $`}</span>
      </button>
    </div>
  );
}