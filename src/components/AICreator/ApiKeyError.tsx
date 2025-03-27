import React from 'react';
import { Key, ExternalLink } from 'lucide-react';

interface ApiKeyErrorProps {
  error?: string;
}

function ApiKeyError({ error }: ApiKeyErrorProps) {
  return (
    <div className="mt-6 p-6 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-800/50 rounded-lg">
          <Key className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">API Key Required</h3>
          {error && <p className="mb-4 text-red-300">{error}</p>}
          <p className="mb-4">
            To use this feature, you need to set up your ElevenLabs API key. Follow these steps:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>
              Visit{' '}
              <a
                href="https://elevenlabs.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-300 hover:text-red-200 underline inline-flex items-center gap-1"
              >
                elevenlabs.io <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and create an account
            </li>
            <li>Generate an API key from your dashboard</li>
            <li>
              Create a <code className="px-2 py-1 bg-red-800/50 rounded">.env</code> file in the
              project root
            </li>
            <li>
              Add your API key:{' '}
              <code className="px-2 py-1 bg-red-800/50 rounded">
                VITE_ELEVENLABS_API_KEY=your_api_key_here
              </code>
            </li>
            <li>Restart the development server</li>
          </ol>
          <p className="text-sm text-red-300">
            Note: Keep your API key secure and never commit it to version control.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyError;
