import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations } from '../translations';

type Language = 'en' | 'ar';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
      t: (key: string) => {
        const { language } = get();
        const translation = translations[language]?.[key];
        if (!translation) {
          console.warn(`Missing translation for key: ${key} in language: ${language}`);
          return translations.en[key] || key;
        }
        return translation;
      }
    }),
    {
      name: 'language-store',
      version: 1
    }
  )
);