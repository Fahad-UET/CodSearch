import React, { useState, useEffect } from 'react';
import { FileText, Mic, AlertCircle, Download, Play, Pause, Loader2 } from 'lucide-react';
import { makeService } from '../../services/make';
import { AdCopyVariant } from '../../types';

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
  const [voiceOverUrl, setVoiceOverUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleGenerateVoiceOver = async () => {
    if (!selectedText.trim()) {
      setError('Please select text to generate voice-over');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setVoiceOverUrl(null);

    try {
      const response = await makeService.generateVoiceOver(selectedText);
      
      if (response.audio_url) {
        setVoiceOverUrl(response.audio_url);
        setSuccess('Voice-over generated successfully!');
      } else {
        throw new Error('No audio URL received');
      }
    } catch (error) {
      setError('Failed to generate voice-over. Please try again.');
      console.error('Voice generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!voiceOverUrl) return;

    try {
      const response = await fetch(voiceOverUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voiceover-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download voice-over');
      console.error('Download error:', error);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !voiceOverUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [voiceOverUrl]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
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
                  selectedText === text
                    ? 'bg-purple-100'
                    : 'bg-purple-50 hover:bg-purple-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={16} className="text-purple-600" />
                  <span className="font-medium text-purple-700">Current Text</span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{text}</p>
              </div>

              {/* Saved Texts */}
              {savedTexts.map((savedText) => (
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
                      <span className="font-medium text-gray-700">Saved Text #{savedText.number}</span>
                    </div>
                    {savedText.rating > 0 && (
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                        Rating: {savedText.rating}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{savedText.description}</p>
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

          {/* Voice Over Player */}
          {voiceOverUrl && (
            <div className="bg-purple-50 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-purple-700">Generated Voice-over</h3>
                <button
                  onClick={handleDownload}
                  className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                  title="Download voice-over"
                >
                  <Download size={20} />
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={togglePlayPause}
                  className="p-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <audio 
                  ref={audioRef} 
                  src={voiceOverUrl}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
            </div>
          )}

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
                <Loader2 size={20} className="animate-spin" />
                Generating voice-over...
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