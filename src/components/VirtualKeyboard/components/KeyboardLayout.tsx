import React, { useState } from 'react';
import { Language } from '../types';
import { KEYBOARD_THEMES, NUMBER_MAPPINGS, SPECIAL_CHARS, LANGUAGE_OPTIONS } from '../constants';

interface KeyboardLayoutProps {
  language: Language;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  className?: string;
}

export function KeyboardLayout({
  language,
  onKeyPress,
  onBackspace,
  onSpace,
  className = ''
}: KeyboardLayoutProps) {
  const theme = KEYBOARD_THEMES[language];
  const [isShift, setIsShift] = useState(false);
  const [useEasternNumbers, setUseEasternNumbers] = useState(language === 'ar');

  const numberRow = (language === 'ar' && useEasternNumbers)
    ? NUMBER_MAPPINGS.eastern
    : NUMBER_MAPPINGS.standard;

  const layouts = {
    ar: [
      numberRow,
      'ضصثقفغعهخحج'.split(''),
      'شسيبلاتنمكط'.split(''),
      'ئءؤرلاىةوزظ'.split('')
    ],
    en: [
      numberRow,
      'qwertyuiop'.split(''),
      'asdfghjkl'.split(''),
      'zxcvbnm'.split('')
    ],
    fr: [
      numberRow,
      'azertyuiop'.split(''),
      'qsdfghjklm'.split(''),
      'wxcvbn'.split('')
    ],
    es: [
      numberRow,
      'qwertyuiop'.split(''),
      'asdfghjklñ'.split(''),
      'zxcvbnm'.split('')
    ]
  };

  const keyRows = layouts[language] || layouts.en;
  const rows = isShift && language !== 'ar'
    ? keyRows.map(row => row.map(key => key.toUpperCase()))
    : keyRows;

  const getKeyRows = () => {
    return rows;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Controls Row */}
      <div className="flex justify-between items-center mb-2">
        {/* Language Selector */}
        <div className="flex gap-2">
          {LANGUAGE_OPTIONS.map(lang => (
            <button
              key={lang.code}
              onClick={() => onKeyPress(lang.code)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                language === lang.code
                  ? `bg-${theme.bg} text-${theme.text}`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Number Type Toggle for Arabic */}
        {language === 'ar' && (
          <button
            onClick={() => setUseEasternNumbers(!useEasternNumbers)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              useEasternNumbers
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {useEasternNumbers ? '١٢٣' : '123'}
          </button>
        )}
      </div>

      {/* Number Row */}
      <div className="flex gap-1">
        {getKeyRows()[0].map(key => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className={`flex-1 h-12 rounded-lg bg-gradient-to-b ${theme.bg} ${theme.border}
              shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_white]
              hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_white]
              active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
              active:translate-y-0.5 transition-all duration-150
              text-lg font-medium ${language === 'ar' ? 'font-arabic' : ''}`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Letter Rows */}
      {getKeyRows().slice(1).map((row, i) => (
        <div key={i} className={`flex gap-1 ${i === 1 ? 'ml-4' : i === 2 ? 'ml-6' : ''}`}>
          {row.map(key => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`flex-1 h-12 rounded-lg bg-gradient-to-b ${theme.bg} ${theme.border}
                shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_white]
                hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_white]
                active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
                active:translate-y-0.5 transition-all duration-150
                text-lg font-medium ${language === 'ar' ? 'font-arabic' : ''}`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}

      {/* Special Characters Row */}
      <div className="flex gap-1">
        {SPECIAL_CHARS.map(char => (
          <button
            key={char}
            onClick={() => onKeyPress(char)}
            className={`flex-1 h-12 rounded-lg bg-gradient-to-b ${theme.bg} ${theme.border}
              shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_white]
              hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_white]
              active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
              active:translate-y-0.5 transition-all duration-150
              text-lg font-medium`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Control Keys Row */}
      <div className="flex gap-1">
        <button
          onClick={() => setIsShift(!isShift)}
          className={`w-20 h-12 rounded-lg bg-gradient-to-b from-gray-100 to-gray-200
            hover:from-gray-200 hover:to-gray-300 border border-gray-200
            shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_white]
            hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_white]
            active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
            active:translate-y-0.5 transition-all duration-150
            ${isShift ? 'bg-purple-100 text-purple-700' : ''}`}
        >
          ⇧
        </button>
        <button
          onClick={onSpace}
          className={`flex-1 h-12 rounded-lg bg-gradient-to-b ${theme.bg} ${theme.border}
            shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_white]
            hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_white]
            active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
            active:translate-y-0.5 transition-all duration-150`}
        >
          {language === 'ar' ? 'مسافة' : 'Space'}
        </button>
        <button
          onClick={onBackspace}
          className="w-20 h-12 rounded-lg bg-gradient-to-b from-red-100 to-red-200
            hover:from-red-200 hover:to-red-300 border border-red-200
            shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_white]
            hover:shadow-[0_4px_8px_rgba(0,0,0,0.1),inset_0_1px_0_white]
            active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]
            active:translate-y-0.5 transition-all duration-150"
        >
          ←
        </button>
      </div>
    </div>
  );
}