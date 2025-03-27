import React, { useState, useEffect } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';
import { COUNTRIES } from '../../services/codNetwork/constants';
import { useExchangeRates } from '../../services/codNetwork/hooks';
import { useLocalTime } from '../../hooks/useLocalTime';

interface CurrencyConverterProps {
  showCalculatorFunction: () => void;
  showNotesFunction: () => void;
  showHabitFunction: () => void;
  showPomodoroTimerFunction: () => void;
}

export function CurrencyConverter({
  showCalculatorFunction,
  showNotesFunction,
  showHabitFunction,
  showPomodoroTimerFunction
}: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('SAR');
  const { rates, isLoading } = useExchangeRates();

  // Get local time for selected country
  const { time, date } = useLocalTime(toCurrency);

  const convertedAmount = parseFloat(amount) * (rates[toCurrency] || 1);

  return (
    <div className="flex items-center gap-8">
      {/* Currency Converter */}
      <div className="flex items-center gap-2">
        {/* Amount Input */}
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-24 pl-8 pr-2 h-9 bg-white/5 border border-white/20 text-white rounded-lg focus:border-white/40 focus:ring-0 placeholder-white/40"
            placeholder="Amount"
          />
          <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/60" />
        </div>

        {/* From Currency */}
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="h-9 px-2 bg-white/5 border border-white/20 text-white rounded-lg focus:border-white/40 focus:ring-0 w-20"
        >
          {Object.entries(COUNTRIES).map(([code, { currency }]) => (
            <option key={code} value={currency} className="text-gray-900">
              {currency}
            </option>
          ))}
        </select>

        {/* To Currency */}
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="h-9 px-2 bg-white/5 border border-white/20 text-white rounded-lg focus:border-white/40 focus:ring-0 w-20"
        >
          {Object.entries(COUNTRIES).map(([code, { currency }]) => (
            <option key={code} value={currency} className="text-gray-900">
              {currency}
            </option>
          ))}
        </select>

        {/* Result */}
        <div className="h-9 px-3 bg-white/5 border border-white/20 text-white rounded-lg flex items-center min-w-[100px] justify-end">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-white/60" />
          ) : (
            <span>{convertedAmount.toFixed(2)} {toCurrency}</span>
          )}
        </div>
      </div>

      {/* Local Time Display */}
      <div className="flex items-center gap-2 text-white/80">
        <div className="text-sm">
          <div>{time}</div>
          <div className="text-xs opacity-60">{date}</div>
        </div>
      </div>
    </div>
  );
}