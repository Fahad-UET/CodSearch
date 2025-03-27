import React, { useEffect } from 'react';
import { useState } from 'react';
import { Sparkles, FileDown, Copy, Wand, Settings, Languages, ChevronDown } from 'lucide-react';
import Modal from '../ui/Modal';
import Notification from '../ui/Notification';
import GeneratedTextPreview from './GeneratedTextPreview';
import { TABS, PROMPT_TEMPLATES } from '../ui/constant';
import LatestGeneration from './LatestGeneration';
import { generateText } from '@/services/openai';
import AdminPrompts from './AdminPrompts';
import SavedTextsList from './SavedTextsList';
import AiPromptForm from './AiPromptForm';
import AiTextOutput from './AiTextOutput';
import MarketingLists from './MarketingLists';
import { useSavedTextsStore } from '@/store/savedTextStore';
import { storePromptCategories } from '@/services/firebase/Prompt';
import { createAiText, getAiText, updateAiText } from '@/services/firebase/AiText';
import { LANGUAGES } from '../ui/constant';
interface PropType {
  product: any;
  activeTabParent: string;
}

export default function AiTextDeepSeek({ product, activeTabParent }: PropType) {
  const [outputs, setOutputs] = React.useState<Record<string, string>>({});
  const [generatedTexts, setGeneratedTexts] = React.useState<Record<string, string[]>>({});
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('en');
  const [productName, setProductName] = React.useState<string>(product?.title || '');

  const [useDialect, setUseDialect] = React.useState(false);
  const [tokenStats, setTokenStats] = React.useState<{
    usedTokens: number;
    remainingTokens: number;
  }>({
    usedTokens: 0,
    remainingTokens: 1000000, // Starting with 1M tokens
  });
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const { savedTexts, markTextAsUsed } = useSavedTextsStore();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isGlobalGenerating, setIsGlobalGenerating] = useState(false);
  const [hasGeneratedLists, setHasGeneratedLists] = useState(false);
  const [showMarketingLists, setShowMarketingLists] = useState(true);
  const [marketingSelections, setMarketingSelections] = useState({
    angle: '',
    problem: '',
    painPoint: '',
    brandName: '',
  });
  const [notification, setNotification] = React.useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = event => {
    setIsChecked(event.target.checked);
  };

  const getTabCount = (tagId: string | undefined) => {
    if (!tagId) return 0;
    return savedTexts.filter(text => text.tags.includes(tagId)).length;
  };

  const currentTabGenerations = generatedTexts[activeTab] || [];

  const handleGlobalGenerate = async () => {
    setIsGlobalGenerating(true);

    // Check if there's any text selected for the current tab
    const hasSelectedText = TABS.some(tab => {
      const tabTexts = savedTexts.filter(text => text.tags.includes(tab.tagId || ''));
      return tabTexts.some(text => text.usedInPrompt);
    });

    if (!hasSelectedText) {
      setIsGlobalGenerating(false);
      return;
    }

    for (const tab of TABS) {
      // Get texts for current tab
      const tabTexts = savedTexts.filter(text => text.tags.includes(tab.tagId || ''));
      const selectedTexts = tabTexts.filter(text => text.usedInPrompt);

      if (selectedTexts.length === 0) continue;

      setActiveTab(tab.id);

      // Add delay between generations
      await new Promise(resolve => setTimeout(resolve, 100));

      // TODO: Replace with actual AI generation
      const newText = `Generated text for ${tab.label} based on ${selectedTexts.length} selected text(s)...`;
      setGeneratedTexts(prev => ({
        ...prev,
        [tab.id]: [newText, ...(prev[tab.id] || [])],
      }));
    }

    setIsGlobalGenerating(false);
  };
  const handleDownloadAll = () => {
    setIsDownloading(true);

    try {
      // Create content with sections for each tab
      const content = TABS.map(tab => {
        const tabTexts = generatedTexts[tab.id] || [];

        if (tabTexts.length === 0) return '';

        return `
  # ${tab.label}
  ${'-'.repeat(tab.label.length)}
  
  ${tabTexts.map((text, index) => `[Generation ${index + 1}]\n${text}\n\n`).join('\n')}`;
      })
        .filter(Boolean)
        .join('\n\n\n\n')
        .trim();

      // Prevent downloading an empty file
      if (!content) {
        console.warn('No content available to download.');
        setIsDownloading(false);
        return;
      }

      // Create and download file
      const blob = new Blob([content], { type: 'application/octet-stream' }); // Forces download
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-texts-${new Date().toISOString().slice(0, 10)}.txt`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Prevent memory leak by revoking the URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentTagId = TABS.find(tab => tab.id === activeTab)?.tagId || null;

  // Load texts automatically when tab changes
  React.useEffect(() => {
    if (!currentTagId) return;

    // Reset any previous selections
    savedTexts.forEach(text => {
      if (text.usedInPrompt) {
        markTextAsUsed(text.id, false);
      }
    });

    // Get texts for current tag and add to prompt
    const textsForTag = savedTexts.filter(text => text.tags.includes(currentTagId));
    const newPrompt = textsForTag.map(text => text.content).join('\n\n');

    // Mark selected texts as used
    textsForTag.forEach(text => {
      markTextAsUsed(text.id, true);
    });

    setPrompt(newPrompt);
  }, [activeTab, currentTagId]);
  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setNotification({ show: false, message: '', type: 'success' });

    // Get useReasoning value from form
    const useReasoning = prompt.includes('# Reasoning Mode\n--------------\n\nEnabled');

    // Get language instruction
    const language = LANGUAGES.find(l => l.code === selectedLanguage);
    // const languageInstruction = language
    //   ? useDialect
    //     ? `Language: ${language.code}\nUse natural ${language.name} with ${
    //         language.code === 'pt' ? 'Brazilian Portuguese' : 'local dialect'
    //       } and common expressions`
    //     : `Language: ${language.code}\nUse standard formal ${
    //         language.code === 'pt' ? 'European Portuguese' : language.name
    //       }`
    //   : '';

    // Add product name and language instruction to prompt
    // let fullPrompt = `${languageInstruction}\n# Product: ${
    //   productName || 'Non spécifié'
    // }\n\n${prompt}`;
    let fullPrompt = '';

    try {
      const { data } = await storePromptCategories();
      if (data) {
        let developerPrompt = '';
        const promptValue = PROMPT_TEMPLATES[activeTab];
        if (
          activeTab === 'ad-copy' ||
          activeTab === 'customer-reviews' ||
          activeTab === 'landing-page'
        ) {
          developerPrompt = data['Content Generation'].prompts[promptValue];
        } else {
          developerPrompt = data['Voice Over'].prompts[promptValue];
        }
        const updatedPrompt = developerPrompt
          .replace(/\[user_language\]/g, language.name)
          .replace(/\[user_local_dialect\]/g, language.name)
          .replace(/\[user_marketing_angles\]/g, marketingSelections.angle)
          .replace(/\[user_problems_solved\]/g, marketingSelections.problem)
          .replace(/\[user_brand_names\]/g, marketingSelections.brandName)
          .replace(/\[user_pain_point\]/g, marketingSelections.painPoint)
          .replace(/\[user_country\]/g, product.country)
          .replace(/\[user_store_name\]/g, product.store)
          .replace(/\[user_product_name\]/g, productName)
          .replace(/\[user_saleing_price\]/g, product?.price?.salePrice || '');
        fullPrompt = `${prompt}\n\n${updatedPrompt}`;
      }
    } catch {
      console.log('There is some error while getting the prompts from db.');
    }
    try {
      const response = await generateText(fullPrompt, 'deepseek-chat', useReasoning);
      const tokenData = {
        usedTokens: tokenStats.usedTokens + response.totalTokens,
        remainingTokens: tokenStats.remainingTokens - response.totalTokens,
      };

      // // Update token stats
      // setTokenStats(prev => ({
      //   usedTokens: prev.usedTokens + response.totalTokens,
      //   remainingTokens: prev.remainingTokens - response.totalTokens,
      // }));

      // If reasoning content is available, prepend it to the output
      let outputText = response.text;
      if (response.reasoning_content) {
        outputText = `Chain of Thought:\n${'-'.repeat(16)}\n${
          response.reasoning_content
        }\n\nFinal Output:\n${'-'.repeat(12)}\n${response.text}`;
      }

      // Update outputs
      setOutputs(prev => ({
        ...prev,
        [activeTab]: outputText,
      }));

      // Step 1: Create updated data for the current tab
      const updatedTabTexts = [outputText, ...(generatedTexts[activeTab] || [])];

      // Step 2: Create the updated state object
      const updatedGeneratedTexts = {
        ...generatedTexts,
        [activeTab]: updatedTabTexts,
      };

      setGeneratedTexts(prev => ({
        ...prev,
        [activeTab]: [outputText, ...(prev[activeTab] || [])],
      }));

      // Step 3: Update the backend and state with the prepared data
      if (Object.keys(generatedTexts).length <= 0) {
        await createAiText(product.id, {
          text: updatedGeneratedTexts,
          type: 'deepSeek',
          adminPrompts: [],
          tokenStats: tokenData,
        });
      } else {
        await updateAiText(product.id, {
          text: updatedGeneratedTexts,
          type: 'deepSeek',
          tokenStats: tokenData,
        });
      }

      setGeneratedTexts(updatedGeneratedTexts);
      return true;
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during text generation. Please try again.';

      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Text generation failed',
        type: 'error',
      });
      return false;
      // Don't clear existing outputs/texts on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelect = (newPrompt: string, id: string) => {
    setPrompt(newPrompt);
    markTextAsUsed(id, !savedTexts.find(text => text.id === id)?.usedInPrompt);
  };

  useEffect(() => {
    if (isChecked) {
      const titles = product?.generatedText?.map(obj => obj.title).join(' ');
      setPrompt(titles);
    } else {
      setPrompt('');
    }
  }, [isChecked]);

  useEffect(() => {
    // to resolve build issue please check this
    // const fetchAiText = async () => {
    //   const data = await getAiText(product.id);
    //   setGeneratedTexts(data?.[0]?.text || {});
    //   setTokenStats(
    //     data?.[0]?.tokenStats || {
    //       usedTokens: 0,
    //       remainingTokens: 1000000,
    //     }
    //   );
    // };
    const fetchAiText = async () => {
      const data: any = await getAiText(product.id);
      setGeneratedTexts(data?.[0]?.text || {});
      setTokenStats(
        data[0]?.tokenStats || {
          usedTokens: 0,
          remainingTokens: 1000000,
        }
      );
    };
    fetchAiText();
  }, []);
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gradient-to-r from-[#6E3FC3] to-[#B070FF] shadow-lg relative">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white" />
            <h1 className="text-lg font-semibold text-white">AI Text Generator</h1>
            {/* <div className="ml-6">
              <input
                type="text"
                value={productName}
                disabled
                // onChange={e => setProductName(e.target.value)}
                placeholder="Product name..."
                className="px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white placeholder-white/50 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all w-64"
              />
            </div> */}
          </div>
          <div className="flex items-center gap-3">
            {/* Language Controls */}
            <div className="flex items-center gap-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-white/80" />
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value)}
                    className="bg-white/90 backdrop-blur-sm text-gray-900 border border-white/20 rounded-lg pl-3 pr-10 py-1.5 text-sm focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all appearance-none"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <Languages className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <label className="flex items-center gap-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={useDialect}
                  onChange={e => setUseDialect(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-[#5D1C83] focus:ring-[#5D1C83] transition-all"
                />
                Use Local Dialect
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all"
              >
                <Settings className="w-4 h-4" />
                Admin Prompts
              </button>
              <button
                onClick={handleGlobalGenerate}
                disabled={
                  isGlobalGenerating ||
                  !TABS.some(tab => {
                    const tabTexts = savedTexts.filter(text => text.tags.includes(tab.tagId || ''));
                    return tabTexts.some(text => text.usedInPrompt);
                  })
                }
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-[#6E3FC3] rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Wand className="w-4 h-4" />
                {isGlobalGenerating ? 'Generating All...' : 'Generate All'}
                <span className="text-xs text-green-500 ml-1">
                  {tokenStats.remainingTokens.toLocaleString()} tokens
                </span>
              </button>
              {Object.values(generatedTexts).some(texts => texts.length > 0) && (
                <button
                  onClick={handleDownloadAll}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-[#6E3FC3] rounded-lg hover:bg-white/90 transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  {isDownloading ? 'Downloading...' : 'Download All'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Marketing Lists */}
        <div className="-mt-3 border-t border-white/10">
          {!showMarketingLists && hasGeneratedLists && (
            <div className="px-6 py-2 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white/50">Marketing Angle:</span>
                {marketingSelections.angle ? (
                  <span className="text-white/90 font-medium truncate max-w-[150px]">
                    {marketingSelections.angle}
                  </span>
                ) : (
                  <span className="text-red-400 text-[10px]">Not selected</span>
                )}
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-white/50">Problem:</span>
                {marketingSelections.problem ? (
                  <span className="text-white/90 font-medium truncate max-w-[150px]">
                    {marketingSelections.problem}
                  </span>
                ) : (
                  <span className="text-red-400 text-[10px]">Not selected</span>
                )}
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-white/50">Pain Point:</span>
                {marketingSelections.painPoint ? (
                  <span className="text-white/90 font-medium truncate max-w-[150px]">
                    {marketingSelections.painPoint}
                  </span>
                ) : (
                  <span className="text-red-400 text-[10px]">Not selected</span>
                )}
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-white/50">Brand Name:</span>
                {marketingSelections.brandName ? (
                  <span className="text-white/90 font-medium truncate max-w-[150px]">
                    {marketingSelections.brandName}
                  </span>
                ) : (
                  <span className="text-red-400 text-[10px]">Not selected</span>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => setShowMarketingLists(!showMarketingLists)}
            className="w-full flex items-center justify-center py-3 text-white/90 hover:text-white transition-colors group"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                showMarketingLists ? 'rotate-180' : ''
              } group-hover:scale-110`}
            />
          </button>
          {showMarketingLists && (
            <div className="px-4 pb-4">
              <MarketingLists
                productName={productName}
                onSelectionsChange={setMarketingSelections}
                onGenerated={() => setHasGeneratedLists(true)}
                selectedLanguage={selectedLanguage}
              />
            </div>
          )}
        </div>

        {showAdmin ? (
          <AdminPrompts
            onClose={() => setShowAdmin(false)}
            generatedTexts={generateText}
            product={product}
          />
        ) : (
          hasGeneratedLists && (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-1">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-[#6E3FC3]'
                        : 'text-white/90 hover:bg-white/10 relative'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="flex items-center gap-2">
                      {tab.label}
                      <span
                        className={`px-1.5 py-0.5 text-xs rounded-full ${
                          activeTab === tab.id
                            ? 'bg-[#6E3FC3] text-white'
                            : 'bg-white/20 text-white'
                        }`}
                      >
                        {getTabCount(tab.tagId)}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex-1 p-6 space-y-6">
        {hasGeneratedLists ? (
          <>
            <div className="flex justify-end gap-2">
              <input
                className="cursor-pointer"
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <p>All Text in Text Library</p>
            </div>
            {!isChecked && (
              <SavedTextsList
                selectedTag={currentTagId}
                onTextSelect={handleTextSelect}
                currentPrompt={prompt}
                product={product}
              />
            )}
            <AiPromptForm
              onSubmit={handleGenerate}
              isLoading={isLoading}
              value={prompt}
              customPrompt={customPrompt}
              onChange={setPrompt}
              onCustomPromptChange={setCustomPrompt}
              activeTab={activeTab}
              isChecked={isChecked}
              product={product}
            />
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Generate marketing lists above to start creating AI-powered content
          </div>
        )}
        {outputs[activeTab] && <LatestGeneration tabId={activeTab} output={outputs[activeTab]} />}

        {/* Generated texts history */}
        {currentTabGenerations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-700">Generated History</h2>
              <span className="text-sm text-gray-500">
                {currentTabGenerations.length} generation
                {currentTabGenerations.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {currentTabGenerations.map((text, index) => (
                <GeneratedTextPreview
                  key={index}
                  text={text}
                  index={index}
                  total={currentTabGenerations.length}
                  tabId={activeTab}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
