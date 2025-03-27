import type { Language } from '../CodSearch/translations';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({ language, onLanguageChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onLanguageChange('en')}
        className={`px-3 py-1.5 rounded-lg transition-all ${
          language === 'en' ? 'bg-white text-[#5D1C83]' : 'text-white/80 hover:bg-white/10'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => onLanguageChange('fr')}
        className={`px-3 py-1.5 rounded-lg transition-all ${
          language === 'fr' ? 'bg-white text-[#5D1C83]' : 'text-white/80 hover:bg-white/10'
        }`}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => onLanguageChange('ar')}
        className={`px-3 py-1.5 rounded-lg transition-all ${
          language === 'ar' ? 'bg-white text-[#5D1C83]' : 'text-white/80 hover:bg-white/10'
        }`}
      >
        🇸🇦 عربي
      </button>
    </div>
  );
}
