// import React, { useState } from 'react';

// export function CurrencyConverterNew() {
//   const [amount, setAmount] = useState(1);
//   const [fromCurrency, setFromCurrency] = useState('USD');
//   const [toCurrency, setToCurrency] = useState('SAR');
//   const [showFromDropdown, setShowFromDropdown] = useState(false);
//   const [showToDropdown, setShowToDropdown] = useState(false);

//   const handleAmountChange = e => {
//     setAmount(e.target.value);
//   };

//   const handleFromCurrencyChange = currency => {
//     setFromCurrency(currency);
//     setShowFromDropdown(false);
//   };

//   const handleToCurrencyChange = currency => {
//     setToCurrency(currency);
//     setShowToDropdown(false);
//   };
//   const handleSwapCurrencies = () => {
//     setFromCurrency(toCurrency);
//     setToCurrency(fromCurrency);
//   };

//   const currencies = [
//     'SAR',
//     'USD',
//     'MAD',
//     'EUR',
//     'AED',
//     'QAR',
//     'BHD',
//     'KWD',
//     'OMR',
//     'GBP',
//     'CHF',
//     'PLN',
//     'SEK',
//     'NOK',
//     'DKK',
//     'DZD',
//     'TND',
//     'NGN',
//     'KES',
//     'ZAR',
//     'EGP',
//     'GHS',
//     'CNY',
//     'PAB',
//     'IQD',
//   ];

//   return (
//     <div className="relative flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
//       <input
//         type="number"
//         className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white/90 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
//         min="0"
//         step="any"
//         value={amount}
//         onChange={handleAmountChange}
//       />

//       <div className="relative">
//         <button
//           onClick={() => setShowFromDropdown(!showFromDropdown)}
//           className="bg-white/5 border border-white/10 rounded px-8 py-1 text-white/90 text-sm focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer hover:bg-white/10"
//         >
//           {fromCurrency}
//         </button>

//         {showFromDropdown && (
//           <div className="absolute z-10 top-[40px] w-[170px] max-h-[400px] overflow-y-auto scrollbar-hide rounded-md shadow-md border border-white/10 backdrop-blur-sm transition-all duration-200">
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md -z-10"></div>
//             <div className="p-2">
//               {currencies.map(currency => (
//                 <div
//                   key={currency}
//                   onClick={() => handleFromCurrencyChange(currency)}
//                   className="cursor-pointer px-3 py-1.5 text-sm text-[#fff] hover:bg-purple-500/50 rounded-md transition-colors"
//                 >
//                   {currency}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <button
//         onClick={handleSwapCurrencies}
//         className="p-1 hover:bg-white/10 rounded transition-colors"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="16"
//           height="16"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           className="lucide lucide-arrow-left-right text-purple-400"
//         >
//           <path d="M8 3 4 7l4 4"></path>
//           <path d="M4 7h16"></path>
//           <path d="m16 21 4-4-4-4"></path>
//           <path d="M20 17H4"></path>
//         </svg>
//       </button>
//       <div className="relative">
//         <button
//           onClick={() => setShowToDropdown(!showToDropdown)}
//           className="bg-white/5 border border-white/10 rounded px-8 py-1 text-white/90 text-sm focus:outline-none focus:border-purple-500/50 transition-colors appearance-none cursor-pointer hover:bg-white/10"
//         >
//           {toCurrency}
//         </button>

//         {showToDropdown && (
//           <div className="absolute z-10 top-[40px] w-[170px] max-h-[400px] overflow-y-auto scrollbar-hide rounded-md shadow-md border border-white/10 backdrop-blur-sm transition-all duration-200">
//             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md -z-10"></div>
//             <div className="p-2">
//               {currencies.map(currency => (
//                 <div
//                   key={currency}
//                   onClick={() => handleToCurrencyChange(currency)}
//                   className="cursor-pointer px-3 py-1.5 text-sm text-[#fff] hover:bg-purple-500/50 rounded-md transition-colors"
//                 >
//                   {currency}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="text-white/90 text-sm px-3 min-w-28 flex items-center gap-2">
//         <button
//           className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors group focus:outline-none"
//           title="Click to copy"
//         >
//           <span className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
//             {(amount * 0.27).toFixed(2)} {/* Simulated conversion rate */}
//           </span>
//           <span className="text-white/60">{toCurrency}</span>
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState, useMemo } from 'react';

export function CurrencyConverterNew() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('SAR');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const handleAmountChange = e => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = currency => {
    setFromCurrency(currency);
    setShowFromDropdown(false);
  };

  const handleToCurrencyChange = currency => {
    setToCurrency(currency);
    setShowToDropdown(false);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currencies = [
    'SAR', 'USD', 'MAD', 'EUR', 'AED', 'QAR', 'BHD', 'KWD', 'OMR',
    'GBP', 'CHF', 'PLN', 'SEK', 'NOK', 'DKK', 'DZD', 'TND', 'NGN',
    'KES', 'ZAR', 'EGP', 'GHS', 'CNY', 'PAB', 'IQD'
  ];

  // Simulated exchange rates relative to USD
  const exchangeRates = {
    USD: 1,
    SAR: 3.75,
    MAD: 10,
    EUR: 0.92,
    AED: 3.67,
    QAR: 3.64,
    BHD: 0.38,
    KWD: 0.31,
    OMR: 0.38,
    GBP: 0.79,
    CHF: 0.91,
    PLN: 4.0,
    SEK: 10.3,
    NOK: 10.6,
    DKK: 6.9,
    DZD: 135,
    TND: 3.1,
    NGN: 1350,
    KES: 145,
    ZAR: 18,
    EGP: 47,
    GHS: 13.5,
    CNY: 7.1,
    PAB: 1,
    IQD: 1310,
  };

  // Dynamic conversion
  const convertedAmount = useMemo(() => {
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    if (!fromRate || !toRate) return 0;
    return (amount / fromRate) * toRate;
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="relative flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
      <input
        type="number"
        className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1 text-white/90 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
        min="0"
        step="any"
        value={amount}
        onChange={handleAmountChange}
      />

      {/* From Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowFromDropdown(!showFromDropdown)}
          className="bg-white/5 border border-white/10 rounded px-8 py-1 text-white/90 text-sm focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer hover:bg-white/10"
        >
          {fromCurrency}
        </button>
        {showFromDropdown && (
          <div className="absolute z-10 top-[40px] w-[170px] max-h-[400px] overflow-y-auto scrollbar-hide rounded-md shadow-md border border-white/10 backdrop-blur-sm transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md -z-10"></div>
            <div className="p-2">
              {currencies.map(currency => (
                <div
                  key={currency}
                  onClick={() => handleFromCurrencyChange(currency)}
                  className="cursor-pointer px-3 py-1.5 text-sm text-[#fff] hover:bg-purple-500/50 rounded-md transition-colors"
                >
                  {currency}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwapCurrencies}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-arrow-left-right text-purple-400"
        >
          <path d="M8 3 4 7l4 4"></path>
          <path d="M4 7h16"></path>
          <path d="m16 21 4-4-4-4"></path>
          <path d="M20 17H4"></path>
        </svg>
      </button>

      {/* To Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowToDropdown(!showToDropdown)}
          className="bg-white/5 border border-white/10 rounded px-8 py-1 text-white/90 text-sm focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer hover:bg-white/10"
        >
          {toCurrency}
        </button>
        {showToDropdown && (
          <div className="absolute z-10 top-[40px] w-[170px] max-h-[400px] overflow-y-auto scrollbar-hide rounded-md shadow-md border border-white/10 backdrop-blur-sm transition-all duration-200">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-md -z-10"></div>
            <div className="p-2">
              {currencies.map(currency => (
                <div
                  key={currency}
                  onClick={() => handleToCurrencyChange(currency)}
                  className="cursor-pointer px-3 py-1.5 text-sm text-[#fff] hover:bg-purple-500/50 rounded-md transition-colors"
                >
                  {currency}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Converted Output */}
      <div className="text-white/90 text-sm px-3 min-w-28 flex items-center gap-2">
        <button
          className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors group focus:outline-none"
          title="Click to copy"
        >
          <span className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors">
            {convertedAmount.toFixed(2)}
          </span>
          <span className="text-white/60">{toCurrency}</span>
        </button>
      </div>
    </div>
  );
}

