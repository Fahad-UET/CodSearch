import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
// to resolve build issue please check this
// import { AdCopyVariant } from './index';
import { AdCopyVariant } from '@/types';

interface AdCopyGeneratorProps {
  onGenerate: (platform: AdCopyVariant['platform'], tone: string) => Promise<void>;
  isGenerating: boolean;
}

export function AdCopyGenerator({ onGenerate, isGenerating }: AdCopyGeneratorProps) {
  const [platform, setPlatform] = useState<AdCopyVariant['platform']>('facebook');
  const [tone, setTone] = useState('professional');

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'instagram', label: 'Instagram' }
  ] as const;

  const tones = [
    'Professional',
    'Casual',
    'Humorous',
    'Urgent',
    'Luxurious',
    'Friendly',
    'Educational',
    'Persuasive'
  ];

  return (
    <div className="bg-white rounded-xl border border-purple-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Generate Ad Copy</h3>

      <div className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            {platforms.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPlatform(value)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  platform === value
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone of Voice
          </label>
          <div className="grid grid-cols-2 gap-2">
            {tones.map(t => (
              <button
                key={t}
                onClick={() => setTone(t.toLowerCase())}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  tone === t.toLowerCase()
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={() => onGenerate(platform, tone)}
          disabled={isGenerating}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} />
              Generate Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}