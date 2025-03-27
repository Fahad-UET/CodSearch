// Continent definitions
export const CONTINENTS = {
  ASIA: 'Asia',
  AFRICA: 'Africa',
  EUROPE: 'Europe',
  LATAM: 'Latin America',
} as const;

export interface Country {
  name: string,
  currency: string,
  continent: string,
  rate: number,
  flag: string,
}

export interface Countries {
  [key: string]: Country;
}
export const NORTH_AFRICA_COUNTRIES: Countries = {
  MAR: {
    name: 'Morocco',
    currency: 'DH',
    continent: CONTINENTS.AFRICA,
    rate: 10.36,
    flag: 'https://flagcdn.com/w320/ma.png',
  },
  DZA: {
    name: 'Algeria',
    currency: 'DA',
    continent: CONTINENTS.AFRICA,
    rate: 136.5,
    flag: 'https://flagcdn.com/w320/dz.png',
  },
  TUN: {
    name: 'Tunisia',
    currency: 'DT',
    continent: CONTINENTS.AFRICA,
    rate: 3.15,
    flag: 'https://flagcdn.com/w320/tn.png',
  },
};
// Country definitions grouped by continent
export const COUNTRIES: Countries = {
  // Asia (GCC)
  KSA: {
    name: 'Saudi Arabia',
    currency: 'SAR',
    continent: CONTINENTS.ASIA,
    rate: 3.75,
    flag: 'https://flagcdn.com/w320/sa.png',
  },
  UAE: {
    name: 'Émirats arabes unis',
    currency: 'AED',
    continent: CONTINENTS.ASIA,
    rate: 3.67,
    flag: 'https://flagcdn.com/w320/ae.png',
  },
  BHR: {
    name: 'Bahrain',
    currency: 'BHD',
    continent: CONTINENTS.ASIA,
    rate: 0.376,
    flag: 'https://flagcdn.com/w320/bh.png',
  },
  OMN: {
    name: 'Oman',
    currency: 'OMR',
    continent: CONTINENTS.ASIA,
    rate: 0.385,
    flag: 'https://flagcdn.com/w320/om.png',
  },
  KWT: {
    name: 'Kuwait',
    currency: 'KWD',
    continent: CONTINENTS.ASIA,
    rate: 0.308,
    flag: 'https://flagcdn.com/w320/kw.png',
  },
  QTR: {
    name: 'Qatar',
    currency: 'QAR',
    continent: CONTINENTS.ASIA,
    rate: 3.64,
    flag: 'https://flagcdn.com/w320/qa.png',
  },

  // Africa
  MAR: {
    name: 'Maroc',
    currency: 'MAD',
    continent: CONTINENTS.AFRICA,
    rate: 9.89,
    flag: 'https://flagcdn.com/w320/ma.png',
  },
  CIV: {
    name: "Côte d'Ivoire",
    currency: 'XOF',
    continent: CONTINENTS.AFRICA,
    rate: 655.96,
    flag: 'https://flagcdn.com/w320/ci.png',
  },
  SEN: {
    name: 'Senegal',
    currency: 'XOF',
    continent: CONTINENTS.AFRICA,
    rate: 655.96,
    flag: 'https://flagcdn.com/w320/sn.png',
  },
  BFA: {
    name: 'Burkina Faso',
    currency: 'XOF',
    continent: CONTINENTS.AFRICA,
    rate: 655.96,
    flag: 'https://flagcdn.com/w320/bf.png',
  },
  MLI: {
    name: 'Mali',
    currency: 'XOF',
    continent: CONTINENTS.AFRICA,
    rate: 655.96,
    flag: 'https://flagcdn.com/w320/ml.png',
  },
  GIN: {
    name: 'Guinée Conakry',
    currency: 'GNF',
    continent: CONTINENTS.AFRICA,
    rate: 8500,
    flag: 'https://flagcdn.com/w320/gn.png',
  },
  GAB: {
    name: 'Gabon',
    currency: 'XAF',
    continent: CONTINENTS.AFRICA,
    rate: 655.96,
    flag: 'https://flagcdn.com/w320/ga.png',
  },
  COG: {
    name: 'Congo',
    currency: 'XAF',
    continent: CONTINENTS.AFRICA,
    rate: 655.96,
    flag: 'https://flagcdn.com/w320/cg.png',
  },
  CMR: {
    name: 'Cameroun',
    currency: 'XAF',
    continent: CONTINENTS.AFRICA,
    rate: 655.96,
    flag: 'https://flagcdn.com/w320/cm.png',
  },

  // Europe
  ESP: {
    name: 'Spain',
    currency: 'EUR',
    continent: CONTINENTS.EUROPE,
    rate: 0.85,
    flag: 'https://flagcdn.com/w320/es.png',
  },
  PRT: {
    name: 'Portugal',
    currency: 'EUR',
    continent: CONTINENTS.EUROPE,
    rate: 0.85,
    flag: 'https://flagcdn.com/w320/pt.png',
  },
  POL: {
    name: 'Poland',
    currency: 'PLN',
    continent: CONTINENTS.EUROPE,
    rate: 3.95,
    flag: 'https://flagcdn.com/w320/pl.png',
  },
  CZE: {
    name: 'Czech Republic',
    currency: 'CZK',
    continent: CONTINENTS.EUROPE,
    rate: 22.5,
    flag: 'https://flagcdn.com/w320/cz.png',
  },
  HUN: {
    name: 'Hungary',
    currency: 'HUF',
    continent: CONTINENTS.EUROPE,
    rate: 350.5,
    flag: 'https://flagcdn.com/w320/hu.png',
  },
  SVK: {
    name: 'Slovakia',
    currency: 'EUR',
    continent: CONTINENTS.EUROPE,
    rate: 0.85,
    flag: 'https://flagcdn.com/w320/sk.png',
  },
  ROU: {
    name: 'Romania',
    currency: 'RON',
    continent: CONTINENTS.EUROPE,
    rate: 4.2,
    flag: 'https://flagcdn.com/w320/ro.png',
  },
  LTU: {
    name: 'Lithuania',
    currency: 'EUR',
    continent: CONTINENTS.EUROPE,
    rate: 0.85,
    flag: 'https://flagcdn.com/w320/lt.png',
  },
  SVN: {
    name: 'Slovenia',
    currency: 'EUR',
    continent: CONTINENTS.EUROPE,
    rate: 0.85,
    flag: 'https://flagcdn.com/w320/si.png',
  },
  HRV: {
    name: 'Croatia',
    currency: 'EUR',
    continent: CONTINENTS.EUROPE,
    rate: 0.85,
    flag: 'https://flagcdn.com/w320/hr.png',
  },

  // Latin America
  COL: {
    name: 'Colombia',
    currency: 'COP',
    continent: CONTINENTS.LATAM,
    rate: 4000,
    flag: 'https://flagcdn.com/w320/co.png',
  },
  PAN: {
    name: 'Panama',
    currency: 'USD',
    continent: CONTINENTS.LATAM,
    rate: 1,
    flag: 'https://flagcdn.com/w320/pa.png',
  },
};

export const getFlagUrl = (countryCode: string) =>
  `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;

// Default prices by country
export const countriesDefaultList = [
  {
    name: 'Saudi Arabia',
    key: 'KSA',
    currency: 'SAR',
    default: [
      { value: 199, id: 1 },
      { value: 299, id: 2 },
      { value: 399, id: 3 },
    ],
  },
  {
    name: 'Émirats arabes unis',
    key: 'UAE',
    currency: 'AED',
    default: [
      { value: 199, id: 1 },
      { value: 299, id: 2 },
      { value: 399, id: 3 },
    ],
  },
  {
    name: 'Bahrain',
    key: 'BHR',
    currency: 'BHD',
    default: [
      { value: 19, id: 1 },
      { value: 29, id: 2 },
      { value: 39, id: 3 },
    ],
  },
  {
    name: 'Oman',
    key: 'OMN',
    currency: 'OMR',
    default: [
      { value: 19, id: 1 },
      { value: 29, id: 2 },
      { value: 39, id: 3 },
    ],
  },
  {
    name: 'Kuwait',
    key: 'KWT',
    currency: 'KWD',
    default: [
      { value: 15, id: 1 },
      { value: 19, id: 2 },
      { value: 29, id: 3 },
    ],
  },
  {
    name: 'Qatar',
    key: 'QTR',
    currency: 'QAR',
    default: [
      { value: 199, id: 1 },
      { value: 299, id: 2 },
      { value: 399, id: 3 },
    ],
  },
  {
    name: 'Spain',
    key: 'ESP',
    currency: 'EUR',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Portugal',
    key: 'PRT',
    currency: 'EUR',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Poland',
    key: 'POL',
    currency: 'PLN',
    default: [
      { value: 199, id: 1 },
      { value: 299, id: 2 },
      { value: 399, id: 3 },
    ],
  },
  {
    name: 'Czech Republic',
    key: 'CZE',
    currency: 'CZK',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Hungary',
    key: 'HUN',
    currency: 'HUF',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Slovakia',
    key: 'SVK',
    currency: 'EUR',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Romania',
    key: 'ROU',
    currency: 'RON',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Lithuania',
    key: 'LTU',
    currency: 'EUR',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Slovenia',
    key: 'SVN',
    currency: 'EUR',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Croatia',
    key: 'HRV',
    currency: 'EUR',
    default: [
      { value: 49, id: 1 },
      { value: 79, id: 2 },
      { value: 99, id: 3 },
    ],
  },
  {
    name: 'Colombia',
    key: 'COL',
    currency: 'COP',
    default: [
      { value: 19, id: 1 },
      { value: 29, id: 2 },
      { value: 39, id: 3 },
    ],
  },
  {
    name: 'Panama',
    key: 'PAN',
    currency: 'USD',
    default: [
      { value: 19, id: 1 },
      { value: 29, id: 2 },
      { value: 39, id: 3 },
    ],
  },
  {
    name: 'Morocco',
    key: 'MAR',
    currency: 'MAD',
    default: [
      { value: 199, id: 1 },
      { value: 299, id: 2 },
      { value: 399, id: 3 },
    ],
  },
  {
    name: 'Algeria',
    key: 'DZA',
    currency: 'DZD',
    default: [
      { value: 199, id: 1 },
      { value: 273.0, id: 2 },
      { value: 409.5, id: 3 },
    ],
  },
  {
    name: 'Tunisia',
    key: 'TUN',
    currency: 'TND',
    default: [
      { value: 199, id: 1 },
      { value: 299, id: 2 },
      { value: 399, id: 3 },
    ],
  },
];

// Default exchange rates
export const DEFAULT_RATES = Object.entries(COUNTRIES).reduce((acc, [code, { currency }]) => {
  acc[currency] = COUNTRIES[code as keyof typeof COUNTRIES].rate;
  return acc;
}, {} as Record<string, number>);
