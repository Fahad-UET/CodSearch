export type KeyboardLayout = 'ar' | 'es' | 'fr' | 'en';

export const keyboardMappings: Record<KeyboardLayout, Record<string, string>> = {
  ar: {
    // Arabic mapping (unchanged)
    a: 'ا',
    b: 'ب',
    t: 'ت',
    'ShiftLeft+t': 'ث',
    j: 'ج',
    H: 'ح',
    'ShiftLeft+H': 'خ',
    d: 'د',
    'ShiftLeft+d': 'ذ',
    r: 'ر',
    z: 'ز',
    s: 'س',
    'ShiftLeft+s': 'ش',
    S: 'ص',
    D: 'ض',
    T: 'ط',
    Z: 'ظ',
    g: 'ع',
    'ShiftLeft+g': 'غ',
    f: 'ف',
    q: 'ق',
    k: 'ك',
    l: 'ل',
    m: 'م',
    n: 'ن',
    h: 'ه',
    w: 'و',
    y: 'ي',
  },
  en: {
    // QWERTY layout
    q: 'q',
    w: 'w',
    e: 'e',
    r: 'r',
    t: 't',
    y: 'y',
    u: 'u',
    i: 'i',
    o: 'o',
    p: 'p',
    a: 'a',
    s: 's',
    d: 'd',
    f: 'f',
    g: 'g',
    h: 'h',
    j: 'j',
    k: 'k',
    l: 'l',
    z: 'z',
    x: 'x',
    c: 'c',
    v: 'v',
    b: 'b',
    n: 'n',
    m: 'm',
    'ShiftLeft+1': '!',
    'ShiftLeft+2': '@',
    'ShiftLeft+3': '#',
    'ShiftLeft+4': '$',
    'ShiftLeft+5': '%',
    'ShiftLeft+6': '^',
    'ShiftLeft+7': '&',
    'ShiftLeft+8': '*',
    'ShiftLeft+9': '(',
    'ShiftLeft+0': ')',
    ',': ',',
    '.': '.',
    '/': '/',
    'ShiftLeft+,': '<',
    'ShiftLeft+.': '>',
    'ShiftLeft+/': '?',
  },
  fr: {
    // AZERTY layout
    a: 'q',
    q: 'a',
    z: 'w',
    w: 'z',
    e: 'e',
    r: 'r',
    t: 't',
    y: 'y',
    u: 'u',
    i: 'i',
    o: 'o',
    p: 'p',
    s: 's',
    d: 'd',
    f: 'f',
    g: 'g',
    h: 'h',
    j: 'j',
    k: 'k',
    l: 'l',
    m: ',',
    'ShiftLeft+m': 'M',
    'ShiftLeft+2': 'é',
    'ShiftLeft+7': 'è',
    'ShiftLeft+9': 'ç',
    'ShiftLeft+0': 'à',
    'ShiftLeft+4': "'",
    'ShiftLeft+3': '"',
    'ShiftLeft+1': '&',
    ',': ',',
    ';': '.',
    ':': '/',
    '!': '§',
    'ShiftLeft+,': '?',
    'ShiftLeft+;': ':',
    'ShiftLeft+:': '/',
  },
  es: {
    // Spanish layout (QWERTY based)
    q: 'q',
    w: 'w',
    e: 'e',
    r: 'r',
    t: 't',
    y: 'y',
    u: 'u',
    i: 'i',
    o: 'o',
    p: 'p',
    a: 'a',
    s: 's',
    d: 'd',
    f: 'f',
    g: 'g',
    h: 'h',
    j: 'j',
    k: 'k',
    l: 'l',
    ñ: 'ñ',
    z: 'z',
    x: 'x',
    c: 'c',
    v: 'v',
    b: 'b',
    n: 'n',
    m: 'm',
    'ShiftLeft+a': 'á',
    'ShiftLeft+e': 'é',
    'ShiftLeft+i': 'í',
    'ShiftLeft+o': 'ó',
    'ShiftLeft+u': 'ú',
    'ShiftLeft+n': 'ñ',
    'ShiftLeft+?': '¿',
    'ShiftLeft+1': '¡',
  },
};

export function getKeyMapping(
  layout: KeyboardLayout,
  key: string,
  shiftKey: boolean
): string | undefined {
  const mapping = keyboardMappings[layout];
  const mappingKey = shiftKey ? `ShiftLeft+${key}` : key;
  return mapping[mappingKey] || mapping[key];
}
