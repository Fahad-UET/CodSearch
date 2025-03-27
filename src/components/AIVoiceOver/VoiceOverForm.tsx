import React, { useState } from 'react';
import { Wand2, AlertCircle, Plus, Volume2, Check, FileDown } from 'lucide-react';
import VoiceParameters from './VoiceParameters';
import { initializeElevenLabs } from '../../services/elevenlabs';
import type { VoiceSettings } from '../../types';

interface Props {
  onSubmit: (prompt: string, voiceId: string, settings: VoiceSettings) => void;
  value: string;
  output?: string;
  activeTab: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  generationCount: number;
  maxGenerations: number;
}

import VoiceSelector from './VoiceSelector';

export default function VoiceOverForm({
  onSubmit,
  isLoading,
  output,
  value,
  onChange,
  activeTab,
  generationCount,
  maxGenerations,
}: Props) {
  const [selectedVoice, setSelectedVoice] = useState('ErXwobaYiN019PkySvjV'); // Josh by default
  const [selectedVoiceName, setSelectedVoiceName] = useState('Josh');
  const [stability, setStability] = useState(0.5); // Default for multilingual v2
  const [similarityBoost, setSimilarityBoost] = useState(0.75); // Default for multilingual v2
  const [style, setStyle] = useState(0.7); // Default for multilingual v2
  const [speakerBoost, setSpeakerBoost] = useState(true);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<
    'unchecked' | 'verifying' | 'verified' | 'error'
  >('unchecked');

  // Check if API key is configured
  React.useEffect(() => {
    const apiKey = localStorage.getItem('elevenlabs_api_key');
    const verifyApiKey = async () => {
      if (!apiKey) {
        setApiKeyError('Please configure your ElevenLabs API key first');
        setApiKeyStatus('error');
        return;
      }

      setApiKeyStatus('verifying');
      // Verify the API key
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setApiKeyError(null);
          setApiKeyStatus('verified');
        } else {
          setApiKeyError('Invalid API key');
          setApiKeyStatus('error');
        }
      } catch (error) {
        setApiKeyError('Failed to verify API key');
        setApiKeyStatus('error');
      }
    };

    verifyApiKey();
    // Re-verify when API key changes
  }, [localStorage.getItem('elevenlabs_api_key')]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    if (apiKeyStatus !== 'verified') return;

    const apiKey = localStorage.getItem('elevenlabs_api_key');
    if (!apiKey) return;

    initializeElevenLabs(apiKey);

    const settings = {
      stability,
      similarity_boost: similarityBoost,
      style,
      use_speaker_boost: speakerBoost,
      model_id: 'eleven_multilingual_v2', // Explicitly set model
      optimize_streaming_latency: 0, // Best quality for multilingual v2
    };

    // Pass both text and voice ID to parent component
    onSubmit(value, selectedVoice, settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-6">
        {/* Left side: Text input and Latest Generation */}
        <div className="w-1/2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voice Over Text</label>
            <textarea
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-full h-32 px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2980B9] focus:border-[#2980B9] transition-all resize-none"
              placeholder="Enter the text you want to convert to voice..."
            />
          </div>

          {/* Latest Generation */}
          {output && (
            <div className="bg-blue-50/50 rounded-lg border border-blue-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#2980B9]" />
                  <h3 className="font-medium text-[#2980B9]">Latest Generation</h3>
                </div>
                <button
                  onClick={() => {
                    // Handle download
                  }}
                  className="p-1.5 text-[#2980B9] hover:bg-blue-100 rounded-lg transition-all"
                >
                  <FileDown className="w-4 h-4" />
                </button>
              </div>
              <audio controls className="w-full" src={output} />
            </div>
          )}
        </div>

        {/* Right side: Voice selector and parameters */}
        <div className="w-1/2 space-y-4">
          {/* Voice selector */}
          <VoiceSelector
            selectedVoice={selectedVoice}
            onVoiceSelect={(id, name) => {
              setSelectedVoice(id);
              setSelectedVoiceName(name);
            }}
          />

          {/* Voice parameters */}
          <VoiceParameters
            stability={stability}
            similarityBoost={similarityBoost}
            style={style}
            speakerBoost={speakerBoost}
            onStabilityChange={setStability}
            onSimilarityBoostChange={setSimilarityBoost}
            onStyleChange={setStyle}
            onSpeakerBoostChange={setSpeakerBoost}
          />
        </div>
      </div>

      {/* Generate button and status indicators */}
      <div
        className="mt-8 flex items-center justify-end bg-gray-50 p-4 rounded-lg border border-gray-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="submit"
          disabled={
            isLoading ||
            !value.trim() ||
            generationCount >= maxGenerations ||
            apiKeyStatus !== 'verified'
          }
          className="flex items-center gap-2 px-6 py-2.5 bg-[#2980B9] text-white rounded-lg hover:bg-[#3498DB] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            if (
              !isLoading &&
              value.trim() &&
              generationCount < maxGenerations &&
              apiKeyStatus === 'verified'
            ) {
              handleSubmit(e);
            }
          }}
        >
          <Volume2 className="w-4 h-4" />
          {isLoading ? 'Generating...' : 'Generate Voice Over'}
        </button>
      </div>
    </form>
  );
}
