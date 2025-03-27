import React, { useEffect } from 'react';
import { Mic, FileDown, Copy, Wand, Settings, Key } from 'lucide-react';
import Modal from '../AIText/ui/Modal';
import { VoiceTabs, TABS_Voice } from '../AIText/ui/constant';
// import AdminPrompts from '../AIText/ui/AdminPrompts';
import { MAX_GENERATIONS } from '../AIText/ui/constant';
import GeneratedTextsList from './GeneratedTextsList';
import SavedTextsList from '../AIText/SavedTextsList';
import VoiceOverForm from './VoiceOverForm';
import VoiceOverOutput from './VoiceOverOutput';
import { generateVoiceOver } from '../../services/elevenlabs';
import { ElevenLabsError } from '../../types';
import type { VoiceSettings } from '../../types';
import Notification from '../AIText/ui/Notification';
import { useSavedTextsStore } from '@/store/savedTextStore';
import { getEditorAiTextByProductIdAndType } from '@/services/firebase/AITextEditor';
import GeneratedTextPreview from '../AIText/ui/GeneratedTextPreview';

const VOICE_OVER_TABS = VoiceTabs.filter(
  tab => tab.id === 'customerReviews' || tab.id === 'creatives'
);

export default function AiVoiceOver({
  activeTabParent,
  product,
}: {
  activeTabParent: string;
  product: any;
}) {
  const [output, setOutput] = React.useState<string>('');
  const [generatedAudio, setGeneratedAudio] = React.useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [prompt, setPrompt] = React.useState<string>('');
  const [activeTab, setActiveTab] = React.useState(VOICE_OVER_TABS[0].id);
  const [generationCount, setGenerationCount] = React.useState<Record<string, number>>({});
  const { savedTexts, markTextAsUsed } = useSavedTextsStore();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = React.useState(false);
  const [apiKey, setApiKey] = React.useState(
    () => localStorage.getItem('elevenlabs_api_key') || ''
  );
  const [apiKeyChanged, setApiKeyChanged] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const [generatedTexts, setGeneratedTexts] = React.useState<Record<string, string[]>>(() => {
    try {
      const savedTexts = localStorage.getItem('generatedTexts');
      if (savedTexts) {
        const texts = JSON.parse(savedTexts);
        return texts;
      }
      return {};
    } catch {
      return {};
    }
  });
  const [generatedText, setGeneratedText] = React.useState<string | null>(null);
  const checkType =
    activeTab === 'creatives'
      ? 'voice-over-creative'
      : activeTab === 'customerReviews'
      ? 'voice-over-review'
      : '';

  const checkTypeCreativesCat = {
    creatives: 'Creatives',
    customerReviews: 'Customer Reviews',
  };
  // Update texts when localStorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      const savedTexts = localStorage.getItem('generatedTexts');
      try {
        const texts = savedTexts ? JSON.parse(savedTexts) : {};
        setGeneratedTexts(texts);
      } catch (error) {
        console.error('Error loading generated texts:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange(); // Call immediately to load initial texts
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [activeTab]);
  useEffect(() => {
    setActiveTab(activeTabParent);
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
      let type =
        activeTab === 'creatives'
          ? 'voice-over-creative'
          : activeTab === 'customerReviews'
          ? 'voice-over-review'
          : '';
      try {
        const dataToTransform = await getEditorAiTextByProductIdAndType(product.id, type);
        const transformedData = transformData(dataToTransform);

        setGeneratedTexts(transformedData);
      } catch (error) {
        console.error('Error fetching or transforming data:', error);
      }
    };

    fetchAndTransformData();
  }, [activeTab, product.id]);
  const getTabCount = (tagId: string | undefined) => {
    if (!tagId) return 0;
    return savedTexts.filter(text => text.tags.includes(tagId)).length;
  };

  const currentTabGenerations = generatedAudio['voice-over-creative'] || [];
  const currentTabCount = generationCount['voice-over-creative'] || 0;

  const currentTabGenerationsText = generatedTexts[checkType] || [];
  const handleGenerate = async (text: string, voiceId: string, settings: VoiceSettings) => {
    if (currentTabCount >= MAX_GENERATIONS) return;

    setIsLoading(true);
    try {
      // Generate voice over
      // to resolve build issue please check this
      // const audioBuffer = await generateVoiceOver(text, voiceId, settings);
      const audioBuffer = await generateVoiceOver(apiKey, text, voiceId, settings);

      // Convert ArrayBuffer to Blob
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

      // Update state
      setGeneratedText(text);
      setOutput(audioUrl);
      setGeneratedAudio(prev => ({
        ...prev,
        [activeTab]: [audioUrl, ...(prev[activeTab] || [])],
      }));
      setGenerationCount(prev => ({
        ...prev,
        [activeTab]: (prev[activeTab] || 0) + 1,
      }));

      setNotification({
        show: true,
        message: 'Voice generated successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Voice generation failed:', error);
      if (error instanceof ElevenLabsError) {
        // Handle specific ElevenLabs errors
        setNotification({
          show: true,
          message: error.message,
          type: 'error',
        });
      } else {
        setNotification({
          show: true,
          message: 'Voice generation failed. Please try again.',
          type: 'error',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSelect = (newPrompt: string, id: string) => {
    setPrompt(newPrompt);
    markTextAsUsed(id, !savedTexts.find(text => text.id === id)?.usedInPrompt);
  };

  const currentTagId = VOICE_OVER_TABS.find(tab => tab.id === activeTab)?.tagId || null;

  // Load texts automatically when tab changes
  React.useEffect(() => {
    if (!currentTagId) return;

    savedTexts.forEach(text => {
      markTextAsUsed(text.id, false);
    });
    setPrompt('');
  }, [activeTab, currentTagId]);

  return (
    <>
      <div className="flex items-center justify-between px-2 bg-blue-600 pt-10 pb-1">
        <div className="flex items-center gap-1">
          {TABS_Voice?.map(tab => (
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
                    activeTab === tab.id ? 'bg-[#6E3FC3] text-white' : 'bg-white/20 text-white'
                  }`}
                >
                  {getTabCount(tab.tagId)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-full flex flex-col bg-white">
        <div className="">
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-white" />
              <h1 className="text-lg font-semibold text-white">AI Voice Over</h1>
            </div>
          </div>

          <h1 className="px-7 mb-2 text-[18px] font-semibold">
            {checkTypeCreativesCat[activeTab]} Generated Text
          </h1>
          <div className="space-y-3 px-7">
            {currentTabGenerationsText.map((text, index) => (
              <GeneratedTextPreview
                key={index}
                text={text}
                index={index}
                total={currentTabGenerationsText.length}
                tabId={activeTab}
              />
            ))}
          </div>
          {/* <div className="flex items-center gap-1 px-2">
            {VOICE_OVER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab.id ? 'bg-white text-[#2980B9]' : 'text-white/90 hover:bg-white/10'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span
                    className={`px-1.5 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-[#2980B9] text-white' : 'bg-white/20 text-white'
                      }`}
                  >
                    {getTabCount(tab.tagId)}
                  </span>
                </span>
              </button>
            ))}
          </div> */}
        </div>

        {/* API Key Modal */}
        {/* <Modal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          title="ElevenLabs API Key"
        >
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              Enter your ElevenLabs API key to enable voice generation features. Your key will be
              stored locally.
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2980B9] focus:border-[#2980B9]"
                placeholder="Enter your ElevenLabs API key..."
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
                  localStorage.setItem('elevenlabs_api_key', apiKey);
                  setApiKeyChanged(!apiKeyChanged);
                  setShowApiKeyModal(false);
                }}
                className="px-4 py-2 text-sm bg-[#2980B9] text-white rounded-lg hover:bg-[#3498DB]"
              >
                Save Key
              </button>
            </div>
          </div>
        </Modal> */}

        <div className="flex-1 p-6 space-y-6">
          {generatedTexts[activeTab]?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-700">
                  Generated {activeTab === 'customerReviews' ? 'Review' : 'Creative'} Voice Texts
                </h2>
                <span className="text-sm text-gray-500">
                  {generatedTexts[activeTab].length} text
                  {generatedTexts[activeTab].length !== 1 ? 's' : ''}
                </span>
              </div>

              <GeneratedTextsList
                texts={generatedTexts[activeTab]}
                onSelect={text => setPrompt(text)}
                selectedText={prompt}
              />
            </div>
          )}

          <VoiceOverForm
            onSubmit={handleGenerate}
            isLoading={isLoading}
            output={output}
            value={prompt}
            onChange={setPrompt}
            activeTab={activeTab}
            generationCount={currentTabCount}
            maxGenerations={MAX_GENERATIONS}
          />
          <VoiceOverOutput output={output} generatedAudio={generatedAudio} activeTab={activeTab} />

          {/* Notification */}
          {notification.show && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            />
          )}
        </div>
      </div>
    </>
  );
}
