import React, { useState } from 'react';
import { ArrowLeftRight, Settings, X } from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

const DEFAULT_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  SAR: 3.75,
  AED: 3.67,
  QAR: 3.64,
  BHD: 0.376,
  KWD: 0.31,
  OMR: 0.38,
  MAD: 10.05,
  DZD: 134.72,
  TND: 3.12,
  NGN: 1592.96,
  KES: 143.5,
  ZAR: 18.95,
  EGP: 30.9,
  GHS: 12.3,
  CNY: 7.19,
  PAB: 1,
  IQD: 1310,
  PLN: 4.02,
  SEK: 10.42,
  NOK: 10.51,
  DKK: 6.87,
  CHF: 0.87,
};

interface RateSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rates: ExchangeRates;
  onSave: (rates: ExchangeRates) => void;
}

const RateSettingsModal: React.FC<RateSettingsModalProps> = ({
  isOpen,
  onClose,
  rates,
  onSave,
}) => {
  const [editedRates, setEditedRates] = useState<ExchangeRates>(rates);
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [newCurrency, setNewCurrency] = useState('');
  const [showAddCurrency, setShowAddCurrency] = useState(false);

  if (!isOpen) return null;

  const handleAddCurrency = () => {
    if (newCurrency && !editedRates[newCurrency]) {
      setEditedRates(prev => ({
        ...prev,
        [newCurrency.toUpperCase()]: editedRates[baseCurrency],
      }));
      setNewCurrency('');
      setShowAddCurrency(false);
    }
  };

  const handleSave = () => {
    onSave(editedRates);
    onClose();
  };

  const handleRateChange = (currency: string, value: number) => {
    const baseRate = editedRates[baseCurrency];
    const newRates = { ...editedRates };

    // Update the rate for the changed currency
    newRates[currency] = value * baseRate;

    setEditedRates(newRates);
  };

  const getRelativeRate = (currency: string) => {
    const baseRate = editedRates[baseCurrency];
    return editedRates[currency] / baseRate;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl w-full max-w-2xl 
        border border-white/10 shadow-xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white/90">Currency Exchange Rates</h2>
            <div className="flex items-center gap-2">
              <span className="text-white/60">Base Currency:</span>
              <select
                value={baseCurrency}
                onChange={e => setBaseCurrency(e.target.value)}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white/90
                  focus:outline-none focus:border-purple-500/50 transition-colors appearance-none
                  cursor-pointer hover:bg-white/10"
              >
                {Object.keys(editedRates).map(currency => (
                  <option key={currency} value={currency} className="bg-black text-white">
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors duration-200
              hover:bg-white/10 rounded-full p-2"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Base Currency Value Display */}
          <div className="mb-6 bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-center gap-3">
              <span className="text-purple-300 font-medium">1 {baseCurrency} =</span>
              <div className="grid grid-cols-4 gap-2">
                {['USD', 'EUR', 'SAR', 'MAD'].map(
                  currency =>
                    currency !== baseCurrency && (
                      <div key={currency} className="text-white/90">
                        {getRelativeRate(currency).toFixed(3)} {currency}
                      </div>
                    )
                )}
              </div>
            </div>
          </div>

          {/* Currency Rates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">
            {Object.keys(editedRates)
              .filter(currency => currency !== baseCurrency)
              .map(currency => (
                <div
                  key={currency}
                  className="flex items-center gap-3 bg-white/5 rounded-lg p-4
                  border border-white/10 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-white/90 font-medium">{currency}</span>
                    <span className="text-white/40 text-xs">per 1 {baseCurrency}</span>
                  </div>
                  <input
                    type="number"
                    value={getRelativeRate(currency)}
                    onChange={e => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        handleRateChange(currency, parseFloat(value.toFixed(3)));
                      }
                    }}
                    step="0.001"
                    className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1
                    text-white/90 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={() => setShowAddCurrency(!showAddCurrency)}
            className="px-4 py-2 text-white/60 hover:text-white/90 transition-colors duration-200
              hover:bg-white/10 rounded-lg flex items-center gap-2"
          >
            {showAddCurrency ? 'Cancel' : 'Add Currency'}
          </button>
          {showAddCurrency && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCurrency}
                onChange={e => setNewCurrency(e.target.value.toUpperCase())}
                placeholder="Currency Code (e.g., JPY)"
                maxLength={3}
                className="bg-white/5 border border-white/10 rounded px-3 py-2
                  text-white/90 placeholder:text-white/30 focus:outline-none
                  focus:border-purple-500/50 transition-colors w-40"
              />
              <button
                onClick={handleAddCurrency}
                disabled={!newCurrency || newCurrency.length !== 3}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300
                  rounded-lg transition-colors duration-300 border border-green-500/30
                  hover:border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          )}
          <button
            onClick={() => setEditedRates(DEFAULT_RATES)}
            className="px-4 py-2 text-white/60 hover:text-white/90 transition-colors duration-200
              hover:bg-white/10 rounded-lg"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300
              rounded-lg transition-colors duration-300 border border-purple-500/30 
              hover:border-purple-500/50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('SAR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [rates, setRates] = useState<ExchangeRates>(DEFAULT_RATES);
  const [loading, setLoading] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Priority Currencies
  const priorityCurrencies = ['SAR', 'USD', 'MAD', 'EUR'];

  // Gulf Countries
  const gulfCurrencies = ['SAR', 'AED', 'QAR', 'BHD', 'KWD', 'OMR'];

  // European Countries
  const europeanCurrencies = ['EUR', 'GBP', 'CHF', 'PLN', 'SEK', 'NOK', 'DKK'];

  // North African Countries
  const northAfricanCurrencies = ['MAD', 'DZD', 'TND'];

  // Other African Countries
  const africanCurrencies = ['NGN', 'KES', 'ZAR', 'EGP', 'GHS'];

  // Other Specified Countries
  const otherCurrencies = ['CNY', 'PAB', 'IQD'];

  const currencies = [
    ...priorityCurrencies,
    '──────────',
    ...gulfCurrencies,
    ...europeanCurrencies,
    ...northAfricanCurrencies,
    ...africanCurrencies,
    ...otherCurrencies,
  ].filter(
    (value, index, self) =>
      // Remove duplicates but keep the separator
      value === '──────────' || self.indexOf(value) === index
  );

  const getCurrencyGroup = (currency: string) => {
    if (gulfCurrencies.includes(currency)) return 'Gulf Countries';
    if (europeanCurrencies.includes(currency)) return 'European Countries';
    if (northAfricanCurrencies.includes(currency)) return 'North Africa';
    if (africanCurrencies.includes(currency)) return 'Africa';
    return 'Other Countries';
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const calculateConversion = () => {
    if (!amount) return '...';
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    const rate = toRate / fromRate;
    const result = parseFloat(amount) * rate;
    return result.toFixed(2);
  };

  const handleCopyResult = () => {
    const result = calculateConversion();
    if (result !== '...') {
      navigator.clipboard.writeText(result);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    }
  };

  return (
    <div className="relative flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
      <input
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white/90 text-sm
          focus:outline-none focus:border-purple-500/50 transition-colors"
        min="0"
        step="any"
      />
      <select
        value={fromCurrency}
        onChange={e => setFromCurrency(e.target.value)}
        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white/90 text-sm
          focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer
          hover:bg-white/10"
        style={{ backgroundImage: 'none' }}
      >
        {currencies.map(currency => (
          <option
            key={currency}
            value={currency}
            className="bg-black text-white"
            disabled={currency === '──────────'}
          >
            {currency}
          </option>
        ))}
      </select>
      <button onClick={handleSwap} className="p-1 hover:bg-white/10 rounded transition-colors">
        <ArrowLeftRight size={16} className="text-purple-400" />
      </button>
      <button
        onClick={() => setShowSettings(true)}
        className="p-1 hover:bg-white/10 rounded transition-colors"
        title="Currency Settings"
      >
        <Settings size={16} className="text-purple-400" />
      </button>
      <select
        value={toCurrency}
        onChange={e => setToCurrency(e.target.value)}
        className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white/90 text-sm
          focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer
          hover:bg-white/10"
        style={{ backgroundImage: 'none' }}
      >
        {currencies.map(currency => (
          <option
            key={currency}
            value={currency}
            className="bg-black text-white"
            disabled={currency === '──────────'}
          >
            {currency}
          </option>
        ))}
      </select>
      <div className="text-white/90 text-sm px-3 min-w-28 flex items-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        ) : (
          <button
            onClick={handleCopyResult}
            className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors
              group focus:outline-none"
            title="Click to copy"
          >
            <span className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
              {calculateConversion()}
            </span>
            <span className="text-white/60">{toCurrency}</span>
          </button>
        )}
      </div>
      {showCopyNotification && (
        <div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
          bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm border border-green-500/30
          whitespace-nowrap"
        >
          Value copied to clipboard!
        </div>
      )}

      <RateSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        rates={rates}
        onSave={setRates}
      />
    </div>
  );
};

export default CurrencyConverter;
