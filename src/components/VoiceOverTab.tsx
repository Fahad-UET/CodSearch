import React, { useState } from 'react';
import { FileText, Mic, AlertCircle } from 'lucide-react';
import { makeService } from '../services/make';
import { AdCopyVariant } from '../types';
import { X } from 'lucide-react';

interface VoiceOverTabProps {
  text: string;
  onClose: () => void;
  savedTexts?: AdCopyVariant[];
}

export function VoiceOverTab({ text, onClose, savedTexts = [] }: VoiceOverTabProps) {
  const [selectedText, setSelectedText] = useState<string>(text);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerateVoiceOver = async () => {
    if (!selectedText.trim()) {
      setError('Please select text to generate voice-over');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Send text to Make webhook
      await makeService.sendWebhook({
        event: 'voiceover.generate',
        data: {
          text: selectedText,
          timestamp: new Date().toISOString(),
        },
      });

      setSuccess('Voice-over generation request sent successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to send voice-over request');
      console.error('Make webhook error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95  backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm w-2/4 relative">
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors absolute right-1 top-1"
        >
          <X size={20} />
        </button>
        <div className="space-y-6">
          {/* Text Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Text for Voice-over
            </label>
            <div className="space-y-2">
              {/* Current Text */}
              <div
                onClick={() => setSelectedText(text)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedText === text ? 'bg-purple-100' : 'bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-purple-600" />
                  <span className="font-medium text-purple-700">Current Text</span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{text}</p>
              </div>

              {/* Saved Texts */}
              {savedTexts.map(savedText => (
                <div
                  key={savedText.id}
                  onClick={() => setSelectedText(savedText.description)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedText === savedText.description
                      ? 'bg-purple-100'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="font-medium text-gray-700">
                        Saved Text #{savedText.number}
                      </span>
                    </div>
                    {savedText.rating > 0 && (
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        Rating: {savedText.rating}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {savedText.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Text Preview */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Text</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{selectedText}</p>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {success}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateVoiceOver}
            disabled={isLoading || !selectedText.trim()}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending request...
              </>
            ) : (
              <>
                <Mic size={20} />
                Generate Voice-over
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
