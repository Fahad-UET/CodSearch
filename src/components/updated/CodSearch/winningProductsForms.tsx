import React from 'react';
import { Globe, Users, Store, DollarSign } from 'lucide-react';
import { TRANSLATIONS, type Language } from '../CodSearch/translations';
import { COUNTRIES_BY_REGION_TRANSLATIONS } from '../CodSearch/data';
import { PROBLEMS_BY_CATEGORY } from '../CodSearch/data1';

interface FormData {
  country: string;
  audience: string;
  problemCategory: string;
  problem: string;
  budget: string;
  category: string;
  niche: string;
  season: string;
  customCategory: string;
  customNiche: string;
  customSeason: string;
  customCountry: string;
  similarProduct: string;
  similarProductUrl: string;
  additionalDetails: string;
  customProblemCategory: string;
  customProblem: string;
}

interface Props {
  language: Language;
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

export default function WinningProductsForm({ language, formData, onChange }: Props) {
  const [showTranslations, setShowTranslations] = React.useState(false);

  // Get all categories from all languages
  const allCategories = React.useMemo(() => {
    const categories = {
      fr: Object.keys(PROBLEMS_BY_CATEGORY.fr),
      en: Object.keys(PROBLEMS_BY_CATEGORY.en),
      ar: Object.keys(PROBLEMS_BY_CATEGORY.ar),
    };
    return categories;
  }, []);

  // Get problems for selected category in all languages
  const getProblemsForCategory = (category: string) => {
    if (!category) return { fr: [], en: [], ar: [] };

    // Find corresponding categories in other languages
    const categoryIndex = allCategories[language].indexOf(category);

    return {
      fr: PROBLEMS_BY_CATEGORY.fr[allCategories.fr[categoryIndex]] || [],
      en: PROBLEMS_BY_CATEGORY.en[allCategories.en[categoryIndex]] || [],
      ar: PROBLEMS_BY_CATEGORY.ar[allCategories.ar[categoryIndex]] || [],
    };
  };

  const problems = formData.problemCategory
    ? getProblemsForCategory(formData.problemCategory)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Country Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {TRANSLATIONS[language].labels.targetCountry}
          <span className="text-red-500" title="Required field">
            *
          </span>
        </label>
        <select
          value={formData.country}
          onChange={e => onChange({ country: e.target.value })}
          className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] ${
            !formData.country ? 'border-red-300' : 'border-gray-200'
          }`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <option value="">{TRANSLATIONS[language].placeholders.selectCountry}</option>
          {Object.entries(COUNTRIES_BY_REGION_TRANSLATIONS[language]).map(
            ([region, { label, countries }]) => (
              <optgroup key={region} label={label}>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </optgroup>
            )
          )}
          <option value="custom">{TRANSLATIONS[language].buttons.other}</option>
        </select>
        {formData.country === 'custom' && (
          <input
            type="text"
            value={formData.customCountry}
            onChange={e => onChange({ customCountry: e.target.value })}
            className="w-full mt-2 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
            placeholder={TRANSLATIONS[language].placeholders.customCountry}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        )}
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
          <Users className="w-4 h-4" />
          {TRANSLATIONS[language].labels.targetAudience}
        </label>
        <select
          value={formData.audience}
          onChange={e => onChange({ audience: e.target.value })}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <option value="">{TRANSLATIONS[language].placeholders.selectAudience}</option>
          {language === 'ar' ? (
            <>
              <option value="men">رجال</option>
              <option value="women">نساء</option>
              <option value="children">أطفال</option>
              <option value="all">الجميع</option>
            </>
          ) : language === 'fr' ? (
            <>
              <option value="men">Hommes</option>
              <option value="women">Femmes</option>
              <option value="children">Enfants</option>
              <option value="all">Tous</option>
            </>
          ) : (
            <>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="children">Children</option>
              <option value="all">All</option>
            </>
          )}
        </select>
      </div>

      {/* Problem Category with Translations */}
      <div className="space-y-2 md:col-span-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {TRANSLATIONS[language].labels.problemCategory}
          </label>
          <button
            type="button"
            onClick={() => setShowTranslations(!showTranslations)}
            className="text-sm text-[#5D1C83] hover:text-[#4D0C73]"
          >
            {showTranslations ? 'Hide Translations' : 'Show Translations'}
          </button>
        </div>

        <select
          value={formData.problemCategory}
          onChange={e => {
            onChange({
              problemCategory: e.target.value,
              problem: '', // Reset specific problem when category changes
            });
          }}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        >
          <option value="">{TRANSLATIONS[language].placeholders.selectProblem}</option>
          <option value="custom">{TRANSLATIONS[language].buttons.other}</option>
          {allCategories[language].map((category, index) => (
            <option key={category} value={category}>
              {category}
              {showTranslations &&
                ` | ${language !== 'en' ? allCategories.en[index] : allCategories.fr[index]} | ${
                  language !== 'ar' ? allCategories.ar[index] : ''
                }`}
            </option>
          ))}
          {allCategories[language]
            .filter(category => category.toLowerCase().includes('libido'))
            .map((category, index) => (
              <option key={category} value={category}>
                {category}
                {showTranslations &&
                  ` | ${language !== 'en' ? allCategories.en[index] : allCategories.fr[index]} | ${
                    language !== 'ar' ? allCategories.ar[index] : ''
                  }`}
              </option>
            ))}
        </select>

        {/* Specific Problem with Translations */}
        {formData.problemCategory && formData.problemCategory !== 'custom' && problems && (
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {TRANSLATIONS[language].labels.specificProblem}
            </label>
            <select
              value={formData.problem}
              onChange={e => onChange({ problem: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              <option value="">{TRANSLATIONS[language].placeholders.selectSpecificProblem}</option>
              {problems[language].map((problem, index) => (
                <option key={problem} value={problem}>
                  {problem}
                  {showTranslations &&
                    ` | ${language !== 'en' ? problems.en[index] : problems.fr[index]} | ${
                      language !== 'ar' ? problems.ar[index] : ''
                    }`}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.problemCategory === 'custom' && (
          <div className="mt-4 space-y-4">
            <input
              type="text"
              value={formData.customProblemCategory || ''}
              onChange={e =>
                onChange({
                  customProblemCategory: e.target.value,
                  problem: '', // Reset specific problem when custom category changes
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              placeholder={
                language === 'ar'
                  ? 'أدخل فئة مشكلة مخصصة...'
                  : language === 'fr'
                  ? 'Entrez une catégorie de problème personnalisée...'
                  : 'Enter a custom problem category...'
              }
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <textarea
              value={formData.customProblem || ''}
              onChange={e => onChange({ customProblem: e.target.value })}
              className="w-full h-24 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] resize-none"
              placeholder={
                language === 'ar'
                  ? 'اشرح المشكلة المحددة التي تريد حلها...'
                  : language === 'fr'
                  ? 'Décrivez le problème spécifique que vous souhaitez résoudre...'
                  : 'Describe the specific problem you want to solve...'
              }
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>
        )}
      </div>

      {/* Additional Details */}
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Similar Product */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Store className="w-4 h-4" />
            {language === 'ar'
              ? 'منتج مماثل'
              : language === 'fr'
              ? 'Produit similaire'
              : 'Similar Product'}
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={formData.similarProduct || ''}
              onChange={e => onChange({ similarProduct: e.target.value })}
              placeholder={
                language === 'ar'
                  ? 'اسم المنتج المماثل...'
                  : language === 'fr'
                  ? 'Nom du produit similaire...'
                  : 'Similar product name...'
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
            <input
              type="url"
              value={formData.similarProductUrl || ''}
              onChange={e => onChange({ similarProductUrl: e.target.value })}
              placeholder={
                language === 'ar'
                  ? 'رابط المنتج (اختياري)...'
                  : language === 'fr'
                  ? 'URL du produit (optionnel)...'
                  : 'Product URL (optional)...'
              }
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
            <Store className="w-4 h-4" />
            {language === 'ar'
              ? 'معلومات إضافية وتفاصيل'
              : language === 'fr'
              ? 'Informations et détails supplémentaires'
              : 'Additional Information & Details'}
          </label>
          <textarea
            value={formData.additionalDetails || ''}
            onChange={e => onChange({ additionalDetails: e.target.value })}
            placeholder={
              language === 'ar'
                ? 'أضف أي معلومات إضافية أو متطلبات خاصة تتعلق بالمنتج أو السوق المستهدف...'
                : language === 'fr'
                ? 'Ajoutez toute information supplémentaire ou exigence spécifique concernant le produit ou le marché cible...'
                : 'Add any additional information or specific requirements regarding the product or target market...'
            }
            className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] resize-none"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
      </div>
    </div>
  );
}
