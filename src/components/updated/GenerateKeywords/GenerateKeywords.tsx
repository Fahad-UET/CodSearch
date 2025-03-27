import React, { useEffect, useState } from 'react';
import { KeywordSet } from '../CodSearch/types';
import SearchHeader from '../CodSearch/searchHeader';
import KeywordPanel from './KeywordPanel';
import SearchResults from '../CodSearch/SearchResult';
import { X, Check, ArrowLeft } from 'lucide-react';
import {
  createSavedImage,
  getSavedImages,
  updateSavedImage,
} from '@/services/firebase/savedImages';
import { useProductStore } from '@/store';
import { createSavedPage, getSavedPages, updateSavedPage } from '@/services/firebase/savedpages';
import SearchHeaderKeywords from './SearchHeaderKeywords';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import CreditsInformation from '@/components/credits/CreditsInformation';
interface GenerateKeywordsProps {
  onBack?: () => void;
  setIsSearch: (value: boolean) => void;
  isProduct?: boolean;
  product: any;
}

const GenerateKeywords: React.FC<GenerateKeywordsProps> = ({
  onBack,
  setIsSearch,
  isProduct,
  product,
}) => {
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [savedImages, setSavedImages] = useState<Set<string>>(new Set());
  const [prompt, setPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [keywordSets, setKeywordSets] = useState<KeywordSet[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showKeywords, setShowKeywords] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [savedPages, setSavedPages] = useState<Set<string>>(new Set());
  const [similarProducts, setSimilarProducts] = useState<Record<string, string[]>>({});
  const [generatingProduct, setGeneratingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    country: '',
    audience: '',
    problemCategory: '',
    problem: '',
    budget: '',
    category: '',
    niche: '',
    season: '',
    customCategory: '',
    customNiche: '',
    customSeason: '',
    customCountry: '',
    similarProduct: '',
    similarProductUrl: '',
    additionalDetails: '',
    customProblemCategory: '',
    customProblem:'',
    setIsSearch,
  });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const validateFormData = (data: any) => {
    // Validation removed - allow empty form
    return true;
  };

  // Load saved pages on mount
  useEffect(() => {
    const fetchData = async () => {
      const [data]: any = await getSavedImages(user.uid);
      setSavedPages(new Set(data?.data?.map((page: any) => page.url)));
    };

    fetchData();
  }, []);

  // Setup Google Search and image handlers
  useEffect(() => {
    // Load Google Custom Search script
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=b200420de7eee4b3e';
    script.async = true;
    document.head.appendChild(script);

    // Track the last clicked link to prevent multiple windows
    let lastClickedLink: string | null = null;
    let lastClickTime = 0;

    // const handleLinkClick = (e: MouseEvent) => {
    //   const target = e.target as HTMLElement;
    //   const link = target.closest('a');

    //   if (link instanceof HTMLAnchorElement && !link.closest('.save-button')) {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     const now = Date.now();

    //     // Prevent multiple clicks within 1 second
    //     if (lastClickedLink === link.href && now - lastClickTime < 1000) {
    //       return;
    //     }

    //     lastClickedLink = link.href;
    //     lastClickTime = now;

    //     window.open(link.href, '_blank', 'noopener,noreferrer');
    //   }
    // };

    // // Add the click handler
    // document.addEventListener('click', handleLinkClick, true);

    // Add save buttons to web results
    const addWebSaveButtons = async () => {
      try {
        const webResults = document.querySelectorAll('.gsc-webResult');
        webResults.forEach(result => {
          try {
            if (!result.querySelector('.save-button')) {
              const link = result.querySelector('a');
              result.addEventListener('click', e => {
                e.stopPropagation();
                window.open(link.href, '_blank', 'noopener,noreferrer');
              });
            }
          } catch (err) {
            console.error('Error processing a web result:', err);
          }
        });
      } catch (err) {
        console.error('Error in addWebSaveButtons function:', err);
      }
    };

    // Add save buttons to images
    const addImageSaveButtons = async () => {
      const imageResults = document.querySelectorAll('.gsc-imageResult');
      imageResults.forEach(result => {
        if (!result.querySelector('.save-button')) {
          const img = result.querySelector('img');
          const popup = result.querySelector('.gs-image-popup-box');
          const previewLink: any = result.querySelector('.gs-previewLink'); // Get the correct navigation link
          const imageAnchor: any = result.querySelector('.gs-image'); // Get the image anchor tag

          if (img && previewLink && imageAnchor) {
            const imageUrl = img.src;
            const pageUrl = previewLink.href; // Correct URL for navigation
            popup.addEventListener('click', e => {
              e.stopPropagation();
              window.open(imageAnchor.href, '_blank', 'noopener,noreferrer');
            });

            try {
              // Set the href attribute of .gs-image elements to the correct page URL
              imageAnchor.setAttribute('href', pageUrl);
              imageAnchor.setAttribute('target', '_blank'); // Open in a new tab
            } catch (error) {
              console.error('Error setting href:', error);
            }

            try {
              // Extract domain from the correct URL and set it as an attribute
              const urlObject = new URL(pageUrl);
              result.setAttribute('data-domain', urlObject.hostname.replace('www.', ''));
            } catch (error) {
              console.error('Invalid URL:', pageUrl, error);
            }

            // const button = document.createElement('button');
            // button.className = 'save-button';
            // button.innerHTML = `
            //   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            //     <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            //     <polyline points="17 21 17 13 7 13 7 21"></polyline>
            //     <polyline points="7 3 7 8 15 8"></polyline>
            //   </svg>
            //   <span>Save</span>`;

            // button.onclick = async e => {
            //   e.preventDefault();
            //   e.stopPropagation();

            //   if (savedImages.has(imageUrl)) {
            //     return;
            //   }

            //   const savedImage = {
            //     id: crypto.randomUUID(),
            //     url: imageUrl,
            //     thumbnailUrl: imageUrl,
            //     platform: 'media',
            //     type: imageUrl.toLowerCase().endsWith('.gif') ? 'gif' : 'image',
            //     originalUrl: pageUrl, // Use correct navigation URL
            //     rating: 0,
            //     createdAt: new Date(),
            //   };

            //   const [data] = await getSavedImages(user.uid);
            //   try {
            //     if (!data || data?.data?.length === 0) {
            //       await createSavedImage(user.uid, { data: [savedImage] });
            //     } else {
            //       const createdData = [...data.data, savedImage];
            //       await updateSavedImage(data?.id, { data: createdData });
            //     }

            //     setSavedImages(prev => new Set(prev).add(imageUrl));
            //     button.className = 'save-button saved';
            //     button.innerHTML = `
            //       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            //         <path d="M20 6 9 17l-5-5"></path>
            //       </svg>
            //       <span>Saved</span>`;

            //     setNotification({
            //       show: true,
            //       message: 'Image saved successfully!',
            //       type: 'success',
            //     });
            //   } catch (error) {
            //     console.error('Failed to save image:', error);
            //   }
            // };

            // if (savedImages.has(imageUrl)) {
            //   button.className = 'save-button saved';
            //   button.innerHTML = `
            //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            //       <path d="M20 6 9 17l-5-5"></path>
            //     </svg>
            //     <span>Saved</span>`;
            // }

            // popup.appendChild(button);
          }
        }
      });
    };

    // Add mutation observer to handle dynamically loaded images
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        const addedNodes = Array.from(mutation.addedNodes);
        if (addedNodes.length) {
          addWebSaveButtons();
          addImageSaveButtons();

          // Add domain tags to snippets
          addedNodes.forEach(node => {
            if (node instanceof HTMLElement) {
              // Add domain tags to text results
              const snippets = node.querySelectorAll('.gs-snippet');
              snippets.forEach(snippet => {
                if (snippet instanceof HTMLElement) {
                  const resultDiv = snippet.closest('.gsc-webResult');
                  if (resultDiv) {
                    const urlDiv = resultDiv.querySelector('.gsc-url-top');
                    if (urlDiv) {
                      try {
                        const url = new URL(urlDiv.textContent || '');
                        snippet.setAttribute('data-domain', url.hostname.replace('www.', ''));
                      } catch (e) {
                        // Invalid URL, skip
                      }
                    }
                  }
                }
              });

              // Add domain tags to image results
              const imageResults = node.querySelectorAll('.gsc-imageResult');
              imageResults.forEach(result => {
                if (result instanceof HTMLElement) {
                  const link = result.querySelector('a');
                  if (link) {
                    try {
                      const url = new URL(link.href);
                      result.setAttribute('data-domain', url.hostname.replace('www.', ''));
                    } catch (e) {
                      // Invalid URL, skip
                    }
                  }
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[src*="cse.google.com"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
      observer.disconnect();
    };
  }, [savedImages]);

  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };
  const generateKeywords = async () => {
    const credits = await getCredits(user?.uid, 'productSearchAssistant');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    setShowKeywords(true);
    setIsGenerating(true);
    setNotification({ show: false, message: '', type: 'success' });
    let controller: AbortController | null = null;

    const filteredText = product?.generatedText?.filter(item => item?.tags?.includes('title'));
    let str = '';
    filteredText?.forEach(item => {
      str += (item?.content || '') + ' ';
    });
    str = str.trim(); // Remove trailing space

    try {
      // Format the prompt based on form data
      const promptData = {
        country: formData.country === 'custom' ? formData.customCountry : formData.country,
        audience: formData.audience,
        problemCategory:
          formData.problemCategory === 'custom'
            ? formData.customProblemCategory || 'General'
            : formData.problemCategory || 'General',
        problem: formData.problemCategory === 'custom' ? formData.customProblem : formData.problem,
        similarProduct: formData.similarProduct,
        similarProductUrl: formData.similarProductUrl,
        additionalDetails: formData.additionalDetails,
      };

      // Ensure we have at least some context for generation
      if (!promptData.country && !promptData.problemCategory && !promptData.similarProduct) {
        throw new Error(
          'Please provide at least a target country, problem category, or similar product to generate suggestions.'
        );
      }

      // Determine target language based on country
      const getLanguageForCountry = (country: string): string => {
        const countryLanguageMap: Record<string, string> = {
          'Saudi Arabia': 'ar',
          UAE: 'ar',
          Kuwait: 'ar',
          Qatar: 'ar',
          Bahrain: 'ar',
          Oman: 'ar',
          France: 'fr',
          Belgium: 'fr',
          Switzerland: 'fr',
          Spain: 'es',
          Mexico: 'es',
          Argentina: 'es',
        };
        return countryLanguageMap[country] || 'en';
      };

      const targetLanguage = getLanguageForCountry(promptData.country);

      // Create new AbortController for this request
      controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      const systemPrompt = `I want to find the exact same product on Google. Give me a list of optimized keywords to 
                     maximize my chances of finding it.
                     The product is: ${prompt ? prompt : ''} ${product?.title} ${str}

                      RESPONSE FORMAT:
                      10 Official Product Name
                      10 Common Variations
                      10 Existing brands

                      Example format:
                      for Official product name : just product name 
                      For Common variations : just product name
                      For Existing brands : product name (brand name)

                      IMPORTANT:
                      - Official product name: the exact name used by manufacturers or product sheets
                      - For Common variations : the different names, abbreviations or popular nicknames
                      - For Existing brands : the main brands that sell this product, you add the official product name with the brand name
                      - ALL products must include manufacturer/brand names
                      - NO generic descriptions
                      - One product per line
                      - No numbering or bullet points`;

      const userPrompt = `Generate product suggestions for:
  
        Please provide:
        1. 10 Official product name
        2. 10 Common variations
        3. 10 Existing brands

        Format each product as "Product Name or Brand Name" on a new line.`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        mode: 'cors',
        signal: controller.signal,
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
            // {
            //     role: 'user',
            //     content: userPrompt,
            // },
          ],
          max_tokens: 1000,
          temperature: 0.3,
          stream: false,
        }),
      });

      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('Failed to generate products');
      }

      const data = await response.json();
      const keywordText = data.choices?.[0]?.message?.content;
      // if (!keywordText) {
      //     throw new Error('No products were found for your criteria.');
      // }

      // Splitting response into sections
      const extractSections = data => {
        const sections = data.split(/\*\*/).map(section => section.trim());
        const officialNames = sections[2].split('\n');
        const commonVariations = sections[4].split('\n');
        const existingBrands = sections[6].split('\n');

        return { officialNames, commonVariations, existingBrands };
      };

      const { officialNames, commonVariations, existingBrands } = extractSections(keywordText);

      // Ensure at least one of the lists has data
      // if (officialNames.length === 0 && commonVariations.length === 0 && existingBrands.length === 0) {
      //     throw new Error('No products were found. Please try different search criteria.');
      // }

      // Combine both lists
      const allKeywords = { officialNames, commonVariations, existingBrands };

      const dataToBeSet = [
        {
          language: {
            code: targetLanguage,
            name:
              targetLanguage === 'ar'
                ? 'العربية'
                : targetLanguage === 'fr'
                ? 'Français'
                : targetLanguage === 'es'
                ? 'Español'
                : 'English',
            flag:
              targetLanguage === 'ar'
                ? '🇸🇦'
                : targetLanguage === 'fr'
                ? '🇫🇷'
                : targetLanguage === 'es'
                ? '🇪🇸'
                : '🇺🇸',
            native:
              targetLanguage === 'ar'
                ? 'العربية'
                : targetLanguage === 'fr'
                ? 'Français'
                : targetLanguage === 'es'
                ? 'Español'
                : 'English',
          },
          keywords: allKeywords,
        },
      ];

      setKeywordSets(dataToBeSet);
      const result = await updateCredits(user?.uid, 'productSearchAssistant');
      setPackage(userPackage.plan, result.toString());
      localStorage.setItem('keyword_product', JSON.stringify(dataToBeSet));
      localStorage.setItem('generatedKeywordName', `${prompt ? prompt : ''}_${product?.title}`);

      setShowKeywords(true);
      setShowResults(true);
      setNotification({
        show: true,
        message: 'Products generated successfully!',
        type: 'success',
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setNotification({
          show: true,
          message: 'Request timed out. Please try again.',
          type: 'error',
        });
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to generate products after multiple attempts. Please try again later.';

        setNotification({
          show: true,
          message: errorMessage,
          type: 'error',
        });
      }

      // Reset states on error
      setKeywordSets([]);
      setShowKeywords(false);
    } finally {
      if (controller) {
        controller.abort(); // Cleanup any pending request
      }
      setIsGenerating(false);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
    const searchButton = document.querySelector('.gsc-search-button') as HTMLButtonElement;

    if (searchInput) {
      searchInput.value = keyword;

      // Trigger input event
      const inputEvent = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      searchInput.dispatchEvent(inputEvent);

      // Small delay to ensure the search input is properly updated
      setTimeout(() => {
        // Click the search button to trigger the search
        if (searchButton) {
          searchButton.click();
        }

        setShowKeywords(false);
        searchInput.focus();
      }, 100);
    }
  };

  const generateSimilarProducts = async (product: string) => {
    const credits = await getCredits(user?.uid, 'similarKeyword');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    setIsGenerating(true);
    setGeneratingProduct(product);
    let timeoutId: number | null = null;

    try {
      const promptData = {
        country: formData.country === 'custom' ? formData.customCountry : formData.country,
        audience: formData.audience,
        problemCategory:
          formData.problemCategory === 'custom'
            ? formData.customProblemCategory
            : formData.problemCategory,
        problem: formData.problemCategory === 'custom' ? formData.customProblem : formData.problem,
        similarProduct: product,
        additionalDetails: formData.additionalDetails,
      };

      // Set timeout for the request
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        mode: 'cors',
        signal: controller.signal,
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
              content: `Generate 10 similar products to "${product}" that solve the same problem and target the same market. Consider:
  
  Market: ${promptData.country}
  ${promptData.audience ? `Audience: ${promptData.audience}` : ''}
  ${promptData.problemCategory ? `Problem Category: ${promptData.problemCategory}` : ''}
  ${promptData.problem ? `Problem: ${promptData.problem}` : ''}
  
  List only product names with brand names where applicable. Do not include any explanations or introductions. Format each product on a new line.`,
            },
          ],
          max_tokens: 1000,
          temperature: 0.3,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate similar products');
      }

      const data = await response.json();
      const similarProductsList = data.choices?.[0]?.message?.content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('-'))
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim());

      setSimilarProducts(prev => ({
        ...prev,
        [product]: similarProductsList,
      }));
      const result = await updateCredits(user?.uid, 'similarKeyword');
      setPackage(userPackage.plan, result.toString());
      setNotification({
        show: true,
        message: 'Similar products generated successfully!',
        type: 'success',
      });
    } catch (error) {
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Failed to generate similar products',
        type: 'error',
      });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setIsGenerating(false);
      setGeneratingProduct(null);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem('keyword_product');

    if (storedData) {
      setKeywordSets(JSON.parse(storedData) || []); // Parse and set in state
    }
  }, []);

  return (
    <div
      className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-purple-900 via-slate-900 to-black"
    >
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-white/80 mb-4 hover:text-white flex items-center gap-2
                transition-colors duration-300 hover:bg-white/5 rounded-lg p-2"
        >
          <ArrowLeft size={20} />
        </button>
        <>
          {/* Main content */}
          <div className="space-y-6">
            {/* <SearchHeader
                            prompt={prompt}
                            setPrompt={setPrompt}
                            formData={formData}
                            setFormData={setFormData}
                            showPromptInput={showPromptInput}
                            setShowPromptInput={setShowPromptInput}
                            showKeywords={showKeywords}
                            setShowKeywords={setShowKeywords}
                            keywordSets={keywordSets}
                            isGenerating={isGenerating}
                            generateKeywords={generateKeywords}
                            isProduct={isProduct}

                        /> */}
            <SearchHeaderKeywords
              prompt={prompt}
              setPrompt={setPrompt}
              formData={formData}
              setFormData={setFormData}
              showPromptInput={showPromptInput}
              setShowPromptInput={setShowPromptInput}
              showKeywords={showKeywords}
              setShowKeywords={setShowKeywords}
              keywordSets={keywordSets}
              isGenerating={isGenerating}
              generateKeywords={generateKeywords}
              isProduct={isProduct}
            />
            <KeywordPanel
              showKeywords={showKeywords}
              keywordSets={keywordSets}
              onKeywordClick={handleKeywordClick}
              onGenerateSimilar={generateSimilarProducts}
              isGenerating={isGenerating}
              similarProducts={similarProducts}
              generatingProduct={generatingProduct}
              isProduct={true}
              setPrompt={setPrompt}
              prompt={prompt}
              product={product}
            />

            <SearchResults
              showResults={showResults}
              setShowResults={setShowResults}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default GenerateKeywords;
