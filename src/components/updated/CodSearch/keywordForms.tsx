import type { Language } from '../CodSearch/translations';
import { TRANSLATIONS } from '../CodSearch/translations';

interface Props {
  language: Language;
  productName: string;
  onProductNameChange: (name: string) => void;
}

export default function KeywordsForm({ language, productName, onProductNameChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {TRANSLATIONS[language].labels.productName}
        </label>
        <input
          type="text"
          value={productName}
          onChange={e => onProductNameChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
          placeholder={TRANSLATIONS[language].placeholders.enterProduct}
        />
      </div>
    </div>
  );
}
