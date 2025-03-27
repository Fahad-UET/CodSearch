import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Settings } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
  onUseOpenAIChange: (useOpenAI: boolean) => void;
  useOpenAI: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  onApiKeyChange,
  onUseOpenAIChange,
  useOpenAI
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApiKeyChange(apiKey);
  };

  const toggleProvider = () => {
    onUseOpenAIChange(!useOpenAI);
    setApiKey('');
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">
          API Configuration
        </h3>
        <Button
          onClick={() => setShowSettings(!showSettings)}
          variant="ghost"
          size="sm"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {showSettings && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">
              Current Provider: {useOpenAI ? 'OpenAI' : 'DeepSeek'}
            </span>
            <Button
              onClick={toggleProvider}
              variant="outline"
              size="sm"
            >
              Switch to {useOpenAI ? 'DeepSeek' : 'OpenAI'}
            </Button>
          </div>

          {useOpenAI && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <Button type="submit" className="w-full">
                Save API Key
              </Button>
            </form>
          )}

          {!useOpenAI && (
            <div className="text-sm text-gray-600">
              Using default DeepSeek API configuration
            </div>
          )}
        </div>
      )}
    </div>
  );
};