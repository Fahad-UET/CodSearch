import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="h-9 px-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5"
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe size={16} />
      <span className="text-sm">{language === 'en' ? 'العربية' : 'English'}</span>
    </button>
  );
}