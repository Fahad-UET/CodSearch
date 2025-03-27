import React, { useState, useEffect } from 'react';
import { Plus, X, Loader, Star, Mic } from 'lucide-react';
import VoiceList from './VoiceList';
import { fetchVoices, initializeElevenLabs } from '../../services/elevenlabs';
import type { ElevenLabsVoice, VoiceSettings } from '../../types';

interface Props {
  selectedVoice: string;
  onVoiceSelect: (voiceId: string, voiceName: string) => void;
}

export default function VoiceSelector({ selectedVoice, onVoiceSelect }: Props) {
  const [showInput, setShowInput] = useState(false);
  const [voiceId, setVoiceId] = useState(selectedVoice);
  const [voiceName, setVoiceName] = useState('');
  const [defaultVoiceId, setDefaultVoiceId] = useState<string>(() => {
    return localStorage.getItem('default_voice_id') || '';
  });
  const [voices, setVoices] = useState<ElevenLabsVoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customVoices, setCustomVoices] = useState<ElevenLabsVoice[]>(() => {
    const saved = localStorage.getItem('custom_voices');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (defaultVoiceId) {
      const defaultVoice = voices.find(v => v.voice_id === defaultVoiceId);
      if (defaultVoice) {
        onVoiceSelect(defaultVoice.voice_id, defaultVoice.name);
      }
    }
  }, [voices, defaultVoiceId]);

  useEffect(() => {
    const loadVoices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
        initializeElevenLabs(apiKey);
        const fetchedVoices = await fetchVoices();
        setVoices([...fetchedVoices, ...customVoices]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch voices');
      } finally {
        setIsLoading(false);
      }
    };

    loadVoices();
  }, [localStorage.getItem('elevenlabs_api_key'), customVoices]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (voiceId.trim() && voiceName.trim()) {
      // Add the new voice to the list
      const newVoice: ElevenLabsVoice = {
        voice_id: voiceId.trim(),
        name: voiceName.trim(),
      };
      setCustomVoices(prev => {
        const updated = [...prev, newVoice];
        localStorage.setItem('custom_voices', JSON.stringify(updated));
        return updated;
      });
      onVoiceSelect(voiceId.trim(), voiceName.trim());
      setShowInput(false);
      setVoiceId('');
      setVoiceName('');
    }
  };

  const handleDeleteVoice = (voiceId: string) => {
    setCustomVoices(prev => {
      const updated = prev.filter(v => v.voice_id !== voiceId);
      // If deleting default voice, clear default
      if (voiceId === defaultVoiceId) {
        setDefaultVoiceId('');
        localStorage.removeItem('default_voice_id');
      }
      localStorage.setItem('custom_voices', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSetDefaultVoice = (voiceId: string) => {
    if (voiceId === defaultVoiceId) {
      // Unset default
      setDefaultVoiceId('');
      localStorage.removeItem('default_voice_id');
    } else {
      // Set new default
      setDefaultVoiceId(voiceId);
      localStorage.setItem('default_voice_id', voiceId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <label className="block text-sm font-medium text-gray-700">Voice Selection</label>
        {selectedVoice && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#2980B9] rounded-lg border border-[#2980B9]">
            <Mic className="w-4 h-4" />
            <span className="text-sm font-medium">
              {voices.find(v => v.voice_id === selectedVoice)?.name || 'Selected Voice'}
            </span>
            <button
              onClick={() => setShowInput(!showInput)}
              className="ml-2 flex items-center gap-1 px-2 py-1 text-xs bg-[#2980B9] text-white rounded hover:bg-[#3498DB] transition-all"
            >
              {showInput ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              {showInput ? 'Cancel' : 'Add'}
            </button>
          </div>
        )}
      </div>

      {showInput && (
        <div className="space-y-3 mb-6">
          <input
            type="text"
            value={voiceName}
            onChange={e => setVoiceName(e.target.value)}
            placeholder="Enter Voice Name..."
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2980B9] focus:border-[#2980B9] mb-2"
          />
          <input
            type="text"
            value={voiceId}
            onChange={e => setVoiceId(e.target.value)}
            placeholder="Enter ElevenLabs Voice ID..."
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2980B9] focus:border-[#2980B9]"
          />
          <button
            onClick={handleSubmit}
            disabled={!voiceId.trim() || !voiceName.trim()}
            className="w-full px-4 py-2 bg-[#2980B9] text-white rounded-lg hover:bg-[#3498DB] transition-all"
          >
            Use Voice ID
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader className="w-6 h-6 text-[#2980B9] animate-spin" />
        </div>
      ) : (
        <VoiceList
          voices={voices}
          selectedVoice={selectedVoice}
          onDeleteVoice={handleDeleteVoice}
          onSetDefaultVoice={handleSetDefaultVoice}
          defaultVoiceId={defaultVoiceId}
          onVoiceSelect={id => {
            const voice = voices.find(v => v.voice_id === id);
            if (voice) {
              onVoiceSelect(id, voice.name);
            }
          }}
        />
      )}
    </div>
  );
}
