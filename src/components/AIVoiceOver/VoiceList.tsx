import React, { useState, useRef, useMemo } from 'react';
import { Play, Pause, Star, StarOff, Trash2, ChevronDown, Crown } from 'lucide-react';
import type { ElevenLabsVoice } from '../../types';

const ACCENT_FLAGS: Record<string, string> = {
  american: '🇺🇸',
  british: '🇬🇧',
  australian: '🇦🇺',
  indian: '🇮🇳',
  african: '🇿🇦',
  french: '🇫🇷',
  german: '🇩🇪',
  italian: '🇮🇹',
  spanish: '🇪🇸',
  mexican: '🇲🇽',
  portuguese: '🇵🇹',
  polish: '🇵🇱',
  russian: '🇷🇺',
  turkish: '🇹🇷',
  japanese: '🇯🇵',
  korean: '🇰🇷',
  chinese: '🇨🇳',
  arabic: '🇸🇦',
};

interface Props {
  voices: ElevenLabsVoice[];
  selectedVoice: string;
  onVoiceSelect: (voiceId: string) => void;
  onDeleteVoice?: (voiceId: string) => void;
  onSetDefaultVoice: (voiceId: string) => void;
  defaultVoiceId: string;
}

export default function VoiceList({
  voices,
  selectedVoice,
  onVoiceSelect,
  onDeleteVoice,
  onSetDefaultVoice,
  defaultVoiceId,
}: Props) {
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorite_voices');
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleFavorite = (voiceId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(voiceId)
        ? prev.filter(id => id !== voiceId)
        : [...prev, voiceId];
      localStorage.setItem('favorite_voices', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handlePlayPreview = (voice: ElevenLabsVoice) => {
    if (!voice.preview_url) return;

    // Stop event propagation
    event?.stopPropagation();

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (playingPreview === voice.voice_id) {
      // Just stop if clicking the currently playing voice
      setPlayingPreview(null);
    } else {
      try {
        const audio = new Audio();

        // Set up event handlers before setting src
        audio.onloadeddata = () => {
          if (audio.readyState >= 2) {
            // Have enough data to play
            audio.play().catch(err => {
              console.error('Failed to play audio:', err);
              setPlayingPreview(null);
            });
          }
        };

        audio.onended = () => {
          setPlayingPreview(null);
          audioRef.current = null;
        };

        audio.onerror = () => {
          console.error('Audio failed to load:', audio.error);
          setPlayingPreview(null);
          audioRef.current = null;
        };

        // Add CORS headers if needed
        audio.crossOrigin = 'anonymous';

        // Set src and load after handlers are set up
        audio.src = voice.preview_url;
        audio.load(); // Explicitly load the audio

        audioRef.current = audio;
        setPlayingPreview(voice.voice_id);
      } catch (error) {
        console.error('Error setting up audio:', error);
        setPlayingPreview(null);
      }
    }
  };

  // Group voices by category
  const groupedVoices = useMemo(() => {
    const groups = {
      favorites: [] as ElevenLabsVoice[],
      male: [] as ElevenLabsVoice[],
      female: [] as ElevenLabsVoice[],
      other: [] as ElevenLabsVoice[],
    };

    voices.forEach(voice => {
      if (favorites.includes(voice.voice_id)) {
        groups.favorites.push(voice);
      }

      const category = voice.labels?.gender?.toLowerCase();
      if (category === 'male') {
        groups.male.push(voice);
      } else if (category === 'female') {
        groups.female.push(voice);
      } else {
        groups.other.push(voice);
      }
    });

    return groups;
  }, [voices, favorites]);

  // Cleanup audio on unmount
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const sections = [
    { id: 'favorites', label: '⭐ Favorites', voices: groupedVoices.favorites },
    { id: 'male', label: '👨 Male Voices', voices: groupedVoices.male },
    { id: 'female', label: '👩 Female Voices', voices: groupedVoices.female },
    { id: 'other', label: '🎭 Other Voices', voices: groupedVoices.other },
  ].filter(section => section.voices.length > 0);

  return (
    <div className="space-y-2 bg-white rounded-lg shadow-sm border border-gray-200">
      {sections.map(section => (
        <div key={section.id}>
          <button
            onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{section.label}</span>
              <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-100 rounded-full">
                {section.voices.length}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                expandedSection === section.id ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSection === section.id && (
            <div className="py-2 px-2 space-y-1 bg-gray-50 border-t border-gray-100">
              {section.voices.map(voice => (
                <VoiceCard
                  key={voice.voice_id}
                  voice={voice}
                  isSelected={selectedVoice === voice.voice_id}
                  isPlaying={playingPreview === voice.voice_id}
                  isFavorite={favorites.includes(voice.voice_id)}
                  isDefault={voice.voice_id === defaultVoiceId}
                  onSelect={() => onVoiceSelect(voice.voice_id)}
                  onPlayPreview={() => handlePlayPreview(voice)}
                  onToggleFavorite={() => toggleFavorite(voice.voice_id)}
                  onSetDefault={() => onSetDefaultVoice(voice.voice_id)}
                  onDelete={onDeleteVoice ? () => onDeleteVoice(voice.voice_id) : undefined}
                  isCustomVoice={!voice.preview_url} // Custom voices won't have preview URLs
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface VoiceCardProps {
  voice: ElevenLabsVoice;
  isSelected: boolean;
  isPlaying: boolean;
  isFavorite: boolean;
  isDefault?: boolean;
  onSetDefault: () => void;
  onSelect: () => void;
  onPlayPreview: () => void;
  onToggleFavorite: () => void;
  onDelete?: () => void;
  isCustomVoice?: boolean;
}

function VoiceCard({
  voice,
  isSelected,
  isPlaying,
  isFavorite,
  onSelect,
  onPlayPreview,
  onToggleFavorite,
  onDelete,
  isCustomVoice,
  isDefault,
  onSetDefault,
}: VoiceCardProps) {
  return (
    <div
      className={`p-2 rounded-lg transition-all cursor-pointer group flex items-center justify-between hover:bg-white ${
        isSelected ? 'bg-blue-50 text-[#2980B9]' : 'text-gray-700'
      }`}
      onClick={onSelect}
    >
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{voice.name}</span>
          {voice.labels?.accent && (
            <span className="text-base ml-1" title={voice.labels.accent}>
              {ACCENT_FLAGS[voice.labels.accent.toLowerCase()] || '🌐'}
            </span>
          )}
          {voice.labels?.gender && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full ml-2">
              {voice.labels.gender}
            </span>
          )}
          {isDefault && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              Default
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400 truncate">{voice.voice_id}</span>
          {voice.labels?.accent && (
            <span className="text-xs text-gray-500">{voice.labels.accent}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {voice.preview_url && (
            <button
              onClick={e => {
                e.stopPropagation();
                onPlayPreview();
              }}
              className={`p-1 rounded-lg transition-all ${
                isPlaying
                  ? 'bg-[#2980B9] text-white'
                  : 'hover:bg-[#2980B9]/10 text-gray-500 hover:text-[#2980B9]'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={e => {
              e.stopPropagation();
              if (isPlaying) return; // Don't toggle favorite while playing
              onToggleFavorite();
            }}
            className={`p-1 rounded-lg transition-all ${
              isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            {isFavorite ? (
              <Star className="w-4 h-4 fill-current" />
            ) : (
              <StarOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              if (isPlaying) return; // Don't set default while playing
              onSetDefault();
            }}
            className={`p-1 rounded-lg transition-all ${
              isDefault ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'
            }`}
            title={isDefault ? 'Default voice' : 'Set as default'}
          >
            <Crown className={`w-4 h-4 ${isDefault ? 'fill-current' : ''}`} />
          </button>
          {isCustomVoice && onDelete && (
            <button
              onClick={e => {
                e.stopPropagation();
                if (isPlaying) return; // Don't delete while playing
                onDelete();
              }}
              className="p-1 rounded-lg text-red-600 hover:bg-red-50 transition-all"
              title="Delete voice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
