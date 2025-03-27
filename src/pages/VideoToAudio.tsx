import React, { useState, useRef } from 'react';
import { Music, Upload, Loader2, Download, ExternalLink, Link2, Check, X, Mic } from 'lucide-react';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ToolLayout from '@/components/AICreator/ToolLayout';
import { useHistory } from '../store/history';
import { extractAudio } from '../utils/ffmpeg';
import { useNavigate } from 'react-router-dom';

interface AudioFormat {
  id: string;
  label: string;
  extension: string;
  mimeType: string;
  bitrate: string;
}

function VideoToAudio() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isBase64, setIsBase64] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('mp3-high');
  const [progress, setProgress] = useState<string>('');
  const [percentage, setPercentage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useHistory();

  const audioFormats: AudioFormat[] = [
    {
      id: 'mp3-high',
      label: 'MP3 High Quality',
      extension: 'mp3',
      mimeType: 'audio/mpeg',
      bitrate: '320kbps',
    },
    {
      id: 'mp3-medium',
      label: 'MP3 Medium Quality',
      extension: 'mp3',
      mimeType: 'audio/mpeg',
      bitrate: '192kbps',
    },
    {
      id: 'mp3-low',
      label: 'MP3 Low Quality',
      extension: 'mp3',
      mimeType: 'audio/mpeg',
      bitrate: '128kbps',
    },
    {
      id: 'wav',
      label: 'WAV (Lossless)',
      extension: 'wav',
      mimeType: 'audio/wav',
      bitrate: 'Lossless',
    },
    { id: 'aac', label: 'AAC', extension: 'm4a', mimeType: 'audio/mp4', bitrate: '256kbps' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 100 * 1024 * 1024; // 100MB max
      if (file.size > maxSize) {
        setError(
          'File size must be less than 100MB. Please compress your video or use a smaller file.'
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoUrl(reader.result as string);
        setIsBase64(true);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
    setIsBase64(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    setProgress('');
    setPercentage(0);

    if (!videoUrl) {
      setError('Please provide a video file or URL');
      setLoading(false);
      return;
    }

    try {
      // Extract format and quality from selectedFormat
      const [format, quality] = selectedFormat.split('-');

      setProgress('Initializing audio extraction...');
      // Process the video
      const audioBlob = await extractAudio(
        isBase64 ? await fetch(videoUrl).then(r => r.blob()) : videoUrl,
        format,
        quality || 'high',
        progress => {
          setPercentage(progress);
          if (progress === 100) setProgress('Finalizing audio...');
          setProgress(`Processing: ${progress}%`);
        }
      );

      // Create URL for the audio
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      // Add to history
      addItem({
        id: crypto.randomUUID(),
        type: 'video-to-audio',
        content: {
          audioUrl: url,
        },
        timestamp: Date.now(),
      });

      setProgress('Complete!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setProgress('');
      setPercentage(0);
    }
  };

  const handleCopy = async () => {
    if (audioUrl) {
      try {
        await navigator.clipboard.writeText(audioUrl);
        setCopied(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleTranscribe = () => {
    if (audioUrl) {
      // Store the audio URL in sessionStorage
      sessionStorage.setItem('audioToTranscribe', audioUrl);
      // Navigate to transcription page
      navigate('/transcribe');
    }
  };

  return (
    <ToolLayout
      title="Extract Audio"
      description="Extract audio from video files"
      controls={
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="videoUrl" className="block text-sm font-medium">
              Video File or URL
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="videoUrl"
                type="text"
                value={videoUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e)}
                onPasteText={text => handleUrlChange({ target: { value: text } } as any)}
                className="input-area flex-1"
                placeholder="https://example.com/video.mp4"
                disabled={isBase64}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="video/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                title="Upload Video"
              >
                <Upload className="w-5 h-5" />
              </button>
              {isBase64 && (
                <button
                  type="button"
                  onClick={() => {
                    setVideoUrl('');
                    setIsBase64(false);
                  }}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-white/60">
              Supported formats: mp4, webm, mov. Max size: 100MB
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Output Format</label>
            <select
              value={selectedFormat}
              onChange={e => setSelectedFormat(e.target.value)}
              className="input-area"
            >
              {audioFormats.map(format => (
                <option key={format.id} value={format.id}>
                  {format.label} ({format.bitrate})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading || !videoUrl} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing...'}
              </>
            ) : (
              <>
                <Music className="w-5 h-5" />
                Extract Audio
              </>
            )}
          </button>
        </form>
      }
      result={
        <>
          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="font-medium mb-1">Error:</p>
                  <p className="whitespace-pre-wrap">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading && !audioUrl && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress || 'Processing video...'}
              title="Extracting Audio"
            />
          )}

          {audioUrl && (
            <div className="mt-8 space-y-4">
              <div className="p-6 bg-white/5 rounded-lg">
                <audio src={audioUrl} controls className="w-full h-12 mb-4">
                  Your browser does not support the audio element.
                </audio>
                <div className="flex justify-center gap-4">
                  <a
                    href={audioUrl}
                    download={`extracted-audio.${
                      audioFormats.find(f => f.id === selectedFormat)?.extension
                    }`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <a
                    href={audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                    {copiedUrl ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button
                    onClick={handleTranscribe}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                    title="Transcribe audio"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Transcribe</span>
                  </button>
                </div>
              </div>
              <p className="text-center text-sm text-white/60">
                Click download to save the extracted audio file
              </p>
            </div>
          )}
        </>
      }
      onHistoryItemClick={item => {
        if (item.type === 'video-to-audio' && item.content.audioUrl) {
          setAudioUrl(item.content.audioUrl);
        }
      }}
    />
  );
}

export default VideoToAudio;
