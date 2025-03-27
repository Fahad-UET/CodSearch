export const API_CONFIG = {
  baseUrl: import.meta.env.VITE_COD_NETWORK_API_URL,
  defaultCurrency: 'USD',
  supportedCountries: {
    SAR: { name: 'Saudi Arabia', currency: 'SAR', continent: 'GCC' },
    AED: { name: 'UAE', currency: 'AED', continent: 'GCC' },
    BHD: { name: 'Bahrain', currency: 'BHD', continent: 'GCC' },
    OMR: { name: 'Oman', currency: 'OMR', continent: 'GCC' },
    KWD: { name: 'Kuwait', currency: 'KWD', continent: 'GCC' },
    QAR: { name: 'Qatar', currency: 'QAR', continent: 'GCC' },
    EUR: { name: 'Europe', currency: 'EUR', continent: 'Europe' },
    MAD: { name: 'Morocco', currency: 'MAD', continent: 'Africa' },
    XOF: { name: 'West Africa', currency: 'XOF', continent: 'Africa' },
    XAF: { name: 'Central Africa', currency: 'XAF', continent: 'Africa' },
    DA: { name: 'Algeria', currency: 'DA', continent: 'Africa' },
    COP: { name: 'Colombia', currency: 'COP', continent: 'LATAM' },
    PAB: { name: 'Panama', currency: 'PAB', continent: 'LATAM' },
  },
  continents: {
    GCC: 'Gulf Countries',
    Europe: 'Europe',
    Africa: 'Africa',
    LATAM: 'Latin America',
  },
  defaultRates: {
    SAR: 3.75,
    AED: 3.67,
    BHD: 0.376,
    OMR: 0.385,
    KWD: 0.308,
    QAR: 3.64,
    EUR: 0.85,
    MAD: 9.89,
    XOF: 655.96,
    XAF: 655.96,
    DA: 137.72,
    COP: 4000,
    PAB: 1,
  },
};
