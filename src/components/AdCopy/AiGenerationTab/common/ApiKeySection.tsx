import React from 'react';
import { ApiKeyInput } from './ApiKeyInput';
import { useElevenLabsApi } from '../../../../hooks/useElevenLabsApi';

export const ApiKeySection = () => {
  const { verifyApiKey, isConnected } = useElevenLabsApi();

  const handleSaveElevenLabsKey = async (key: string) => {
    // Save the key to local storage or your preferred storage method
    localStorage.setItem('elevenLabsApiKey', key);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <ApiKeyInput
        label="OpenAI API Key"
        placeholder="Enter your OpenAI API key"
        onSave={async (key) => {
          localStorage.setItem('openAiApiKey', key);
        }}
        onChange={(key) => {
          console.log('OpenAI key changed:', key);
        }}
      />
      
      <ApiKeyInput
        label="ElevenLabs API Key"
        placeholder="Enter your ElevenLabs API key"
        onVerify={verifyApiKey}
        onSave={handleSaveElevenLabsKey}
        onChange={(key) => {
          console.log('ElevenLabs key changed:', key);
        }}
      />
    </div>
  );
};