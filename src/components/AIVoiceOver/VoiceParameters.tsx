import React from 'react';
import { Sliders } from 'lucide-react';

interface Props {
  stability: number;
  similarityBoost: number;
  style: number;
  speakerBoost: boolean;
  onStabilityChange: (value: number) => void;
  onSimilarityBoostChange: (value: number) => void;
  onStyleChange: (value: number) => void;
  onSpeakerBoostChange: (value: boolean) => void;
}

export default function VoiceParameters({
  stability,
  similarityBoost,
  style,
  speakerBoost,
  onStabilityChange,
  onSimilarityBoostChange,
  onStyleChange,
  onSpeakerBoostChange,
}: Props) {
  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 text-gray-700">
        <Sliders className="w-4 h-4" />
        <h3 className="text-sm font-medium">Speaker Boost</h3>
        <p className="text-xs text-gray-500 ml-2">Enhance clarity and reduce background noise</p>
      </div>

      {/* Stability slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">Stability</label>
          <span className="text-sm text-gray-500">{Math.round(stability * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={stability}
          onChange={e => onStabilityChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2980B9]"
        />
      </div>

      {/* Similarity Boost slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">Similarity Boost</label>
          <span className="text-sm text-gray-500">{Math.round(similarityBoost * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={similarityBoost}
          onChange={e => onSimilarityBoostChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2980B9]"
        />
      </div>

      {/* Style slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600">Style</label>
          <span className="text-sm text-gray-500">{Math.round(style * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={style}
          onChange={e => onStyleChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2980B9]"
        />
      </div>

      {/* Speaker Boost toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm text-gray-600">Enable</label>
        </div>
        <button
          onClick={() => onSpeakerBoostChange(!speakerBoost)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            speakerBoost ? 'bg-[#2980B9]' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              speakerBoost ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
