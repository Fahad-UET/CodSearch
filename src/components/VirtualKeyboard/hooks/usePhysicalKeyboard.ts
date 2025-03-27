import { useEffect, useCallback } from 'react';

type LayoutType = 'arabic' | 'french' | 'english' | 'spanish';

const LAYOUT_MAPPINGS = {
  arabic: {
    'a': 'ا',
    'b': 'ب',
    't': 'ت',
    'j': 'ج',
    'h': 'ح',
    'x': 'خ',
    'd': 'د',
    'r': 'ر',
    'z': 'ز',
    's': 'س',
    'c': 'ش',
    'S': 'ص',
    'D': 'ض',
    'T': 'ط',
    'g': 'ع',
    'G': 'غ',
    'f': 'ف',
    'q': 'ق',
    'k': 'ك',
    'l': 'ل',
    'm': 'م',
    'n': 'ن',
    'w': 'و',
    'y': 'ي',
    '0': '٠',
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    ',': '،',
    ';': '؛',
    '?': '؟',
    '.': '.',
    '-': '-',
    ' ': ' '
  },
  french: {}, // Default AZERTY layout
  english: {}, // Default QWERTY layout
  spanish: {
    "'": 'ñ',
    '`': 'ñ',
    '{': 'á',
    '[': 'á',
    '}': 'é',
    ']': 'é',
    '\\': 'í',
    '|': 'ú',
    ';': 'ó',
    ':': 'ü',
  }
};

export function usePhysicalKeyboard(
  layout: LayoutType,
  onKeyPress: (key: string) => void
) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't handle if user is typing in an input or textarea
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    let key = event.key;

    // Handle special keys
    if (event.key === 'Enter') {
      key = '\n';
    } else if (event.key === 'Space' || event.key === ' ') {
      key = ' ';
    }

    // Map the key based on selected layout
    const mappings = LAYOUT_MAPPINGS[layout];
    const mappedKey = mappings[key.toLowerCase()] || key;

    onKeyPress(mappedKey);
  }, [layout, onKeyPress]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}