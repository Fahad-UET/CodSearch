import React from 'react';
import {
  Upload,
  Mic,
  Loader2,
  Download,
  ExternalLink,
  Link2,
  Check,
  Volume as VolumeUp,
} from 'lucide-react';
import PasteButton from '@/components/AICreator/PasteButton';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import { transcribeAudio } from '@/utils/elevenlabs';
import ToolLayout from '@/components/AICreator/ToolLayout';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import type { LanguageCode } from '@/types/whisper';
import { useNavigate } from 'react-router-dom';

function AudioTranscription() {
  const navigate = useNavigate();
  const [copiedText, setCopiedText] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [transcription, setTranscription] = React.useState('');
  const [text, setText] = React.useState('');
  const [words, setWords] = React.useState<any[]>([]);
  const [progress, setProgress] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [language, setLanguage] = React.useState<LanguageCode | ''>('');
  const [diarize, setDiarize] = React.useState(true);
  const [numSpeakers, setNumSpeakers] = React.useState<number | ''>('');
  const [timestampsGranularity, setTimestampsGranularity] = React.useState<
    'none' | 'word' | 'character'
  >('none');
  const [tagAudioEvents, setTagAudioEvents] = React.useState(true);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const API_KEY =
    import.meta.env.VITE_ELEVENLABS_API_KEY ||
    'sk_060daf1571fe015fbad9f5f86d5dea78106efc8cafaade2d';

  // Check for text from transcription on mount
  React.useEffect(() => {
    // Check for audio URL from video-to-audio page
    const audioToTranscribe = sessionStorage.getItem('audioToTranscribe');
    if (audioToTranscribe) {
      setAudioUrl(audioToTranscribe);
      // Clear the stored URL
      sessionStorage.removeItem('audioToTranscribe');
    }

    const textToConvert = sessionStorage.getItem('textToConvert');
    if (textToConvert) {
      setText(textToConvert);
    }
  }, []);

  const handleDownload = () => {
    if (!transcription) return;

    const blob = new Blob([transcription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcription.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const TEST_AUDIO_URL =
    'https://storage.googleapis.com/falserverless/model_tests/whisper/dinner_conversation.mp3';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError('File size must be less than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioUrl(reader.result as string);
        setIsBase64(true);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioUrl(e.target.value);
    setIsBase64(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTranscription('');
    setProgress('');
    setWords([]);

    if (!API_KEY) {
      setError('Please set your ElevenLabs API key in the .env file as VITE_ELEVENLABS_API_KEY');
      setLoading(false);
      return;
    }

    if (!audioUrl) {
      setError('Please provide an audio file or URL');
      setLoading(false);
      return;
    }

    try {
      let audioFile: File | Blob;
      if (isBase64) {
        // Convert base64 to blob
        const response = await fetch(audioUrl);
        audioFile = await response.blob();
      } else {
        // Fetch remote file
        const response = await fetch(audioUrl);
        audioFile = await response.blob();
      }

      const result = await transcribeAudio(audioFile, {
        languageCode: language || undefined,
        numSpeakers: numSpeakers || undefined,
        timestampsGranularity,
        tagAudioEvents,
        diarize,
      });

      setTranscription(result.text);
      setWords(result.words || []);

      // Format transcription with timestamps if available
      if (timestampsGranularity !== 'none' && result.words && result.words.length > 0) {
        const formattedText = result.words
          .map((word, index) => {
            if (word.type === 'word' && typeof word.start === 'number') {
              // Format timestamp with 1 decimal place, default to index if start time is not available
              const timestamp = `[${word.start.toFixed(1) || index}s]`;
              return `${timestamp} ${word.text || ''}`;
            }
            return word.text || '';
          })
          .join(' ')
          .trim();
        setTranscription(formattedText);
      } else {
        setTranscription(result.text);
      }
    } catch (err) {
      let errorMessage: string;

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        // Try to extract error message from error object
        const errorObj = err as { message?: string; error?: string | { message: string } };
        errorMessage =
          errorObj.message ||
          (typeof errorObj.error === 'string' ? errorObj.error : errorObj.error?.message) ||
          'An unexpected error occurred';
      } else {
        errorMessage = 'An unexpected error occurred';
      }

      // Log the error for debugging but with better formatting
      console.error('Transcription error:', {
        message: errorMessage,
        originalError: err,
      });

      setError(errorMessage);
    } finally {
      setProgress('');
      setLoading(false);
    }
  };

  const handleConvertToSpeech = async () => {
    // Store the text in sessionStorage
    sessionStorage.setItem('textToConvert', transcription);
    // Navigate to Text to Speech page
    navigate('/text-to-speech');
  };

  return (
    <ToolLayout
      title="Speech to Text"
      description="Convert your audio files into text with AI"
      controls={
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="audioUrl" className="block text-sm font-medium">
                Audio File or URL
              </label>
              <div className="flex gap-2 items-center">
                <InputWithPaste
                  id="audioUrl"
                  type="text"
                  value={audioUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e)}
                  onPasteText={text => handleUrlChange({ target: { value: text } } as any)}
                  className="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/audio.mp3"
                  disabled={isBase64}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="audio/*"
                  className="hidden"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600"
                  title="Upload Audio"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5" />
                </button>
                {isBase64 && (
                  <button
                    type="button"
                    onClick={() => {
                      setAudioUrl('');
                      setIsBase64(false);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Task</label>
                <select
                  value={timestampsGranularity}
                  onChange={e =>
                    setTimestampsGranularity(e.target.value as 'none' | 'word' | 'character')
                  }
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">Plain Text (No Timestamps)</option>
                  <option value="word">Word Timestamps</option>
                  <option value="character">Character Timestamps</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Language (Optional)</label>
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value as LanguageCode | '')}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Auto-detect</option>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="nl">Dutch</option>
                  <option value="pl">Polish</option>
                  <option value="ru">Russian</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Number of Speakers (Optional)</label>
                <input
                  type="number"
                  value={numSpeakers}
                  onChange={e => setNumSpeakers(e.target.value ? parseInt(e.target.value) : '')}
                  min="2"
                  max="10"
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Auto-detect"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={diarize}
                  onChange={e => setDiarize(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <span className="text-sm font-medium">Enable Speaker Diarization</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={tagAudioEvents}
                  onChange={e => setTagAudioEvents(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                />
                <span className="text-sm font-medium">Tag Audio Events</span>
                <span className="text-xs text-gray-400">(laughter, footsteps, etc.)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !audioUrl}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {progress || 'Processing... This may take a few minutes'}
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  Transcribe Audio
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

          {transcription && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-sm"
                  title={copiedText ? 'Copied!' : 'Copy to clipboard'}
                >
                  {copiedText ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                  Copy
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-sm"
                  title="Download as text file"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => window.open(TEST_AUDIO_URL, '_blank')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-sm"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </button>
                <button
                  onClick={handleConvertToSpeech}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                  title="Convert to speech"
                >
                  <VolumeUp className="w-4 h-4" />
                  Convert to Speech
                </button>
              </div>
              <div className="p-6 bg-white/5 rounded-lg">
                <p className="text-white/90 whitespace-pre-wrap">{transcription}</p>
              </div>
              <p className="text-sm text-white/60 text-center">
                Click the download button to save the transcription as a text file
              </p>
            </div>
          )}
        </>
      }
      history={
        transcription ? (
          <div className="space-y-4">
            <div className="card p-4">
              <p className="text-sm text-white/60 mb-2">Audio Source:</p>
              <p className="text-white/90 truncate">{audioUrl}</p>
              <div className="mt-4">
                <p className="text-sm text-white/60 mb-2">Transcription:</p>
                <p className="text-white/90 line-clamp-4">{transcription}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
    />
  );
}

export default AudioTranscription;
