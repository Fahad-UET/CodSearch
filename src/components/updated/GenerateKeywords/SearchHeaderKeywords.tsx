import React, { useEffect, useRef, useState } from 'react';
import { Settings, Wand2, ChevronDown, Search } from 'lucide-react';
import { KeywordSet } from '../CodSearch/types';
import { SearchStyles } from '../CodSearch/SearchStyles';
import ProductSearchPrompt from '../CodSearch/productSearchPrompt';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import { useProductStore } from '@/store';

interface Props {
  prompt: string;
  setPrompt: (prompt: string) => void;
  formData: any;
  setFormData: (data: any) => void;
  showPromptInput: boolean;
  setShowPromptInput: (show: boolean) => void;
  showKeywords: boolean;
  setShowKeywords: (show: boolean) => void;
  keywordSets: KeywordSet[];
  isGenerating: boolean;
  generateKeywords: () => Promise<void>;
  isProduct: boolean;
}

export default function SearchHeaderKeywords({
  prompt,
  setPrompt,
  formData,
  setFormData,
  showPromptInput,
  setShowPromptInput,
  showKeywords,
  setShowKeywords,
  keywordSets,
  isGenerating,
  generateKeywords,
  isProduct,
}: Props) {
  const [searchValue, setSearchValue] = useState(prompt);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  // Function to extract `gsc.q` value from hash
  const getQueryFromHash = () => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace('#', '')); // Remove `#` and parse params
    return params.get('gsc.q') || '';
  };

  useEffect(() => {
    setSearchValue(prompt);
  }, [prompt]);
  useEffect(() => {
    // Initialize input field from hash
    const initialQuery = getQueryFromHash();
    if (initialQuery) {
      setSearchValue(initialQuery);
      setPrompt(initialQuery);
    }

    // Listen for hash changes and update input field
    const handleHashChange = () => {
      const newQuery = getQueryFromHash();
      setSearchValue(newQuery);
      setPrompt(newQuery);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const updateHash = (query: string) => {
    if (query.trim()) {
      window.location.hash = `gsc.tab=0&gsc.q=${encodeURIComponent(query)}`;
    }
  };
  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };
  const handleSearch = async () => {
    try {
      const credits = await getCredits(user?.uid, 'generateKeyword');
      if (!credits) {
        CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
        return;
      }
      updateHash(searchValue);
      setShowKeywords(false);
      const result = await updateCredits(user?.uid, 'generateKeyword');
      setPackage(userPackage.plan, result.toString());
      // generateKeywords();
    } catch (error) {
      console.log(error);
    }
  };

  const handleGenerate = () => {
    generateKeywords();
    updateHash(searchValue);
  };

  const handleClear = () => {
    setSearchValue('');
    setPrompt('');
    window.location.hash = 'gsc.tab=0&gsc.q=';
  };

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Search Box */}
      <div className="flex-1">
        <div className="bg-white/95 mr-3 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden relative">
          <SearchStyles />
          <div className="relative flex items-center bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
            <input
              type="text"
              ref={searchInputRef}
              value={searchValue}
              onChange={e => {
                setSearchValue(e.target.value);
                setPrompt(e.target.value);
              }}
              placeholder="Search..."
              className="w-full px-4 py-3 border-none outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-16 text-gray-500 hover:text-gray-700 text-xl font-bold"
              aria-label="Clear search"
            >
              ×
            </button>
            <button
              onClick={handleSearch}
              className="absolute right-0.5 text-white bg-[#5D1C83] rounded-md px-[14px] py-[7px]"
            >
              {/* {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : ( */}
              <Search />
              {/* )} */}
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          className="flex items-center gap-2 px-4 py-2 bg-white/95 text-[#5D1C83] rounded-lg hover:bg-white shadow-lg hover:shadow-xl transition-all"
        >
          {showKeywords ? 'Hide Keywords' : 'Show Keywords'}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showKeywords ? 'rotate-180' : ''}`}
          />
        </button>

        <button
          onClick={isProduct ? generateKeywords : () => setShowPromptInput(!showPromptInput)}
          disabled={isGenerating}
          className={`flex items-center gap-2 px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
            isGenerating ? 'animate-pulse' : ''
          }`}
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating...' : 'Generate Keywords'}
        </button>

        <div className="relative">
          <ProductSearchPrompt
            isOpen={showPromptInput}
            onClose={() => setShowPromptInput(false)}
            formData={formData}
            setFormData={setFormData}
            onSubmit={async newPrompt => {
              setPrompt(newPrompt);
              await generateKeywords();
              updateHash(newPrompt);
            }}
          />
        </div>
      </div>
    </div>
  );
}
