export const CURRENCIES = {
  'SAR': { name: 'Saudi Riyal', flag: '🇸🇦', defaultRate: 3.75 },
  'AED': { name: 'UAE Dirham', flag: '🇦🇪', defaultRate: 3.67 },
  'BHD': { name: 'Bahraini Dinar', flag: '🇧🇭', defaultRate: 0.376 },
  'OMR': { name: 'Omani Rial', flag: '🇴🇲', defaultRate: 0.385 },
  'KWD': { name: 'Kuwaiti Dinar', flag: '🇰🇼', defaultRate: 0.308 },
  'QAR': { name: 'Qatari Riyal', flag: '🇶🇦', defaultRate: 3.64 }
} as const;

export const DEFAULT_RATES = Object.entries(CURRENCIES).reduce((acc, [code, { defaultRate }]) => {
  acc[code] = defaultRate;
  return acc;
}, {} as Record<string, number>);