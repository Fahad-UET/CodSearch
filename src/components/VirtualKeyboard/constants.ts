import { KeyMapping } from './types';

export const NUMBER_MAPPINGS = {
  standard: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  eastern: ['١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '٠']
};

export const SPECIAL_CHARS = ['@', '.', ',', '!', '?', ':', ';', '"', '\'', '(', ')', '-', '_', '/', '\\'];

export const KEYBOARD_THEMES = {
  ar: {
    bg: 'from-purple-100 to-purple-200',
    hover: 'hover:from-purple-200 hover:to-purple-300',
    border: 'border-purple-200',
    hoverBorder: 'hover:border-purple-300',
    text: 'text-gray-900'
  },
  en: {
    bg: 'from-blue-100 to-blue-200',
    hover: 'hover:from-blue-200 hover:to-blue-300',
    border: 'border-blue-200',
    hoverBorder: 'hover:border-blue-300',
    text: 'text-gray-900'
  },
  fr: {
    bg: 'from-indigo-100 to-indigo-200',
    hover: 'hover:from-indigo-200 hover:to-indigo-300',
    border: 'border-indigo-200',
    hoverBorder: 'hover:border-indigo-300',
    text: 'text-gray-900'
  },
  es: {
    bg: 'from-teal-100 to-teal-200',
    hover: 'hover:from-teal-200 hover:to-teal-300',
    border: 'border-teal-200',
    hoverBorder: 'hover:border-teal-300',
    text: 'text-gray-900'
  }
};

export const LANGUAGE_OPTIONS = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' }
] as const;

export const ARABIC_MAPPING: KeyMapping = {
  // Single character mappings
  q: 'ض', s: 'ص', e: 'ث', r: 'ق', t: 'ف', y: 'غ', u: 'ع', i: 'ه', o: 'خ', 7: 'ح', 
  a: 'ش', d: 'ي', f: 'ب', g: 'ل', h: 'ا', j: 'ت', k: 'ن', l: 'م', ';': 'ك',
  z: 'ئ', x: 'ء', c: 'ؤ', v: 'ر', b: 'لا', n: 'ى', m: 'ة', ',': 'و', '.': 'ز', '/': 'ظ',

  // Special characters and diacritics
  '[': 'ج',    // jeem
  ']': 'د',    // daal
  '\\': 'ذ',   // thaal
  "'": 'ط',    // Taa

  // Diacritics
  '1': 'َ',    // fatha
  '2': 'ً',    // tanween fatha
  '3': 'ُ',    // damma
  '4': 'ٌ',    // tanween damma
  '5': 'ِ',    // kasra
  '6': 'ٍ',    // tanween kasra
  '0': 'ّ',    // shadda
  '8': 'ْ',    // sukun
};

export const CURRENCY_SYMBOLS = [
  { symbol: '$', label: 'USD' },
  { symbol: '€', label: 'EUR' },
  { symbol: '£', label: 'GBP' },
  { symbol: '﷼', label: 'SAR' },
  { symbol: 'د.إ', label: 'AED' },
  { symbol: 'د.ك', label: 'KWD' }
];

export const EMOJI_SYMBOLS = [
  '😊', '👍', '🔥', '⭐', '💯', '✨', '🎉', '💪', '🎁', '💎'
];

export const KEYBOARD_LAYOUTS = {
  arabic: {
    main: [
      ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩', '،', '؛', '؟', 'Suppr'],
      ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'خ', 'ج', 'ت', 'ب'],
      ['ص', 'ض', 'ط', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
      ['ذ', 'د', 'ر', 'ز', 'س', 'ش'],
      ['؟', '!', '،', '.', '-', 'Enter']
    ]
  }
};