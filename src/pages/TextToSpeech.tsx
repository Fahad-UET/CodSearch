import React, { useEffect } from 'react';
import {
  Volume as VolumeUp,
  Loader2,
  Download,
  Play,
  Pause,
  Upload,
  Filter,
  Sparkles,
  Plus,
  MessageSquare,
  X,
  Music,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { createAudioUrlFromText, getVoices, createVoicePreview } from '../utils/elevenlabs';
import ToolLayout from '@/components/AICreator/ToolLayout';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import { useHistory } from '../store/history';
import { useVoice, type VoiceState } from '../store/voice';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import VoiceDesignModal from '@/components/AICreator/VoiceDesignModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatTimeRemaining } from '../utils/time';
import { addAiGeneration, getAiGenerations } from '@/services/firebase/aiGenerations';
import { useProductStore } from '@/store';

interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  category: 'cloned' | 'premade';
  labels?: {
    accent?: string;
    description?: string;
    age?: string;
    gender?: string;
  };
}

function TextToSpeech() {
  const [activeTab, setActiveTab] = React.useState<'generate' | 'design' | 'clone'>('generate');
  const [openVoiceParameters, setOpenVoiceParameters] = React.useState<boolean>(false);
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingVoices, setLoadingVoices] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [voices, setVoices] = React.useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<string>('JBFqnCBsd6RMkjVDRZzb');
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const { addItem } = useHistory();
  const [creatingVoice, setCreatingVoice] = React.useState(false);
  const [voiceDescription, setVoiceDescription] = React.useState('');
  const [previewAudioUrl, setPreviewAudioUrl] = React.useState<string | null>(null);
  const [generatedVoiceId, setGeneratedVoiceId] = React.useState<string | null>(null);
  const [voiceSettings, setVoiceSettings] = React.useState({
    speed: 1,
    stability: 0.5,
    similarity_boost: 0.75,
    style: 0,
    use_speaker_boost: true,
  });
  const [filters, setFilters] = React.useState({
    gender: '',
    accent: '',
    age: '',
    type: '',
  });
  const [showVoiceModal, setShowVoiceModal] = React.useState(false);
  const [loadingError, setLoadingError] = React.useState<string | null>(null);
  const [newVoiceId, setNewVoiceId] = React.useState<string | null>(null);
  const { user } = useProductStore();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = (item: any) => {
    if (item.type === 'text-to-speech' && item.content.audioUrl) {
      setAudioUrl(item.content.audioUrl);
      if (item.content.prompt) {
        setText(item.content.prompt);
      }
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const result: any = await getAiGenerations(user?.uid, id);
        handleHistoryItemClick(result[0]);
      } catch (error) {
        console.log({ error });
      }
    };
    if (user?.uid && id) {
      getData();
    }
  }, [user, id]);

  // Check for text from transcription on mount
  React.useEffect(() => {
    const textToConvert = sessionStorage.getItem('textToConvert');
    if (textToConvert) {
      setText(textToConvert);
      // Clear the stored text
      sessionStorage.removeItem('textToConvert');
    }
  }, []);
  const [showNewVoiceGuide, setShowNewVoiceGuide] = React.useState(false);
  const { customVoices, cleanupExpiredVoices, updateVoiceTimestamp, removeCustomVoice } =
    useVoice();
  const navigate = useNavigate();

  // State for countdown timers
  const [timeRemaining, setTimeRemaining] = React.useState<Record<string, number>>({});

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const API_KEY =
    import.meta.env.VITE_ELEVENLABS_API_KEY ||
    'sk_060daf1571fe015fbad9f5f86d5dea78106efc8cafaade2d';
  const EXAMPLE_TEXT =
    'Welcome to the world of AI-powered text to speech. This technology transforms written words into natural-sounding speech.';
  const EXAMPLE_VOICE_DESCRIPTION = 'A sassy little squeaky mouse';

  // Update countdown timers every second
  React.useEffect(() => {
    const updateTimers = () => {
      const now = Date.now();
      const newTimeRemaining: Record<string, number> = {};

      customVoices.forEach(voice => {
        const expiresAt = voice.createdAt + 15 * 60 * 1000; // 15 minutes
        const remaining = Math.max(0, expiresAt - now);
        newTimeRemaining[voice.id] = remaining;
      });

      setTimeRemaining(newTimeRemaining);
    };

    const interval = setInterval(updateTimers, 1000);
    updateTimers(); // Initial update

    return () => clearInterval(interval);
  }, [customVoices]);

  // Filter voices based on selected criteria
  const filteredVoices = React.useMemo(() => {
    return voices.filter(voice => {
      if (filters.gender && voice.labels?.gender !== filters.gender) return false;
      if (filters.accent && voice.labels?.accent !== filters.accent) return false;
      if (filters.age && voice.labels?.age !== filters.age) return false;
      if (filters.type && voice.labels?.description !== filters.type) return false;
      return true;
    });
  }, [voices, filters]);

  // Get unique filter options from available voices
  const filterOptions = React.useMemo(() => {
    const options = {
      gender: new Set<string>(),
      accent: new Set<string>(),
      age: new Set<string>(),
      type: new Set<string>(),
    };

    voices.forEach(voice => {
      // Only include binary genders
      if (voice.labels?.gender === 'male' || voice.labels?.gender === 'female') {
        options.gender.add(voice.labels.gender);
      }
      if (voice.labels?.accent) options.accent.add(voice.labels.accent);
      if (voice.labels?.age) options.age.add(voice.labels.age);
      if (voice.labels?.description) options.type.add(voice.labels.description);
    });

    // Sort accents to put Arabic first
    const sortedAccents = Array.from(options.accent).sort((a, b) => {
      if (a.toLowerCase().includes('arabic')) return -1;
      if (b.toLowerCase().includes('arabic')) return 1;
      return a.localeCompare(b);
    });

    return {
      gender: Array.from(options.gender),
      accent: sortedAccents,
      age: Array.from(options.age),
      type: Array.from(options.type),
    };
  }, [voices]);

  // Fetch available voices on component mount
  React.useEffect(() => {
    // Clean up expired voices on component mount
    cleanupExpiredVoices();

    const fetchVoices = async () => {
      if (!API_KEY) return;
      setLoadingError(null);
      setLoadingVoices(true);
      try {
        const voiceList = await getVoices();
        setVoices(voiceList);

        // Set first voice as default if available
        if (voiceList.length > 0) {
          setSelectedVoice(voiceList[0].voice_id);
        }
      } catch (err) {
        console.error('Failed to fetch voices:', err);
        setLoadingError('Failed to load voices. Using default voices instead.');
      } finally {
        setLoadingVoices(false);
      }
    };

    fetchVoices();

    // Set up periodic cleanup
    const cleanupInterval = setInterval(cleanupExpiredVoices, 60 * 1000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, [API_KEY, cleanupExpiredVoices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    if (!text) {
      setError('Please provide some text to convert');
      setLoading(false);
      return;
    }

    if (!API_KEY) {
      setError('Please set your ElevenLabs API key in the .env file');
      setLoading(false);
      return;
    }

    try {
      // If using a custom voice, update its timestamp
      const isCustomVoice = customVoices.some(voice => voice.id === selectedVoice);
      if (isCustomVoice) {
        updateVoiceTimestamp(selectedVoice);
      }

      const id = crypto.randomUUID();
      const url = await createAudioUrlFromText(text, selectedVoice, user?.uid, id);
      setAudioUrl(url);

      if (url) {
        const currentTime = Date.now();
        await addAiGeneration({
          userId: user?.uid,
          type: 'text-to-speech',
          id,
          currentTime,
          content: {
            prompt: text || '',
            audioUrl: url,
          },
        });
        // Add to history
        addItem({
          type: 'text-to-speech',
          id,
          content: {
            prompt: text,
            audioUrl: url,
          },
          timestamp: currentTime,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleUseLipSync = () => {
    if (audioUrl) {
      // Store the audio URL in sessionStorage
      sessionStorage.setItem('lipSyncAudio', audioUrl);
      // Navigate to lip sync page
      navigate('/lipsync');
    }
  };

  const handleCreateVoice = async () => {
    if (!voiceDescription) {
      setError('Please provide a voice description');
      return;
    }

    setCreatingVoice(true);
    setError(null);
    setPreviewAudioUrl(null);
    setGeneratedVoiceId(null);

    try {
      const result = await createVoicePreview(voiceDescription);

      // Convert base64 audio to URL
      const audioBuffer = Uint8Array.from(atob(result.previews[0].audio_base_64), c =>
        c.charCodeAt(0)
      );
      const blob = new Blob([audioBuffer], { type: result.previews[0].media_type });
      const audioUrl = URL.createObjectURL(blob);

      setPreviewAudioUrl(audioUrl);
      setGeneratedVoiceId(result.previews[0].generated_voice_id);

      // Refresh voice list
      const voiceList = await getVoices();
      setVoices(voiceList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create voice preview');
    } finally {
      setCreatingVoice(false);
    }
  };

  return (
    <ToolLayout
      title="Text to Speech"
      description="Convert text into natural-sounding speech with advanced AI voice generation"
      controls={
        <>
          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('generate');
                setShowVoiceModal(false);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all ${
                activeTab === 'generate'
                  ? 'bg-[#4A2A7A] text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <VolumeUp className="w-8 h-8" />
                <span className="text-sm">Generate</span>
                <span className="text-sm">Speech</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('design');
                setShowVoiceModal(true);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all ${
                activeTab === 'design'
                  ? 'bg-[#4A2A7A] text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Sparkles className="w-8 h-8" />
                <span className="text-sm">Voice</span>
                <span className="text-sm">Design</span>
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('clone');
                setShowVoiceModal(true);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all ${
                activeTab === 'clone'
                  ? 'bg-[#4A2A7A] text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8" />
                <span className="text-sm">Voice</span>
                <span className="text-sm">Clone</span>
              </div>
            </button>
          </div>

          {/* My Voice Creator */}
          <div className="mb-6 bg-white/5 rounded-lg p-4 space-y-4">
            {/* <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Sparkles className="w-4 h-4" />
                My Voice Creator
              </div>
              <button
                onClick={() => setShowVoiceModal(true)}
                className="text-sm text-[#9A6ACA] hover:text-[#BA8AEA] transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Create Voice
              </button>
            </div> */}
            {voices.filter(voice => voice.category === 'cloned').length > 0 && (
              <div className="grid gap-2">
                {voices
                  .filter(voice => voice.category === 'cloned')
                  .map(voice => (
                    <React.Fragment key={voice.voice_id}>
                      <div
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          selectedVoice === voice.voice_id
                            ? 'bg-[#4A2A7A]/60 border border-white/20 shadow-lg shadow-[#4A2A7A]/20'
                            : 'hover:bg-white/5'
                        } ${
                          voice.voice_id === newVoiceId
                            ? 'ring-2 ring-green-500/50 animate-pulse'
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          name="voice"
                          value={voice.voice_id}
                          checked={
                            selectedVoice === voice.voice_id || voice.voice_id === newVoiceId
                          }
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedVoice(voice.voice_id);
                            } else {
                              setSelectedVoice('JBFqnCBsd6RMkjVDRZzb');
                            }
                          }}
                          className="w-4 h-4 text-[#9A6ACA] bg-white/10 border-white/20 focus:ring-[#7A4AAA] focus:ring-offset-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{voice.name}</span>
                            {voice.labels?.description && (
                              <span className="text-sm text-white/60 truncate">
                                ({voice.labels.description})
                              </span>
                            )}
                            {timeRemaining[voice.voice_id] !== undefined && (
                              <div
                                className={`text-sm font-medium ml-2 ${
                                  timeRemaining[voice.voice_id] < 60000
                                    ? 'text-red-400'
                                    : 'text-amber-400'
                                }`}
                              >
                                Expires in: {formatTimeRemaining(timeRemaining[voice.voice_id])}
                              </div>
                            )}
                            <button
                              onClick={() => {
                                if (selectedVoice === voice.voice_id) {
                                  setSelectedVoice('JBFqnCBsd6RMkjVDRZzb');
                                }
                                removeCustomVoice(voice.voice_id);
                              }}
                              className="ml-auto p-1.5 text-white/40 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                              title="Delete voice"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {voice.preview_url && (
                            <audio
                              src={voice.preview_url}
                              controls={
                                voice.voice_id === newVoiceId || selectedVoice === voice.voice_id
                              }
                              className="w-full h-6 mt-2"
                            >
                              Your browser does not support the audio element.
                            </audio>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            )}
          </div>

          {/* Voice Filters */}
          {!voices.some(v => v.category === 'cloned' && v.voice_id === selectedVoice) && (
            <div className="mb-6 bg-white/5 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Filter className="w-4 h-4" />
                Voice Filters
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-white/60">Gender</label>
                  <select
                    value={filters.gender}
                    onChange={e => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                    className="input-area text-sm py-2"
                  >
                    <option value="">All</option>
                    {filterOptions.gender.map(gender => (
                      <option key={gender} value={gender} className="capitalize">
                        {gender}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-white/60">Accent</label>
                  <select
                    value={filters.accent}
                    onChange={e => setFilters(prev => ({ ...prev, accent: e.target.value }))}
                    className="input-area text-sm py-2"
                  >
                    <option value="">All</option>
                    {filterOptions.accent.map(accent => (
                      <option key={accent} value={accent} className="capitalize">
                        {accent}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-white/60">Voice Type</label>
                  <select
                    value={filters.type}
                    onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="input-area text-sm py-2"
                  >
                    <option value="">All</option>
                    {filterOptions.type.map(type => (
                      <option key={type} value={type} className="capitalize">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-white/60">Age</label>
                  <select
                    value={filters.age}
                    onChange={e => setFilters(prev => ({ ...prev, age: e.target.value }))}
                    className="input-area text-sm py-2"
                  >
                    <option value="">All</option>
                    {filterOptions.age.map(age => (
                      <option key={age} value={age} className="capitalize">
                        {age}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {filteredVoices.length === 0 && (
                <p className="text-amber-400/80 text-sm">
                  No voices match the selected filters. Try adjusting your criteria.
                </p>
              )}
            </div>
          )}

          {/* Premade Voices */}
          {!voices.some(v => v.category === 'cloned' && v.voice_id === selectedVoice) && (
            <div className="mb-6 bg-white/5 rounded-lg p-4 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Sparkles className="w-4 h-4" />
                Premade Voices
              </div>
              <select
                value={selectedVoice}
                onChange={e => {
                  setSelectedVoice(e.target.value);
                }}
                disabled={voices.some(v => v.category === 'cloned' && v.voice_id === selectedVoice)}
                className={`w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  voices.some(v => v.category === 'cloned' && v.voice_id === selectedVoice)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {/* <option value="aria">Aria (expressive)</option>
                <option value="roger">Roger (confident)</option>
                <option value="sarah">Sarah (soft)</option>
                <option value="laura">Laura (upbeat)</option>
                <option value="charlie">Charlie (natural)</option>
                <option value="george">George (warm)</option>
                <option value="callum">Callum (intense)</option>
                <option value="river">River (confident)</option>
                <option value="liam">Liam (articulate)</option>
                <option value="charlotte">Charlotte (seductive)</option>
                <option value="alice">Alice (confident)</option>
                <option value="matilda">Matilda (friendly)</option>
                <option value="will">Will (friendly)</option>
                <option value="jessica">Jessica (expressive)</option>
                <option value="eric">Eric (friendly)</option>
                <option value="chris">Chris (casual)</option>
                <option value="brian">Brian (deep)</option>
                <option value="daniel">Daniel (authoritative)</option>
                <option value="lily">Lily (warm)</option>
                <option value="bill">Bill (trustworthy)</option>
                <option value="saudi1">سعودي صوت خافت</option>
                <option value="saudi2">سعودي 1</option>
                <option value="saudi3">سعودي 5</option>
                <option value="saudi4">سعودي 1</option>
                <option value="saudi5">سعودي 12</option>
                <option value="saudi6">سعودي 12</option>
                <option value="saudi7">سعودية</option>
                <option value="saudi8">سعودي متحمس 3</option> */}
                {voices
                  .filter(voice => voice.category === 'premade')
                  .reverse()
                  .map(voice => (
                    <option key={voice.voice_id} value={voice.voice_id}>
                      {voice.name}{' '}
                      {voice.labels?.description ? `(${voice.labels.description})` : ''}
                    </option>
                  ))}
              </select>
              {/* Preview audio for selected voice */}
              {voices.find(v => v.voice_id === selectedVoice)?.preview_url && (
                <audio
                  src={voices.find(v => v.voice_id === selectedVoice)?.preview_url}
                  controls
                  className="w-full h-8"
                >
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          )}

          {/* Text to Convert */}
          <div className="mb-6 bg-white/5 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <MessageSquare className="w-4 h-4" />
              Text to Convert
            </div>
            <div className="space-y-2">
              <InputWithPaste
                value={text}
                onChange={e => setText(e.target.value)}
                onPasteText={text => setText(text)}
                multiline
                className="input-area"
                placeholder="Enter text to convert to speech..."
                rows={4}
              />
              <button
                type="button"
                onClick={() => setText(EXAMPLE_TEXT)}
                className="text-sm text-[#9A6ACA] hover:text-[#BA8AEA] transition-colors"
              >
                Use example text
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {loadingVoices && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                <div className="animate-spin">
                  <Loader2 className="w-8 h-8" />
                </div>
              </div>
            )}

            {/* Voice Parameters */}
            <div className='bg-purple-500 flex gap-2 justify-center items-center p-2 rounded-lg cursor-pointer' onClick={()=> setOpenVoiceParameters(prev=> !prev)}>
              <p>Voice Parameters</p>
              {openVoiceParameters ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </div>
            {openVoiceParameters && <div className="space-y-4 bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Voice Parameters</h3>
                <button
                  onClick={() =>
                    setVoiceSettings({
                      speed: 1,
                      stability: 0.5,
                      similarity_boost: 0.75,
                      style: 0,
                      use_speaker_boost: true,
                    })
                  }
                  className="text-xs text-[#9A6ACA] hover:text-[#BA8AEA] transition-colors"
                >
                  Reset values
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Speed</label>
                  <span className="text-xs text-white/60">{voiceSettings.speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={voiceSettings.speed}
                  onChange={e =>
                    setVoiceSettings(prev => ({
                      ...prev,
                      speed: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Stability</label>
                  <span className="text-xs text-white/60">
                    {(voiceSettings.stability * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.stability}
                  onChange={e =>
                    setVoiceSettings(prev => ({
                      ...prev,
                      stability: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>More variable</span>
                  <span>More stable</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Similarity</label>
                  <span className="text-xs text-white/60">
                    {(voiceSettings.similarity_boost * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.similarity_boost}
                  onChange={e =>
                    setVoiceSettings(prev => ({
                      ...prev,
                      similarity_boost: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Style Exaggeration</label>
                  <span className="text-xs text-white/60">
                    {(voiceSettings.style * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceSettings.style}
                  onChange={e =>
                    setVoiceSettings(prev => ({
                      ...prev,
                      style: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>None</span>
                  <span>Exaggerated</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={voiceSettings.use_speaker_boost}
                  onChange={e =>
                    setVoiceSettings(prev => ({
                      ...prev,
                      use_speaker_boost: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                />
                <label className="text-sm">Speaker boost</label>
              </div>
            </div>}

            <button type="submit" disabled={loading || !text} className="btn-primary">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <VolumeUp className="w-5 h-5" />
                  Generate Speech
                </>
              )}
            </button>
          </form>
        </>
      }
      result={
        <>
          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              <div className="flex items-start gap-2">
                {error.includes('API key') ? (
                  <ApiKeyError />
                ) : (
                  <div className="flex-1">
                    <p className="font-medium mb-1">Error:</p>
                    <p className="whitespace-pre-wrap">{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {showVoiceModal && (
            <VoiceDesignModal
              onClose={() => setShowVoiceModal(false)}
              onVoiceCreated={async voiceId => {
                // Refresh voice list
                setNewVoiceId(voiceId);
                setShowNewVoiceGuide(true);
                const voiceList = await getVoices();
                setVoices(voiceList);
                // Select the new voice
                setSelectedVoice(voiceId);
                // Clear new voice highlight after 5 seconds
                setTimeout(() => {
                  setShowNewVoiceGuide(false);
                  setNewVoiceId(null);
                }, 5000);
              }}
            />
          )}

          {audioUrl && (
            <div className="mt-8 space-y-4">
              <div className="p-6 bg-white/5 rounded-lg">
                <div className="relative">
                  <audio
                    ref={audioRef}
                    onEnded={handleAudioEnd}
                    onError={e => {
                      console.error('Audio playback error:', e);
                      setError('Failed to play audio. Please try again.');
                    }}
                    controls
                    className="w-full h-12 mb-4"
                  >
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="p-4 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-full text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <a
                    href={audioUrl}
                    download="generated-speech.mp3"
                    className="p-4 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-full text-white/90 transition-colors"
                  >
                    <Download className="w-6 h-6" />
                  </a>
                  <button
                    onClick={handleUseLipSync}
                    className="p-4 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-full text-white/90 transition-colors"
                    title="Use in Lip Sync"
                  >
                    <Music className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <p className="text-center text-sm text-white/60">
                Click play to listen or download to save the audio file
              </p>
            </div>
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
      setPrompt={(prompt) => setText(prompt)}
    />
  );
}

export default TextToSpeech;
