import React, { useState } from 'react';
import { Slider } from '../ui/Slider';
import { Select } from '../ui/Select';

interface VoiceSettingsProps {
  onChange?: (settings: VoiceSettings) => void;
}

interface VoiceSettings {
  speed: number;
  pitch: number;
  voice: string;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  speed: 1.0,
  pitch: 1.0,
  voice: 'en-US-Standard-A'
};

const VOICES = [
  { id: 'en-US-Standard-A', name: 'Emma (Female)' },
  { id: 'en-US-Standard-B', name: 'John (Male)' },
  { id: 'en-US-Standard-C', name: 'Sarah (Female)' },
  { id: 'en-US-Standard-D', name: 'Michael (Male)' }
];

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({ onChange }) => {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);

  const handleChange = (key: keyof VoiceSettings, value: number) => {
    const newSettings = { ...settings, [key]:value };
    setSettings(newSettings);
    onChange?.(newSettings);
  };

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Voice
        </label>
        <Select
          value={settings.voice}
          onChange={(value: number) => handleChange('voice', value)}
          placeholder='Select Voice'
        >
          {VOICES.map(voice => (
            <option key={voice.id} value={voice.id}>
              {voice.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Speed ({settings.speed.toFixed(1)}x)
        </label>
        <Slider
          min={0.5}
          max={2.0}
          step={0.1}
          value={settings.speed}
          onChange={(value) => handleChange('speed', value)}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Pitch ({settings.pitch.toFixed(1)})
        </label>
        <Slider
          min={0.5}
          max={2.0}
          step={0.1}
          value={settings.pitch}
          onChange={value => handleChange('pitch', value)}
        />
      </div>
    </div>
  );
};