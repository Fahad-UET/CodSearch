import React from 'react';
import { Bot, Globe, Bookmark, ChevronUp, Check, Star, ImageIcon, Search, ArrowUpDown, DollarSign, Languages } from 'lucide-react';
import { AVAILABLE_LANGUAGES, type Language } from './utils/Types';
import { AVAILABLE_MODELS } from './utils/Types';

interface HeaderProps {
  selectedLanguage: Language;
  setSelectedLanguage: (lang: Language) => void;
  savedSelectionsCount: number;
  setIsMemoryPanelOpen: (open: boolean) => void;
  selectedModels: string[];
  toggleModel: (modelId: string) => void;
  setDefaultLanguage: (lang: Language) => void;
}

const MODEL_SERIES = ['GPT', 'Claude', 'Gemini', 'Grok', 'Qwen', 'DeepSeek', 'Mistral', 'Amazon', 'Meta', 'Anthracite', 'Microsoft', 'Google', 'Other'];

export function Header({
  selectedLanguage,
  setSelectedLanguage,
  savedSelectionsCount,
  setIsMemoryPanelOpen,
  selectedModels,
  toggleModel,
  setDefaultLanguage
}: HeaderProps) {
  const [selectedSeries, setSelectedSeries] = React.useState<string>('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = React.useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'price' | 'images' | 'search'>('price');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [defaultModel, setDefaultModel] = React.useState<string>(() => 
    localStorage.getItem('defaultModel') || ''
  );
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const languageDropdownRef = React.useRef<HTMLDivElement>(null);
  const languageButtonRef = React.useRef<HTMLButtonElement>(null);
  const [defaultLanguage, setDefaultLanguageState] = React.useState<Language>(() => {
    return localStorage.getItem('defaultLanguage') as Language || 'en';
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (dropdownRef.current && 
         !dropdownRef.current.contains(event.target as Node) &&
         buttonRef.current &&
         !buttonRef.current.contains(event.target as Node)) ||
        (languageDropdownRef.current && 
         !languageDropdownRef.current.contains(event.target as Node) &&
         languageButtonRef.current &&
         !languageButtonRef.current.contains(event.target as Node))
      ) {
        setIsModelDropdownOpen(false);
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortedAndFilteredModels = AVAILABLE_MODELS.filter(model => 
    !selectedSeries || model.series === selectedSeries
  ).sort((a, b) => {
    // Always sort by price first
    const priceComparison = sortBy === 'price'
      ? (sortDirection === 'asc' 
          ? a.creditsPerThousandTokens - b.creditsPerThousandTokens
          : b.creditsPerThousandTokens - a.creditsPerThousandTokens)
      : a.creditsPerThousandTokens - b.creditsPerThousandTokens;

    // If sorting by price or prices are equal, apply secondary sort
    if (sortBy === 'images') {
      return sortDirection === 'asc'
        ? (a.supportsImages ? 1 : 0) - (b.supportsImages ? 1 : 0)
        : (b.supportsImages ? 1 : 0) - (a.supportsImages ? 1 : 0);
    } else if (sortBy === 'search') {
      return sortDirection === 'asc'
        ? (a.requiresReferences ? 1 : 0) - (b.requiresReferences ? 1 : 0)
        : (b.requiresReferences ? 1 : 0) - (a.requiresReferences ? 1 : 0);
    }
    
    return priceComparison;
  });

  const handleSort = (type: 'price' | 'images' | 'search') => {
    if (sortBy === type) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortDirection('asc');
    }
  };

  return (
    <div className="sticky top-0 z-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hero-gradient md:w-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 transform hover:scale-105 transition-transform">
            <Bot className="w-10 h-10 text-white/90" />
            MultiBot AI
          </h1>
          <div className="flex items-center gap-4">
            {/* Series Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                className="glass-effect text-white rounded-lg px-6 py-3 appearance-none cursor-pointer min-w-[180px] text-base font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                <option value="">All Series</option>
                {MODEL_SERIES.map(series => (
                  <option key={series} value={series} className="bg-gray-800 text-white py-1">
                    {series}
                  </option>
                ))}
              </select>
              <ChevronUp className="w-5 h-5 text-white/70 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none rotate-180" />
            </div>

            {/* Models Dropdown */}
            <div className="relative">
              <button
                ref={buttonRef}
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="glass-effect text-white rounded-lg px-6 py-3 flex items-center gap-3 min-w-[200px] text-base font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                <span>Select Models ({selectedModels.length})</span>
                <ChevronUp className={`w-5 h-5 transition-transform ${isModelDropdownOpen ? '' : 'rotate-180'}`} />
              </button>
              {isModelDropdownOpen && (
                <div ref={dropdownRef} className="absolute top-full mt-1 w-[400px] max-h-[400px] overflow-y-auto bg-gray-800 rounded-lg shadow-xl z-50">
                  <div className="sticky top-0 bg-gray-900 p-2 flex gap-2 border-b border-gray-700">
                    <button
                      onClick={() => handleSort('price')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded ${
                        sortBy === 'price' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <DollarSign className="w-4 h-4" />
                      <ArrowUpDown className={`w-4 h-4 transition-transform ${
                        sortBy === 'price' && sortDirection === 'desc' ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <button
                      onClick={() => handleSort('images')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded ${
                        sortBy === 'images' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <ArrowUpDown className={`w-4 h-4 transition-transform ${
                        sortBy === 'images' && sortDirection === 'desc' ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <button
                      onClick={() => handleSort('search')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded ${
                        sortBy === 'search' ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <Search className="w-4 h-4" />
                      <ArrowUpDown className={`w-4 h-4 transition-transform ${
                        sortBy === 'search' && sortDirection === 'desc' ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                  {sortedAndFilteredModels.map(model => {
                    const isSelected = selectedModels.includes(model.id);
                    const canToggle = selectedModels.length > 1 || !isSelected;
                    const isDefault = defaultModel === model.id;
                    
                    return (
                      <button
                        key={model.id}
                        onClick={() => canToggle && toggleModel(model.id)}
                        disabled={!canToggle}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all ${
                          isDefault 
                            ? 'bg-yellow-500/20 hover:bg-yellow-500/30' 
                            : isSelected 
                              ? 'bg-purple-600/90 text-white hover:bg-purple-600' 
                              : 'text-white hover:bg-gray-700'
                        } ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-2 min-w-[60px]">
                          {isSelected && <Check className="w-4 h-4" />}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem('defaultModel', model.id);
                              setDefaultModel(model.id);
                            }}
                            className={`p-1.5 rounded-full transition-colors ${
                              isDefault ? 'bg-yellow-400/30' : 'hover:bg-gray-700'
                            }`}
                            title={isDefault ? 'Default model' : 'Set as default model'}
                          >
                            <Star className={`w-4 h-4 transition-all ${
                              isDefault ? 'fill-yellow-300 text-yellow-300 scale-110' : 'text-gray-400 hover:text-yellow-400'
                            }`} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium ${isDefault ? 'text-yellow-400' : ''}`}>{model.name}</span>
                            <span className="text-xs opacity-75">{model.series}</span>
                          </div>
                          <div className="text-xs mt-1 flex items-center gap-3">
                            <span className="text-green-400 font-medium">
                              {model.creditsPerThousandTokens} credits/1K tokens
                            </span>
                            <div className="flex items-center gap-2">
                              {model.supportsImages && (
                                <span className="flex items-center gap-1 text-blue-400">
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  Images
                                </span>
                              )}
                              {model.requiresReferences && (
                                <span className="flex items-center gap-1 text-purple-400">
                                  <Search className="w-3.5 h-3.5" />
                                  Search
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="relative flex items-center gap-3 glass-effect rounded-lg px-6 py-3 min-w-[280px] hover:bg-white/20 transition-colors border border-white/20">
              <button
                ref={languageButtonRef}
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-3 w-full text-base font-medium"
              >
                <Languages className="w-5 h-5 text-white/70" />
                <span className="text-white">
                  {AVAILABLE_LANGUAGES.find(lang => lang.id === selectedLanguage)?.name}
                </span>
                <ChevronUp className={`w-5 h-5 text-white/70 transition-transform ${isLanguageDropdownOpen ? '' : 'rotate-180'}`} />
              </button>
              {isLanguageDropdownOpen && (
                <div
                  ref={languageDropdownRef}
                  className="absolute top-full left-0 mt-1 w-full bg-gray-800 rounded-lg shadow-xl z-50"
                >
                  {AVAILABLE_LANGUAGES.map(lang => {
                    const isDefault = defaultLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => {
                          setSelectedLanguage(lang.id);
                          setIsLanguageDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          isDefault
                            ? 'bg-yellow-500/20 hover:bg-yellow-500/30'
                            : selectedLanguage === lang.id
                              ? 'bg-purple-600/90 text-white hover:bg-purple-600'
                              : 'text-white hover:bg-gray-700'
                        }`}
                      >
                        <span className="flex-1">{lang.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem('defaultLanguage', lang.id);
                            setDefaultLanguageState(lang.id);
                            setDefaultLanguage(lang.id);
                          }}
                          className={`p-1.5 rounded-full transition-colors ${
                            isDefault ? 'bg-yellow-400/30' : 'hover:bg-gray-700'
                          }`}
                          title={isDefault ? 'Default language' : 'Set as default language'}
                        >
                          <Star className={`w-4 h-4 transition-all ${
                            isDefault ? 'fill-yellow-300 text-yellow-300 scale-110' : 'text-gray-400 hover:text-yellow-400'
                          }`} />
                        </button>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setIsMemoryPanelOpen(true)}
                className="glass-effect text-white rounded-lg px-6 py-3 text-base font-medium hover:bg-white/20 transition-colors flex items-center gap-3 border border-white/20"
              >
                <Bookmark className="w-5 h-5" />
                <span>Saved Text ({savedSelectionsCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}