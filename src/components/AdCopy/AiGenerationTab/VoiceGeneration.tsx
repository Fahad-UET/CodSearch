import React, { useState } from 'react';
import { ApiKeyInput } from './ApiKeyInput';
import { TextArea } from './TextArea';
import { VoiceSettings } from '../../VoiceOverTab/VoiceSettings';
import { AudioPlayer } from '../../VoiceOverTab/AudioPlayer';

export const VoiceGeneration = () => {
  const [apiKey, setApiKey] = useState('');
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateVoice = async () => {
    if (!apiKey || !text) return;
    
    setIsGenerating(true);
    try {
      // Implement voice generation logic here
      // This is a placeholder for the actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAudioUrl('https://example.com/audio.mp3');
    } catch (error) {
      console.error('Failed to generate voice:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* // to resolve build issue please check this */}
      {/* <ApiKeyInput
        onSave={setApiKey}
        initialKey={apiKey}
      /> */}
      <ApiKeyInput
      />

      <VoiceSettings />

      <TextArea
        value={text}
        onChange={setText}
        placeholder="Enter text to convert to speech..."
        rows={3}
      />

      <button
        onClick={handleGenerateVoice}
        disabled={!apiKey || !text || isGenerating}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md
                 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Generate Voice'}
      </button>
      {/* // to resolve build issue please check this */}
      {/* {audioUrl && <AudioPlayer url={audioUrl} />} */}
      {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
    </div>
  );
};