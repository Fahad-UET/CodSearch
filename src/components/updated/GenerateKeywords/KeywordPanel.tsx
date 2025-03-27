import React, { useState } from 'react';
import {
  Languages,
  Wand2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Globe,
  Bookmark,
  FolderPlus,
  X,
} from 'lucide-react';
import type { KeywordSet } from '../CodSearch/types';
import { LANGUAGES } from '../CodSearch/translations';
import SaveKeywordModal from '../CodSearch/saveKeywordModal';
import SavedKeywordsModal from '../CodSearch/savedKeywordModal';
import { useProductStore } from '@/store';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import Notification from '@/components/Notification';
import CreditsInformation from '@/components/credits/CreditsInformation';

const TRANSLATION_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
];

interface SimilarProductsProps {
  products: string[];
  onProductClick: (product: string) => void;
  onClose: () => void;
  dir?: 'rtl' | 'ltr';
}

function SimilarProducts({ products, onProductClick, onClose, dir = 'ltr' }: SimilarProductsProps) {
  return (
    <div className="ml-6 mt-2 space-y-2 border-l-2 border-[#5D1C83]/20 pl-4 animate-slide-up">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[#5D1C83]">Similar Products:</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-[#5D1C83]/10 rounded-lg transition-colors"
          title="Hide similar products"
        >
          <ChevronUp className="w-4 h-4 text-[#5D1C83]" />
        </button>
      </div>
      {products.map((product, index) => (
        <button
          key={index}
          onClick={() => onProductClick(product)}
          className="w-full px-4 py-2 text-left bg-[#5D1C83]/5 hover:bg-[#5D1C83]/10 rounded-lg transition-all text-sm"
          dir={dir}
        >
          {product}
        </button>
      ))}
    </div>
  );
}

interface Props {
  showKeywords: boolean;
  keywordSets: KeywordSet[];
  onKeywordClick: (keyword: string) => void;
  onGenerateSimilar: (product: string) => void;
  isGenerating: boolean;
  similarProducts: Record<string, string[]>;
  generatingProduct: string | null;
  isProduct?: boolean;
  setPrompt?: (prompt: string) => void;
  prompt: string;
  product: any;
}

export default function KeywordPanel({
  showKeywords,
  keywordSets,
  onKeywordClick,
  onGenerateSimilar,
  isGenerating,
  similarProducts,
  generatingProduct,
  isProduct,
  setPrompt,
  prompt,
  product,
}: Props) {
  const perspective = 1000;
  const rotateX = 10;
  const translateZ = 20;
  const [hiddenProducts, setHiddenProducts] = useState<Set<string>>(new Set());
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedLangTemp, setSelectedLangTemp] = useState<string | null>(null);
  const [translatedKeywords, setTranslatedKeywords] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentTranslationIndex, setCurrentTranslationIndex] = useState(0);
  const [totalTranslations, setTotalTranslations] = useState(0);
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>(
    () => {
      const saved = localStorage.getItem('product_translation_cache');
      return saved ? JSON.parse(saved) : {};
    }
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSavedKeywords, setShowSavedKeywords] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  if (!keywordSets.length) return null;

  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  const translateKeywords = async (targetLang: string) => {
    const credits = await getCredits(user?.uid, 'translateKeyword');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    setTranslationError(null);
    setSelectedLanguage(targetLang);
    setIsTranslating(true);
    setCurrentTranslationIndex(0);
    setTotalTranslations(0);

    // If we have cached translations for this language, use them
    if (translationCache[`${localStorage.getItem('generatedKeywordName')}_${targetLang}`]) {
      setTranslatedKeywords(
        translationCache[`${localStorage.getItem('generatedKeywordName')}_${targetLang}`]
      );
      setIsTranslating(false);
      return;
    }
    const translations: Record<string, string> = {};

    try {
      const total = keywordSets.reduce((acc, set) => {
        return acc + Object.values(set.keywords).reduce((sum, arr) => sum + arr.length, 0);
      }, 0);
      setTotalTranslations(total);

      if (total === 0) {
        throw new Error('No keywords to translate');
      }

      // Collect all keywords into a single list
      const allKeywords = keywordSets
        .flatMap(set => set.keywords)
        .flatMap(set => Object.values(set))
        .flat();

      // Format keywords for translation
      const keywordsText = allKeywords
        .map(keyword => keyword.trim())
        .filter(Boolean)
        .join('\n\n');

      // Add timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        throw new Error('Translation request timed out');
      }, 60000); // 60 second timeout

      const systemPrompt = `You are a professional translator specializing in product names and marketing content. 
      Translate the following list of products to ${
        targetLang === 'en'
          ? 'English'
          : TRANSLATION_LANGUAGES.find(l => l.code === targetLang)?.name
      }.
      
      Important rules:
      1. Preserve brand names exactly as they are
      2. Maintain the format "Product Name (Brand Name)"
      3. Keep any numbers or measurements in their original format
      4. Translate one product per line
      5. Ensure natural and culturally appropriate translations
      6. DO NOT add any explanations or additional text
      7. DO NOT number the translations
      
      Example:
      Input: "Hydrating Cream (CeraVe)"
      Output: "[Translated Product Name] (CeraVe)"`;

      // Send all keywords in a single request
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer sk-c727de8143e347bfb802cf62adbeb41f',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: keywordsText,
            },
          ],
          max_tokens: 2000,
          temperature: 0.3,
          stream: false,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Translation failed: ${response.statusText}`);
      }
      const data = await response.json();

      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response from translation service');
      }

      const translatedLines = data.choices[0].message.content
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

      if (translatedLines.length !== allKeywords.length) {
        console.warn('Translation length mismatch:', {
          original: allKeywords.length,
          translated: translatedLines.length,
        });
      }

      // Map translations back to original keywords
      allKeywords.forEach((keyword, index) => {
        const translation = translatedLines[index];
        if (translation && translation !== keyword) {
          setCurrentTranslationIndex(prev => prev + 1);
          translations[keyword] = translation;
        } else {
          // Keep original if translation is missing or identical
          translations[keyword] = keyword;
          setCurrentTranslationIndex(prev => prev + 1);
        }
      });

      // Save translations to cache
      setTranslationCache(prev => ({
        ...prev,
        [`${localStorage.getItem('generatedKeywordName')}_${targetLang}`]: translations,
      }));
      localStorage.setItem(
        'product_translation_cache',
        JSON.stringify({
          ...translationCache,
          [`${localStorage.getItem('generatedKeywordName')}_${targetLang}`]: translations,
        })
      );
      const result = await updateCredits(user?.uid, 'translateKeyword');
      setPackage(userPackage.plan, result.toString());
      setTranslatedKeywords(translations);
    } catch (error) {
      let errorMessage = 'Translation failed. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = 'Translation timed out. Please try again.';
      }

      setSelectedLanguage(null);
      setTranslatedKeywords({});
      setIsTranslating(false);
      setCurrentTranslationIndex(0);
      setTotalTranslations(0);
      setTranslationError(errorMessage);
    } finally {
      // Add a small delay before hiding the loading state
      setTimeout(() => {
        setIsTranslating(false);
        setCurrentTranslationIndex(0);
        setTotalTranslations(0);
        setTranslationError(null);
      }, 500);
    }
  };

  return (
    <div
      className={`mb-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden transition-all duration-300 ${
        showKeywords
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform -translate-y-4 pointer-events-none h-0'
      } perspective-${perspective} preserve-3d`}
    >
      {/* Loading state */}
      {isGenerating && (
        <div className="p-8 text-center">
          <div className="w-12 h-12 border-4 border-[#5D1C83] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#5D1C83] font-medium">Generating product suggestions...</p>
        </div>
      )}

      {/* Language selector */}
      <div className="p-4 border-b border-gray-100 bg-white/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              {isTranslating ? (
                <div className="flex flex-col gap-3">
                  <div className="relative overflow-hidden bg-white/95 backdrop-blur-sm rounded-lg border border-[#5D1C83]/20 shadow-lg">
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-6 h-6 border-3 border-[#5D1C83]/20 border-t-[#5D1C83] rounded-full animate-spin" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#5D1C83]">
                            Translating content...
                          </div>
                          <div className="text-xs text-gray-500">
                            {currentTranslationIndex} of {totalTranslations} items
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-[#5D1C83]">
                          {Math.round((currentTranslationIndex / totalTranslations) * 100)}%
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-gray-100">
                      <div
                        className="h-full bg-[#5D1C83] transition-all duration-300 ease-out relative overflow-hidden"
                        style={{
                          width: `${
                            totalTranslations
                              ? (currentTranslationIndex / totalTranslations) * 100
                              : 0
                          }%`,
                        }}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                          style={{ backgroundSize: '200% 100%' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-center animate-pulse">
                    Please wait while we translate your content...
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] transition-all"
                  disabled={isTranslating}
                >
                  <Globe className="w-4 h-4" />
                  {selectedLanguage ? (
                    <span className="flex items-center gap-2">
                      {TRANSLATION_LANGUAGES.find(l => l.code === selectedLanguage)?.flag}
                      {TRANSLATION_LANGUAGES.find(l => l.code === selectedLanguage)?.name}
                    </span>
                  ) : (
                    'Translate to...'
                  )}
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {/* Error message */}
              {translationError && (
                <div className="absolute top-full left-0 mt-2 w-full px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm animate-slide-up">
                  <div className="flex items-start gap-2">
                    <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{translationError}</p>
                  </div>
                  <button
                    onClick={() => setTranslationError(null)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {showLanguageSelector && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  {selectedLangTemp && (
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Selected Language:
                        </span>
                        <span className="flex items-center gap-2 text-[#5D1C83]">
                          {TRANSLATION_LANGUAGES.find(l => l.code === selectedLangTemp)?.flag}
                          {TRANSLATION_LANGUAGES.find(l => l.code === selectedLangTemp)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            translateKeywords(selectedLangTemp);
                            setShowLanguageSelector(false);
                            setSelectedLangTemp(null);
                          }}
                          className="flex-1 px-3 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] text-sm font-medium"
                        >
                          Start Translation
                        </button>
                        <button
                          onClick={() => setSelectedLangTemp(null)}
                          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {TRANSLATION_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLangTemp(lang.code);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                        selectedLangTemp === lang.code ? 'bg-purple-50 text-[#5D1C83]' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Keywords Button */}
            <button
              onClick={() => setShowSavedKeywords(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] transition-all"
            >
              <Bookmark className="w-4 h-4" />
              Saved Keywords
            </button>
          </div>
        </div>
      </div>
      {/* Keywords Section */}
      <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50/50 to-white">
        {!isGenerating && keywordSets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No keywords generated yet. Click "Generate Keywords" to start.</p>
          </div>
        )}
        {keywordSets.map(set => (
          <div
            key={set.language.code}
            className="space-y-3 transform hover:-translate-y-1 transition-transform duration-300"
          >
            <div className={`grid ${isProduct ? 'grid-cols-3' : 'grid-cols-2'} gap-6`}>
              {/* Worldwide Products */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex items-center gap-2">
                  <span>{set.language.flag}</span>
                  <span>
                    {isProduct
                      ? set.language.code === 'ar'
                        ? 'الاسم الرسمي للمنتج'
                        : set.language.code === 'fr'
                        ? 'Nom officiel du produit'
                        : 'Official Product Name'
                      : set.language.code === 'ar'
                      ? 'المنتجات العالمية'
                      : set.language.code === 'fr'
                      ? 'Produits Mondiaux'
                      : 'Worldwide Products'}
                  </span>
                </h3>
                <div className="space-y-2">
                  {set.keywords?.officialNames?.length > 0 ? (
                    set.keywords?.officialNames?.map((keyword, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            onClick={() => {
                              onKeywordClick(
                                selectedLanguage && translatedKeywords[keyword]
                                  ? translatedKeywords[keyword]
                                  : keyword
                              );
                              setPrompt(
                                selectedLanguage && translatedKeywords[keyword]
                                  ? translatedKeywords[keyword]
                                  : keyword
                              );
                            }}
                            className="flex-1 px-4 py-2.5 text-left bg-white hover:bg-[#5D1C83]/5 rounded-lg transition-all group"
                            dir={set.language.code === 'ar' ? 'rtl' : 'ltr'}
                          >
                            {selectedLanguage && translatedKeywords[keyword] ? (
                              <span className="text-[#5D1C83]">{translatedKeywords[keyword]}</span>
                            ) : (
                              keyword
                            )}
                          </div>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedKeyword(keyword);
                              setShowSaveModal(true);
                            }}
                            className="p-2 bg-white hover:bg-[#5D1C83]/10 rounded-lg transition-all group mr-2"
                            title="Save keyword"
                          >
                            <Bookmark className="w-4 h-4 text-[#5D1C83]" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onGenerateSimilar(keyword);
                            }}
                            className="p-2 bg-white hover:bg-[#5D1C83]/10 rounded-lg transition-all group"
                            title="Find similar products"
                          >
                            {similarProducts[keyword] && hiddenProducts.has(keyword) ? (
                              <div
                                onClick={e => {
                                  e.stopPropagation();
                                  setHiddenProducts(prev => {
                                    const next = new Set(prev);
                                    next.delete(keyword);
                                    return next;
                                  });
                                }}
                                className="p-1.5 text-[#5D1C83] hover:bg-[#5D1C83]/10 rounded-lg transition-all"
                                title="Show similar products"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            ) : (
                              <Wand2
                                className={`w-4 h-4 text-[#5D1C83] ${
                                  isGenerating && generatingProduct === keyword
                                    ? 'animate-spin'
                                    : ''
                                }`}
                              />
                            )}
                          </button>
                        </div>
                        {similarProducts[keyword] && !hiddenProducts.has(keyword) && (
                          <SimilarProducts
                            products={similarProducts[keyword]}
                            onProductClick={onKeywordClick}
                            onClose={() => setHiddenProducts(prev => new Set([...prev, keyword]))}
                            dir={set.language.code === 'ar' ? 'rtl' : 'ltr'}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No worldwide products found</p>
                  )}
                </div>
              </div>

              {/* Country-specific Products */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex items-center gap-2">
                  <span>{set.language.flag}</span>
                  <span>
                    {isProduct
                      ? set.language.code === 'ar'
                        ? 'الاختلاف الشائع'
                        : set.language.code === 'fr'
                        ? ' Variation courante'
                        : 'Common Variation'
                      : set.language.code === 'ar'
                      ? 'المنتجات المحلية'
                      : set.language.code === 'fr'
                      ? 'Produits Locaux'
                      : 'Local Products'}
                  </span>
                </h3>
                <div className="space-y-2">
                  {set.keywords?.commonVariations?.length > 0 ? (
                    set.keywords?.commonVariations?.map((keyword, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onKeywordClick(
                                selectedLanguage && translatedKeywords[keyword]
                                  ? translatedKeywords[keyword]
                                  : keyword
                              );
                              setPrompt(
                                selectedLanguage && translatedKeywords[keyword]
                                  ? translatedKeywords[keyword]
                                  : keyword
                              );
                            }}
                            className="flex-1 px-4 py-2.5 text-left bg-white hover:bg-[#5D1C83]/5 rounded-lg transition-all group"
                            dir={set.language.code === 'ar' ? 'rtl' : 'ltr'}
                          >
                            {selectedLanguage && translatedKeywords[keyword] ? (
                              <span className="text-[#5D1C83]">{translatedKeywords[keyword]}</span>
                            ) : (
                              keyword
                            )}
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedKeyword(keyword);
                              setShowSaveModal(true);
                            }}
                            className="p-2 bg-white hover:bg-[#5D1C83]/10 rounded-lg transition-all group mr-2"
                            title="Save keyword"
                          >
                            <Bookmark className="w-4 h-4 text-[#5D1C83]" />
                          </button>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onGenerateSimilar(keyword);
                            }}
                            className="p-2 bg-white hover:bg-[#5D1C83]/10 rounded-lg transition-all group"
                            title="Find similar products"
                          >
                            {similarProducts[keyword] && hiddenProducts.has(keyword) ? (
                              <div
                                onClick={e => {
                                  e.stopPropagation();
                                  setHiddenProducts(prev => {
                                    const next = new Set(prev);
                                    next.delete(keyword);
                                    return next;
                                  });
                                }}
                                className="p-1.5 text-[#5D1C83] hover:bg-[#5D1C83]/10 rounded-lg transition-all"
                                title="Show similar products"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            ) : (
                              <Wand2
                                className={`w-4 h-4 text-[#5D1C83] ${
                                  isGenerating && generatingProduct === keyword
                                    ? 'animate-spin'
                                    : ''
                                }`}
                              />
                            )}
                          </button>
                        </div>
                        {similarProducts[keyword] && !hiddenProducts.has(keyword) && (
                          <SimilarProducts
                            products={similarProducts[keyword]}
                            onProductClick={onKeywordClick}
                            onClose={() => setHiddenProducts(prev => new Set([...prev, keyword]))}
                            dir={set.language.code === 'ar' ? 'rtl' : 'ltr'}
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No local products found</p>
                  )}
                </div>
              </div>

              {/* Country-specific Products */}
              {isProduct && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm flex items-center gap-2">
                    <span>{set.language.flag}</span>
                    <span>
                      {set.language.code === 'ar'
                        ? 'العلامات التجارية الحالية'
                        : set.language.code === 'fr'
                        ? 'Marques existantes'
                        : 'Existing brands'}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {set.keywords?.existingBrands?.length > 0 ? (
                      set.keywords?.existingBrands?.map((keyword, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onKeywordClick(
                                  selectedLanguage && translatedKeywords[keyword]
                                    ? translatedKeywords[keyword]
                                    : keyword
                                );
                                setPrompt(
                                  selectedLanguage && translatedKeywords[keyword]
                                    ? translatedKeywords[keyword]
                                    : keyword
                                );
                              }}
                              className="flex-1 px-4 py-2.5 text-left bg-white hover:bg-[#5D1C83]/5 rounded-lg transition-all group"
                              dir={set.language.code === 'ar' ? 'rtl' : 'ltr'}
                            >
                              {selectedLanguage && translatedKeywords[keyword] ? (
                                <span className="text-[#5D1C83]">
                                  {translatedKeywords[keyword]}
                                </span>
                              ) : (
                                keyword
                              )}
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedKeyword(keyword);
                                setShowSaveModal(true);
                              }}
                              className="p-2 bg-white hover:bg-[#5D1C83]/10 rounded-lg transition-all group mr-2"
                              title="Save keyword"
                            >
                              <Bookmark className="w-4 h-4 text-[#5D1C83]" />
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onGenerateSimilar(keyword);
                              }}
                              className="p-2 bg-white hover:bg-[#5D1C83]/10 rounded-lg transition-all group"
                              title="Find similar products"
                            >
                              {similarProducts[keyword] && hiddenProducts.has(keyword) ? (
                                <div
                                  onClick={e => {
                                    e.stopPropagation();
                                    setHiddenProducts(prev => {
                                      const next = new Set(prev);
                                      next.delete(keyword);
                                      return next;
                                    });
                                  }}
                                  className="p-1.5 text-[#5D1C83] hover:bg-[#5D1C83]/10 rounded-lg transition-all"
                                  title="Show similar products"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                              ) : (
                                <Wand2
                                  className={`w-4 h-4 text-[#5D1C83] ${
                                    isGenerating && generatingProduct === keyword
                                      ? 'animate-spin'
                                      : ''
                                  }`}
                                />
                              )}
                            </button>
                          </div>
                          {similarProducts[keyword] && !hiddenProducts.has(keyword) && (
                            <SimilarProducts
                              products={similarProducts[keyword]}
                              onProductClick={onKeywordClick}
                              onClose={() => setHiddenProducts(prev => new Set([...prev, keyword]))}
                              dir={set.language.code === 'ar' ? 'rtl' : 'ltr'}
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No local products found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Notification
              show={notification.show}
              type={notification.type}
              message={notification.message}
              setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
            />
          </div>
        ))}
      </div>

      {/* Save Keyword Modal */}
      <SaveKeywordModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setSelectedKeyword(null);
        }}
        keyword={selectedKeyword}
        language={keywordSets[0]?.language.code}
      />

      {/* Saved Keywords Modal */}
      <SavedKeywordsModal
        isOpen={showSavedKeywords}
        onClose={() => setShowSavedKeywords(false)}
        onSelect={onKeywordClick}
      />
    </div>
  );
}
