import React, { useEffect, useState } from 'react';
import { KeywordSet } from '../CodSearch/types';
import { LANGUAGES } from '../CodSearch/translations';
import SearchHeader from '../CodSearch/searchHeader';
import KeywordPanel from '../CodSearch/keywordPanel';
import SearchResults from '../CodSearch/SearchResult';
import { X, Check, ArrowLeft, Linkedin } from 'lucide-react';
import ProductSearchPrompt from '../CodSearch/productSearchPrompt';
import { generateText } from '../CodSearch/generateText';
import {
  createSavedImage,
  getSavedImages,
  updateSavedImage,
} from '@/services/firebase/savedImages';
import { useProductStore } from '@/store';
import { createSavedPage, getSavedPages, updateSavedPage } from '@/services/firebase/savedpages';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import CreditsInformation from '@/components/credits/CreditsInformation';
interface CodSearchProps {
  onBack?: () => void;
  isProduct?: boolean;
}

const CodSearch: React.FC<CodSearchProps> = ({ onBack, isProduct }) => {
  const { user } = useProductStore();
  const [savedImages, setSavedImages] = useState<Set<string>>(new Set());
  const [prompt, setPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [keywordSets, setKeywordSets] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showKeywords, setShowKeywords] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [savedPages, setSavedPages] = useState<Set<string>>(new Set());
  const [similarProducts, setSimilarProducts] = useState<Record<string, string[]>>({});
  const [generatingProduct, setGeneratingProduct] = useState<string | null>(null);
  const { userPackage, setPackage } = useProductStore();
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
    customProblemCategory:'',
    customProblem:'',
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

  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  // Load saved images on mount
  // useEffect(() => {
  //   const saved = JSON.parse(localStorage.getItem('saved_images') || '[]');
  //   setSavedImages(new Set(saved.map((img: SavedImage) => img.url) || []));
  // }, []);

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
              const title = result.querySelector('.gs-title')?.textContent;
              const snippet = result.querySelector('.gs-snippet')?.textContent;
              const link = result.querySelector('a');
              const domain = result.querySelector('.gs-snippet')?.getAttribute('data-domain');

              if (title && link && domain) {
                const button = document.createElement('button');
                button.className = 'save-button flex items-center gap-2 px-3 py-2';
                button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  <span>Save</span>`;

                button.onclick = async e => {
                  e.preventDefault();
                  e.stopPropagation();
                  const credits = await getCredits(user?.uid, 'saveKeyword');
                  if (!credits) {
                    CreditAlert(
                      true,
                      'You do not have enough credits. Please purchase more.',
                      'error'
                    );
                    return;
                  }
                  try {
                    const pageUrl = link.href;
                    if (savedPages.has(pageUrl)) {
                      return;
                    }

                    // Create new saved page
                    const savedPage = {
                      id: crypto.randomUUID(),
                      title,
                      url: pageUrl,
                      snippet: snippet || '',
                      domain,
                      createdAt: new Date(),
                    };

                    // Save to localStorage
                    const [data]: any = await getSavedPages(user.uid);

                    if (!data || data?.data?.length === 0) {
                      await createSavedPage(user.uid, { data: [savedPage] });
                    } else {
                      const createdData = [...data.data, savedPage];
                      await updateSavedPage(data?.id, { data: createdData });
                    }

                    // Update UI
                    setSavedPages(prev => new Set(prev).add(pageUrl));
                    const result = await updateCredits(user?.uid, 'saveKeyword');
                    setPackage(userPackage.plan, result.toString());
                    button.className = 'save-button saved';
                    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                      <span>Saved</span>`;
                  } catch (err) {
                    console.error('Error saving page:', err);
                  }
                };

                result.addEventListener('click', e => {
                  e.stopPropagation();
                  window.open(link.href, '_blank', 'noopener,noreferrer');
                });
                // Check if already saved
                if (savedPages.has(link.href)) {
                  button.className = 'save-button saved';
                  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>
                    <span>Saved</span>`;
                }

                result.appendChild(button);
              }
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
              window.open(previewLink.href, '_blank', 'noopener,noreferrer');
            });
            try {
              // Set the href attribute of .gs-image elements to the correct page URL
              imageAnchor.setAttribute('href', pageUrl);
              imageAnchor.setAttribute('target', '_blank'); // Open in a new tab
              imageAnchor.setAttribute('rel', 'noopener noreferrer');
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

            const button = document.createElement('button');
            button.className = 'save-button';
            button.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              <span>Save</span>`;

            button.onclick = async e => {
              e.preventDefault();
              e.stopPropagation();
              const credits = await getCredits(user?.uid, 'saveKeyword');
              if (!credits) {
                CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
                return;
              }
              if (savedImages.has(imageUrl)) {
                return;
              }

              const savedImage = {
                id: crypto.randomUUID(),
                url: imageUrl,
                thumbnailUrl: imageUrl,
                platform: 'media',
                type: imageUrl.toLowerCase().endsWith('.gif') ? 'gif' : 'image',
                originalUrl: pageUrl, // Use correct navigation URL
                rating: 0,
                createdAt: new Date(),
              };

              const [data]: any = await getSavedImages(user.uid);
              try {
                if (!data || data?.data?.length === 0) {
                  await createSavedImage(user.uid, { data: [savedImage] });
                } else {
                  const createdData = [...data.data, savedImage];
                  await updateSavedImage(data?.id, { data: createdData });
                }

                setSavedImages(prev => new Set(prev).add(imageUrl));
                button.className = 'save-button saved';
                button.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6 9 17l-5-5"></path>
                  </svg>
                  <span>Saved</span>`;

                setNotification({
                  show: true,
                  message: 'Image saved successfully!',
                  type: 'success',
                });
                const result = await updateCredits(user?.uid, 'saveKeyword');
                setPackage(userPackage.plan, result.toString());
              } catch (error) {
                console.error('Failed to save image:', error);
              }
            };

            if (savedImages.has(imageUrl)) {
              button.className = 'save-button saved';
              button.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <span>Saved</span>`;
            }

            popup.appendChild(button);
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

  const generateKeywords = async () => {
    setIsGenerating(true);
    setNotification({ show: false, message: '', type: 'success' });
    let controller: AbortController | null = null;

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

      const systemPrompt = `Act as an expert in market analysis and competition and consumer trends for the sale of products online. Provide a list of 20 best selling products that are suitable for the following market and problem.
  
          STRICT RULES FOR WORLDWIDE PRODUCTS:
          1. Each line must be a complete product name with brand
          2. Format: "Product Name (Brand Name)"
          3. Must be real, existing products
          4. Must be currently available in the market
          5. Must directly solve the specified problem
  
          RESPONSE FORMAT:
          10 worldwide products
          10 local products
          
          Example format:
          Vitamin C Serum (The Ordinary)
          Hydrating Cleanser (CeraVe)
  
          IMPORTANT:
          - For worldwide products: NO compromises on matching criteria
          - For local products: Consider cultural alternatives that solve the same problem
          - ALL products must include manufacturer/brand names
          - NO generic descriptions
          - One product per line
          - No numbering or bullet points`;

      const userPrompt = `Generate product suggestions for:
          
    Target Market: ${promptData.country}
    ${promptData.audience ? `Target Audience: ${promptData.audience}` : ''}
    ${promptData.problemCategory ? `Problem Category: ${promptData.problemCategory}` : ''}
    ${promptData.problem ? `Specific Problem: ${promptData.problem}` : ''}
    ${promptData.similarProduct ? `Similar to: ${promptData.similarProduct}` : ''}
    ${promptData.additionalDetails ? `Additional Context: ${promptData.additionalDetails}` : ''}
  
    Please provide:
    1. 10 worldwide products with their brands
    2. 10 local/regional products with their brands
  
    Format each product as "Product Name (Brand Name)" on a new line.`;

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
            {
              role: 'user',
              content: userPrompt,
            },
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

      if (!keywordText) {
        throw new Error(
          'No products were found for your criteria. Try adjusting your search parameters.'
        );
      }

      // Extract only product names, removing explanations
      const lines = keywordText
        .split('\n')
        .map(line => line.trim())
        .filter(line => {
          // Keep only lines that match the format "Product Name (Brand Name)"
          return line && /^[^()]+\([^()]+\)$/.test(line.trim());
        });

      // Split into worldwide and local products
      const midPoint = Math.min(10, Math.floor(lines.length / 2));
      const worldwideProducts = lines
        .slice(0, midPoint)
        .map(line => line.replace(/^\d+[\.\)]\s*/, '').trim());

      const localProducts = lines.slice(midPoint, midPoint + 10).map(line =>
        line
          .replace(/^\d+[\.\)]\s*/, '')
          .replace(/\s*\(Local\)\s*$/, '')
          .trim()
      );

      // Combine both lists
      const allKeywords = {
        officialNames: [...worldwideProducts],
        commonVariations: [...localProducts],
      };
      if (worldwideProducts.length === 0 && localProducts.length === 0) {
        throw new Error('No products were found. Please try different search criteria.');
      }

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
      localStorage.setItem('keyword', JSON.stringify(dataToBeSet));

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
    const storedData = localStorage.getItem('keyword');

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
            <SearchHeader
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
            {/* <CreditsInformation
              creditType={'generateKeyword'}
              requiredCredits={'Credits required to search google results'}
              classes={'text-white flex gap-2'}
            /> */}
            <KeywordPanel
              prompt={prompt}
              setPrompt={setPrompt}
              showKeywords={showKeywords}
              keywordSets={keywordSets}
              onKeywordClick={handleKeywordClick}
              onGenerateSimilar={generateSimilarProducts}
              isGenerating={isGenerating}
              similarProducts={similarProducts}
              generatingProduct={generatingProduct}
            />

            <SearchResults showResults={showResults} setShowResults={setShowResults} />
          </div>
        </>
      </div>
    </div>
  );
};

export default CodSearch;
