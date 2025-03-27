import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { VoiceSettings } from './VoiceSettings';
import { AudioPlayer } from './AudioPlayer';
import { generateVoiceOver } from '@/services/elevenlabs';
import { useToast } from '@/hooks/useToast';

export const VoiceOverTab = () => {
  const [apiKey, setApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [settings, setSettings] = useState({
    stability: 0.5,
    similarity: 0.75,
    speed: 1,
  });
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<any>(null);

  const texts = [
    {
      id: '1',
      content: 'Product introduction for summer collection',
      tags: ['product', 'summer']
    },
    {
      id: '2',
      content: 'Special discount announcement',
      tags: ['promotion', 'sales']
    },
    // Add more sample texts here
  ];

  const { showToast } = useToast();

  const handleTextChange = (content: string) => {
    setPrompt(content);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      showToast('Please enter your ElevenLabs API key', 'error');
      return;
    }

    if (!prompt) {
      showToast('Please enter some text to convert', 'error');
      return;
    }

    if (prompt.length > 5000) {
      showToast('Text is too long. Maximum length is 5000 characters.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const audio: any = await generateVoiceOver(apiKey, prompt, selectedVoice, settings);
      
      setAudioUrl(URL.createObjectURL(audio));
    } catch (error) {
      showToast('Failed to generate voice. Please check your API key.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'generated-voice.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Select Text for Voice-over
        </h3>
        <select
          value={prompt}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full p-2 border rounded-md bg-white shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Select a text...</option>
          {texts.map(text => (
            <option key={text.id} value={text.content}>
              {text.content}
            </option>
          ))}
        </select>

        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="w-full h-32 p-3 border rounded-md resize-none"
        />
        
        <button
          onClick={handleGenerate}
          disabled={isLoading || !apiKey || !prompt}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Volume2 size={16} />
          {isLoading ? 'Generating...' : 'Generate Voice'}
        </button>
      </div>

      <VoiceSettings
        // apiKey={apiKey}
        // onApiKeyChange={setApiKey}
        // voice={selectedVoice}
        // onVoiceChange={setSelectedVoice}
        // settings={settings}
        // onSettingsChange={setSettings}
      />

      <AudioPlayer 
        audioUrl={audioUrl}
        onDownload={handleDownload}
      />
    </div>
  );
};