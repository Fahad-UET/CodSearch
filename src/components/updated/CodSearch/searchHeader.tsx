import React, { useEffect, useRef } from 'react';
import { Settings, Wand2, ChevronDown } from 'lucide-react';
import { KeywordSet } from '../CodSearch/types';
import { SearchStyles } from '../CodSearch/SearchStyles';
import ProductSearchPrompt from '../CodSearch/productSearchPrompt';

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
  generateKeywords: () => void;
  isProduct: boolean;
}

export default function SearchHeader({
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
  const [searchInput, setSearchInput] = React.useState<HTMLInputElement | null>(null);
  const [clearButton, setClearButton] = React.useState<HTMLElement | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const clearButtonReplaced = useRef(false); // Prevent infinite re-renders

  useEffect(() => {
    const replaceClearButton = () => {
      const input = document.querySelector('.gsc-input-box input') as HTMLInputElement;
      const clearLink = document.querySelector('.gsst_a'); // Original clear button

      if (input) {
        searchInputRef.current = input;
      }

      // Avoid multiple replacements
      if (clearLink && !clearButtonReplaced.current) {
        clearButtonReplaced.current = true; // Mark as replaced

        // Create a new <button> element
        const clearButton = document.createElement('button');
        clearButton.className = clearLink.className; // Copy existing styles
        clearButton.innerHTML = clearLink.innerHTML; // Copy inner content (like '×' icon)
        clearButton.type = 'button'; // Ensure it's a button
        clearButton.setAttribute('aria-label', 'Clear search');

        // Prevent default behavior and clear input correctly
        clearButton.addEventListener('click', e => {
          e.preventDefault();
          e.stopPropagation();

          if (input) {
            input.value = ''; // Clear input
            input.dispatchEvent(new Event('input', { bubbles: true })); // Trigger UI update
            input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace' })); // Refresh search
            input.focus(); // Keep focus on input
          }
        });

        // Replace <a> tag with new <button>
        clearLink.replaceWith(clearButton);
      }
    };

    replaceClearButton(); // Run once when component mounts

    // Use MutationObserver to handle dynamic changes but avoid infinite loops
    const observer = new MutationObserver(mutations => {
      let shouldRun = false;
      mutations.forEach(mutation => {
        if ([...mutation.addedNodes].some(node => node instanceof HTMLElement)) {
          shouldRun = true;
        }
      });

      if (shouldRun) {
        replaceClearButton();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect(); // Cleanup on unmount
    };
  }, []);

  const input = document.querySelector('.gsc-input-box input') as HTMLInputElement;
  useEffect(() => {
    setPrompt(input?.value);
  }, [input]);

  return (
    <div className="flex items-center justify-between mb-8">
      {/* Search Box */}
      <div className="flex-1">
        <div className="bg-white/95 mr-3 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden relative">
          <SearchStyles />
          <div
            className="gcse-searchbox"
            data-gname="storesearch"
            data-enableautocomplete="true"
            data-autocompleteoptions='{"maxCompletions":5}'
            data-resultsurl="#"
            data-searchbutton="true"
            data-searchbox="true"
          ></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* {keywordSets.length > 0 && ( */}
        <button
          onClick={() => setShowKeywords(!showKeywords)}
          className="flex items-center gap-2 px-4 py-2 bg-white/95 text-[#5D1C83] rounded-lg hover:bg-white shadow-lg hover:shadow-xl transition-all"
        >
          {showKeywords ? 'Hide Keywords' : 'Show Keywords'}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showKeywords ? 'rotate-180' : ''}`}
          />
        </button>
        {/* )} */}
        <button
          // onClick={generateKeywords}
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
          {/* {!isProduct && <button
            className="flex items-center gap-2 px-4 py-2 bg-white/95 text-[#5D1C83] rounded-lg hover:bg-white shadow-lg hover:shadow-xl transition-all"
          >
            Search Details
          </button>} */}
          <ProductSearchPrompt
            isOpen={showPromptInput}
            onClose={() => setShowPromptInput(false)}
            formData={formData}
            setFormData={setFormData}
            onSubmit={async(newPrompt) => {
              setPrompt(newPrompt);
              generateKeywords();
            }}
          />
        </div>
      </div>
    </div>
  );
}
