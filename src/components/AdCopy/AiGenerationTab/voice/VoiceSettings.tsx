import React from 'react';
import { Slider } from '../../../../components/ui/Slider';
import { Select } from '../../../../components/ui/Select';

interface VoiceSettings {
  voice_id: string;
  model_id: string;
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

interface VoiceSettingsProps {
  settings: VoiceSettings;
  onChange: (settings: VoiceSettings) => void;
}

const VOICE_OPTIONS = [
  { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Rachel' },
  { value: '21m00Tcm4TlvDq8ikWAM', label: 'Adam' },
  { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
  { value: 'jnmgvhGiCSW0gr6y3lc8', label: 'Elli' }
];

const MODEL_OPTIONS = [
  { value: 'eleven_monolingual_v1', label: 'Monolingual' },
  { value: 'eleven_multilingual_v1', label: 'Multilingual' }
];

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  settings,
  onChange
}) => {
  const updateSetting = (key: keyof VoiceSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Voice
          </label>
          <Select
            value={settings.voice_id}
            onChange={value => updateSetting('voice_id', value)}
            options={VOICE_OPTIONS}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <Select
            value={settings.model_id}
            onChange={value => updateSetting('model_id', value)}
            options={MODEL_OPTIONS}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stability ({settings.stability})
        </label>
        <Slider
          value={settings.stability}
          onChange={value => updateSetting('stability', value)}
          min={0}
          max={1}
          step={0.1}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Similarity Boost ({settings.similarity_boost})
        </label>
        <Slider
          value={settings.similarity_boost}
          onChange={value => updateSetting('similarity_boost', value)}
          min={0}
          max={1}
          step={0.1}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Style ({settings.style})
        </label>
        <Slider
          value={settings.style}
          onChange={value => updateSetting('style', value)}
          min={0}
          max={1}
          step={0.1}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="speaker-boost"
          checked={settings.use_speaker_boost}
          onChange={e => updateSetting('use_speaker_boost', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="speaker-boost"
          className="ml-2 block text-sm text-gray-700"
        >
          Use Speaker Boost
        </label>
      </div>
    </div>
  );
};