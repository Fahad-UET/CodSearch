import React from 'react';
import { Loader2 } from 'lucide-react';

interface ConversionResultProps {
  amount: string;
  currency: string;
  isLoading: boolean;
}

export function ConversionResult({ amount, currency, isLoading }: ConversionResultProps) {
  return (
    <div className="h-9 px-3 bg-white/5 border border-white/20 text-white rounded-lg flex items-center min-w-[100px] justify-end">
      {isLoading ? (
        <Loader2 size={16} className="animate-spin text-white/60" />
      ) : (
        <span>
          {amount} {currency}
        </span>
      )}
    </div>
  );
}