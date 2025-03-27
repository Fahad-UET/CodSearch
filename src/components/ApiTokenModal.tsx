import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, Save, AlertCircle, Loader2 } from 'lucide-react';
import { codNetworkApi } from '../services/codNetwork/api';

interface ApiTokenModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function ApiTokenModal({ onClose, onSuccess }: ApiTokenModalProps) {
  const [apiToken, setApiToken] = useState('');
  const [webhookKey, setWebhookKey] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showWebhookKey, setShowWebhookKey] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('codNetworkToken');
    const savedWebhookKey = localStorage.getItem('codNetworkWebhookKey');
    if (savedToken) setApiToken(savedToken);
    if (savedWebhookKey) setWebhookKey(savedWebhookKey);
  }, []);

  const handleSave = async () => {
    if (!apiToken.trim()) {
      setError('Please enter your API token');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const isValid = await codNetworkApi.validateToken(apiToken.trim());
      
      if (!isValid) {
        setError('Invalid API token. Please check your credentials.');
        return;
      }

      localStorage.setItem('codNetworkToken', apiToken.trim());
      if (webhookKey.trim()) {
        localStorage.setItem('codNetworkWebhookKey', webhookKey.trim());
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
        window.location.reload(); // Refresh to reinitialize API client
      }, 1500);
    } catch (err) {
      setError('Failed to validate credentials');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <Key size={20} className="text-purple-600" />
            <h2 className="text-xl font-semibold">API Credentials</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              Credentials saved successfully!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="w-full pr-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Enter your API token"
              />
              <button
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Find your API token in My Profile {'->'} API Developer {'->'} API Token
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook Secret Key
            </label>
            <div className="relative">
              <input
                type={showWebhookKey ? 'text' : 'password'}
                value={webhookKey}
                onChange={(e) => setWebhookKey(e.target.value)}
                className="w-full pr-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Enter your webhook secret key"
              />
              <button
                onClick={() => setShowWebhookKey(!showWebhookKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showWebhookKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Find your Webhook Secret Key in My Profile {'->'} API Developer {'->'} Webhook Secret Key
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isValidating || !apiToken.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isValidating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Credentials
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}