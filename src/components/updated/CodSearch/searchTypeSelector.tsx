import { Search, Store } from 'lucide-react';
import type { Language } from '../CodSearch/translations';
import { TRANSLATIONS } from '../CodSearch/translations';

interface Props {
  language: Language;
  onSelect: (type: 'keywords' | 'winning') => void;
}

export default function SearchTypeSelector({ language, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        onClick={() => onSelect('keywords')}
        className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 hover:border-[#5D1C83]/30 transition-all group hover:shadow-xl"
      >
        <Search className="w-12 h-12 text-[#5D1C83] mb-4" />
        <h3 className="text-xl font-semibold text-[#5D1C83] mb-2">
          {TRANSLATIONS[language].productKeywords.title}
        </h3>
        <p className="text-gray-600">{TRANSLATIONS[language].productKeywords.description}</p>
      </button>

      <button
        onClick={() => onSelect('winning')}
        className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 hover:border-[#5D1C83]/30 transition-all group hover:shadow-xl"
      >
        <Store className="w-12 h-12 text-[#5D1C83] mb-4" />
        <h3 className="text-xl font-semibold text-[#5D1C83] mb-2">
          {TRANSLATIONS[language].winningProducts.title}
        </h3>
        <p className="text-gray-600">{TRANSLATIONS[language].winningProducts.description}</p>
      </button>
    </div>
  );
}
