import React, { useEffect, useState } from 'react';
import { Sparkles, FileDown, Copy, Wand, Settings, Key, Languages } from 'lucide-react';
import Modal from './ui/Modal';
import Notification from './ui/Notification';
import GeneratedTextPreview from './ui/GeneratedTextPreview';
import { TABS } from './ui/constant';
import { GPT_MODELS, type GptModel } from './ui/constant';
import LatestGeneration from './ui/LatestGeneration';
import { initializeOpenAI, generateText } from '../../services/openai';
import AdminPrompts from './ui/AdminPrompts';
import SavedTextsList from './SavedTextsList';
import AiPromptForm from './ui/AiPromptForm';
import { MAX_GENERATIONS } from '../AIText/ui/constant';

import { useSavedTextsStore } from '@/store/savedTextStore';
import { createAiText, getEditorAiTextByProductIdAndType } from '@/services/firebase/AITextEditor';
import { getEditorAiTextByProductId } from '@/services/firebase/textEditor';
import { useAiTextStore } from '@/store/aiTextStore';
import { useAdminPromptsStore } from '@/store/adminPromptStore';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  hasDialect: boolean;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', hasDialect: true },
  { code: 'fr', name: 'Français', flag: '🇫🇷', hasDialect: true },
  { code: 'es', name: 'Español', flag: '🇪🇸', hasDialect: true },
  { code: 'en', name: 'English', flag: '🇺🇸', hasDialect: true },
  { code: 'pt', name: 'Português', flag: '🇵🇹', hasDialect: true },
];

export default function AiText({
  activeTabParent,
  product,
}: {
  activeTabParent: any;
  product: any;
}) {
  const { aiTextSt, setAiTextSt } = useAiTextStore();
  const { adminPrompts, setAdminPrompts } = useAdminPromptsStore();
  const [outputs, setOutputs] = React.useState<Record<string, string>>({});
  const [generatedTexts, setGeneratedTexts] = React.useState<Record<string, string[]>>({});
  const [generationCount, setGenerationCount] = React.useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [customPrompt, setCustomPrompt] = React.useState('');
  const [activeTab, setActiveTab] = React.useState(activeTabParent);
  const { savedTexts, markTextAsUsed, setSavedTexts } = useSavedTextsStore();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [showAdmin, setShowAdmin] = React.useState(false);
  const [isGlobalGenerating, setIsGlobalGenerating] = React.useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = React.useState(false);
  const [apiKey, setApiKey] = React.useState(() => localStorage.getItem('openai_api_key') || '');
  // to resolve build issue please check this
  // const [selectedModel, setSelectedModel] = React.useState<GptModel>('gpt-4-0125-preview');
  const [selectedModel, setSelectedModel] = React.useState<GptModel>('o1-mini');
  const [notification, setNotification] = React.useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>('ar');
  const [useDialect, setUseDialect] = React.useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = event => {
    setIsChecked(event.target.checked);
  };

  const getTabCount = (tagId: string | undefined) => {
    if (!tagId) return 0; // Return 0 if tagId is undefined or null

    // Ensure product?.generatedText is defined and is an array
    const generatedTextArray = Array.isArray(product?.generatedText) ? product.generatedText : [];

    const filteredTexts = generatedTextArray.filter(text => {
      return text?.tags?.includes(tagId); // Return true if the text.type includes tagId
    });

    return filteredTexts.length; // Return the count of matching items
  };

  const currentTabGenerations = generatedTexts[activeTab] || [];
  const currentTabCount = generationCount[activeTab] || 0;
  const handleGlobalGenerate = async () => {
    setIsGlobalGenerating(true);

    // Check if there's any text selected for the current tab
    const hasSelectedText = TABS.some(tab => {
      const tabTexts = product?.generatedText?.filter(text => text.tags.includes(tab.tagId || ''));
      return tabTexts.some(text => text.usedInPrompt);
    });

    if (!hasSelectedText) {
      setIsGlobalGenerating(false);
      return;
    }

    for (const tab of TABS) {
      // Get texts for current tab
      const tabTexts = product?.generatedText?.filter(text => text.tags.includes(tab.tagId || ''));
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
        .join('\n\n\n\n');

      // Create and download file
      const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-texts-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
    product?.generatedText?.forEach(text => {
      if (text.usedInPrompt) {
        markTextAsUsed(text.id, false);
      }
    });

    // Get texts for the current tag and add to prompt
    const textsForTag = product?.generatedText?.filter(text => text.tags.includes(activeTab));
    const newPrompt = textsForTag?.map(text => text?.title || text?.content).join('\n\n');

    // Mark selected texts as used
    textsForTag?.forEach(text => {
      markTextAsUsed(text.id, true);
    });
    setPrompt(newPrompt);
  }, [activeTab, currentTagId]);

  const handleGenerate = async () => {
    if (currentTabCount >= MAX_GENERATIONS) {
      return;
    }
    setIsLoading(true);

    try {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        throw new Error('Please set your OpenAI API key first');
      }

      initializeOpenAI(apiKey);
      // @ts-ignore
      const findAdminPrompt = adminPrompts.filter(item => item.type === activeTab);

      // Get language instruction
      const language = LANGUAGES.find(l => l.code === selectedLanguage);
      const languageInstruction = language
        ? useDialect
          ? `Language: ${language.code}\nUse natural ${language.name} with ${
              language.code === 'pt' ? 'Brazilian Portuguese' : 'local dialect'
            } and common expressions`
          : `Language: ${language.code}\nUse standard formal ${
              language.code === 'pt' ? 'European Portuguese' : language.name
            }`
        : '';

      // @ts-ignore
      const string = `${prompt} ${findAdminPrompt[0]?.prompt} ${languageInstruction}`;
      const newText = await generateText(string, selectedModel);

      const uniqueId = `text-${crypto.randomUUID()}`;
      const data = {
        id: uniqueId,
        productId: product.id,
        type: activeTab,
        text: newText,
      };

      const dataUpdated = await createAiText(data);

      setOutputs(prev => ({
        ...prev,
        [activeTab]: newText,
      }));
      setAiTextSt(dataUpdated);

      setGeneratedTexts(prev => ({
        ...prev,
        [activeTab]: [newText, ...(prev[activeTab] || [])],
      }));

      // Save to localStorage for sharing with Voice Over component
      localStorage.setItem(
        'generatedTexts',
        JSON.stringify({
          ...generatedTexts,
          [activeTab]: [newText, ...(generatedTexts[activeTab] || [])],
        })
      );

      setGenerationCount(prev => ({
        ...prev,
        [activeTab]: (prev[activeTab] || 0) + 1,
      }));
      return true;
    } catch (error) {
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : 'Text generation failed',
        type: 'error',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelect = (newPrompt: string, id: string) => {
    setPrompt(prevPrompt => {
      if (prevPrompt?.includes(newPrompt)) {
        // Remove the newPrompt if it already exists in the prevPrompt

        const updatedPrompt = prevPrompt
          .split(' ')
          .filter(word => {
            word !== newPrompt;
          })
          .join(' ');
        return updatedPrompt;
      }
      // Add the newPrompt if it doesn't exist in the prevPrompt
      return prevPrompt ? `${prevPrompt} ${newPrompt}` : newPrompt;
    });

    markTextAsUsed(id, !product?.generatedText?.find(text => text.id === id)?.usedInPrompt);
  };

  useEffect(() => {
    if (activeTabParent === 'aiText') {
      setActiveTab('ad-copy');
    } else {
      setActiveTab(activeTabParent);
    }
  }, [activeTabParent]);

  const transformData = data => {
    return data.reduce((acc, { type, text }) => {
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(text);
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchAndTransformData = async () => {
      try {
        const dataToTransform = await getEditorAiTextByProductIdAndType(product.id, activeTab);

        const transformedData = transformData(dataToTransform);

        setGeneratedTexts(transformedData);
      } catch (error) {
        console.error('Error fetching or transforming data:', error);
      }
    };

    fetchAndTransformData();
  }, [activeTab, product.id]);

  const aiTextItems = [
    { value: 'ad-copy', label: 'Ad Copy AI', count: getTabCount('ad-copy') },
    { value: 'customer-review', label: 'Customer Reviews', count: getTabCount('customer-review') },
    { value: 'landing-page', label: 'Landing Page Text', count: getTabCount('landing-page') },
    {
      value: 'voice-over-review',
      label: 'Review Voice Over',
      count: getTabCount('voice-over-review'),
    },
    {
      value: 'voice-over-creative',
      label: 'Creative Voice Over',
      count: getTabCount('voice-over-creative'),
    },
  ];

  useEffect(() => {
    if (isChecked) {
      const titles = product?.generatedText?.map(obj => obj.title).join(' ');
      setPrompt(titles);
    } else {
      setPrompt('');
    }
  }, [isChecked]);
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="bg-gradient-to-r from-[#6E3FC3] to-[#B070FF] shadow-lg">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-white" />
            <h1 className="text-lg font-semibold text-white">AI Text Generator</h1>
          </div>

          <div className="flex items-center gap-3">
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
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg transition-all hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
              Admin Prompts
            </button>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg transition-all hover:bg-gray-800"
            >
              <Key className="w-4 h-4" />
              API Key
            </button>
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value as GptModel)}
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg transition-all hover:bg-gray-800 focus:ring-2 focus:ring-white/20 focus:outline-none"
            >
              {GPT_MODELS.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleGlobalGenerate}
              disabled={
                isGlobalGenerating ||
                !TABS.some(tab => {
                  const tabTexts = product?.generatedText?.filter(text =>
                    text.tags.includes(tab.tagId || '')
                  );
                  return tabTexts?.some(text => text.usedInPrompt);
                })
              }
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-[#6E3FC3] rounded-lg transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Wand className="w-4 h-4" />
              {isGlobalGenerating ? 'Generating All...' : 'Generate All'}
            </button>
            {Object.values(generatedTexts).some(texts => texts.length > 0) && (
              <button
                onClick={handleDownloadAll}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white text-[#6E3FC3] rounded-lg transition-all hover:bg-white/90 shadow-lg hover:shadow-xl"
              >
                <FileDown className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download All'}
              </button>
            )}
          </div>
        </div>

        {activeTabParent === 'aiText' &&
          (activeTab === 'voice-over-review' ||
            activeTab === 'ad-copy' ||
            activeTab === 'customer-review' ||
            activeTab === 'voice-over-creative' ||
            activeTab === 'landing-page') && (
            <div className="flex">
              {aiTextItems?.map((tab, i) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                    activeTab === tab.value
                      ? 'bg-white text-[#6E3FC3]'
                      : 'text-white/90 hover:bg-white/10 relative'
                  }`}
                >
                  {/* Optional Icon Rendering */}
                  {/* <tab.icon className="w-4 h-4" /> */}

                  <span className="flex items-center gap-2">
                    {tab.label}
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded-full ${
                        activeTab === tab.value
                          ? 'bg-[#6E3FC3] text-white'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {getTabCount(tab.value)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

        {showAdmin && (
          <AdminPrompts onClose={() => setShowAdmin(false)} product={product} tab={activeTab} />
        )}
      </div>

      {/* API Key Modal */}
      <Modal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        title="OpenAI API Key"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Enter your OpenAI API key to enable text generation features. Your key will be stored
            locally.
          </p>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              placeholder="sk-..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                localStorage.setItem('openai_api_key', apiKey);
                setShowApiKeyModal(false);
              }}
              className="px-4 py-2 text-sm bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93]"
            >
              Save Key
            </button>
          </div>
        </div>
      </Modal>

      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-end gap-2">
          <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          <p>All Text in Text Library</p>
        </div>
        {!isChecked && (
          <SavedTextsList
            selectedTag={activeTab}
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
          maxGenerations={MAX_GENERATIONS}
          generationCount={currentTabCount}
          isChecked={isChecked}
          product={product}
        />
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
