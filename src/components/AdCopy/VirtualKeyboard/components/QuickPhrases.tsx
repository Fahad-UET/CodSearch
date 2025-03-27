import React from 'react';
import { QUICK_PHRASES } from '../constants';

interface QuickPhrasesProps {
  language: 'en' | 'fr' | 'es' | 'ar';
  onPhraseSelect: (phrase: string) => void;
}

export const QuickPhrases: React.FC<QuickPhrasesProps> = ({ language, onPhraseSelect }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg mb-2">
      {QUICK_PHRASES[language].map((phrase, index) => (
        <button
          key={index}
          onClick={() => onPhraseSelect(phrase)}
          className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        >
          {phrase}
        </button>
      ))}
    </div>
  );
};