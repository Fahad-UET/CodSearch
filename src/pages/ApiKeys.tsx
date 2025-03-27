import React from 'react';
import { Key, Save } from 'lucide-react';
import ApiKeyInput from '@/components/ApiKeyInput';
import { useApiKeys } from '@/services/api-keys';

const ApiKeys = () => {
  const { apiKeys, updateApiKey, loading } = useApiKeys();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Key className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-semibold">API Keys</h1>
      </div>

      <div className="space-y-6">
        <ApiKeyInput
          label="OpenAI API"
          name="openai"
          value={apiKeys.openai}
          onChange={value => updateApiKey('openai', value)}
          placeholder="sk-..."
        />

        <ApiKeyInput
          label="Apify"
          name="apify"
          value={apiKeys.apify}
          onChange={value => updateApiKey('apify', value)}
          placeholder="apify_api_..."
        />

        <ApiKeyInput
          label="RapidAPI"
          name="rapidapi"
          value={apiKeys.rapidapi}
          onChange={value => updateApiKey('rapidapi', value)}
          placeholder="Your RapidAPI key"
        />

        <ApiKeyInput
          label="Facebook Ads"
          name="facebook"
          value={apiKeys.facebook}
          onChange={value => updateApiKey('facebook', value)}
          placeholder="Your Facebook Ads API token"
        />

        <ApiKeyInput
          label="COD Network"
          name="codnetwork"
          value={apiKeys.codnetwork}
          onChange={value => updateApiKey('codnetwork', value)}
          placeholder="Your COD Network API key"
        />
      </div>

      {loading && (
        <div className="mt-4 text-sm text-gray-600">
          Saving changes...
        </div>
      )}
    </div>
  );
};

export default ApiKeys;