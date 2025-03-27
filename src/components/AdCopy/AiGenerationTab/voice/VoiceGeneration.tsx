import { useState } from 'react';
import { generateSpeech } from '@/services/elevenlabs/index';

interface VoiceGenerationProps {
  apiKey: string;
}

export function VoiceGeneration({ apiKey }: VoiceGenerationProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter text to convert to speech');
      return;
    }

    if (!apiKey) {
      setError('Please enter your ElevenLabs API key');
      return;
    }

    setLoading(true);
    setError(null);
// to resolve build issue please check this
// const result = await generateSpeech({ text, apiKey });c
    const result = await generateSpeech( text, apiKey );

    if (result.success && result.audioBuffer) {
      const blob = new Blob([result.audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } else {
      setError(result.error || 'Failed to generate speech');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full h-32 p-3 border rounded-lg resize-none"
        placeholder="Enter text to convert to speech..."
        disabled={loading}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading || !text.trim() || !apiKey}
        className={`
          px-4 py-2 rounded-lg
          ${loading || !text.trim() || !apiKey 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
          }
          text-white transition-colors duration-200
        `}
      >
        {loading ? 'Generating...' : 'Generate Speech'}
      </button>
    </div>
  );
}