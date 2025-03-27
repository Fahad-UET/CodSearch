import React from 'react';
import { TextGeneration } from './text/TextGeneration';
import { VoiceGeneration } from './voice/VoiceGeneration';
import { ApiKeySection } from './common/ApiKeySection';

export const AiGenerationTab = () => {
  // to resolve build issue please check this these two apiKeys remove or change thi
  const voiceapiKey = import.meta.env.VITE_ELEVENLABS_API_KEY
  const textapiKey = import.meta.env.VITE_OPENAI_API_KEY
  return (
    <div className="space-y-6 p-4">
      <ApiKeySection />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Text Generation</h3>
          {/* // to resolve build issue please check this */}
          {/* <TextGeneration /> */}
          <TextGeneration apiKey={textapiKey} />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Voice Generation</h3>
          {/* <VoiceGeneration /> */}
          <VoiceGeneration apiKey={voiceapiKey}  />
        </div>
      </div>
    </div>
  );
};