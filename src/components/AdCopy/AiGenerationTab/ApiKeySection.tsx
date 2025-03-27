import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { ApiKeyFormData } from './types';

interface ApiKeySectionProps {
  onSave: (data: ApiKeyFormData) => void;
  initialApiKey?: string;
}

export function ApiKeySection({ onSave, initialApiKey }: ApiKeySectionProps) {
  const [apiKey, setApiKey] = useState(initialApiKey || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ apiKey });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
          OpenAI API Key
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="block w-full pl-10 pr-12 border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="sk-..."
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Save API Key
      </button>
    </form>
  );
}