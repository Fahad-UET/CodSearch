import React from 'react';
import { Upload, Video, Loader2, Download, ExternalLink, Link2, Check, X } from 'lucide-react';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import type {
  LipSyncModel,
  SyncMode,
  LipSyncRequestOptions,
  LipSyncResponse,
} from '../types/lipsync';
import { useBackground } from '../store/background';
import { useProductStore } from '@/store';

function LipSync() {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [audioUrl, setAudioUrl] = React.useState('');
  const [isVideoBase64, setIsVideoBase64] = React.useState(false);
  const [isAudioBase64, setIsAudioBase64] = React.useState(false);
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [videoError, setVideoError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [model, setModel] = React.useState<LipSyncModel>('lipsync-1.9.0-beta');
  const [syncMode, setSyncMode] = React.useState<SyncMode>('cut_off');

  const { addTask } = useBackground();
  const { user } = useProductStore();

  // Check for audio URL from text-to-speech page
  React.useEffect(() => {
    const lipSyncAudio = sessionStorage.getItem('lipSyncAudio');
    if (lipSyncAudio) {
      setAudioUrl(lipSyncAudio);
      // Clear the stored URL
      sessionStorage.removeItem('lipSyncAudio');
    }
  }, []);

  const videoInputRef = React.useRef<HTMLInputElement>(null);
  const audioInputRef = React.useRef<HTMLInputElement>(null);
  const API_KEY =
    import.meta.env.VITE_FAL_KEY ||
    'c356025c-0f92-4873-a43b-e3346e53cd93:b43044d3956488e624cac9d8ebdc098d';

  React.useEffect(() => {
    // Listen for response updates
    const handleResponse = ((event: CustomEvent) => {
      if (event.detail.type === 'lipsync') {
        setOutputUrl(event.detail.videoUrl);
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, []);

  const handleFileUpload =
    (type: 'video' | 'audio') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Stricter file size limits to prevent 413 errors
        const maxSize = type === 'video' ? 25 * 1024 * 1024 : 10 * 1024 * 1024; // 25MB for video, 10MB for audio
        if (file.size > maxSize) {
          setError(
            `File size must be less than ${
              type === 'video' ? '25MB' : '10MB'
            }. Please compress your ${type} file or use a smaller file.`
          );
          return;
        }

        // Check video dimensions if it's a video file
        if (type === 'video') {
          const fileUrl = URL.createObjectURL(file);
          if (type === 'video') {
            setVideoUrl(fileUrl);
            setIsVideoBase64(true);
          }
      
          // const video = document.createElement('video');
          // video.preload = 'metadata';

          // video.onloadedmetadata = () => {
          //   URL.revokeObjectURL(video.src);
          //   const maxDimension = 1280; // 720p is safer for processing
          //   if (video.videoWidth > maxDimension || video.videoHeight > maxDimension) {
          //     setError(
          //       `Video dimensions too large. Maximum allowed is ${maxDimension}x${maxDimension} pixels. Please compress your video.`
          //     );
          //     return;
          //   }

          //   // If dimensions are ok, proceed with base64 conversion
          //   const reader = new FileReader();
          //   reader.onloadend = () => {
          //     if (type === 'video') {
          //       setVideoUrl(reader.result as string);
          //       setIsVideoBase64(true);
          //     } else {
          //       setAudioUrl(reader.result as string);
          //       setIsAudioBase64(true);
          //     }
          //     setError(null);
          //   };
          //   reader.readAsDataURL(file);
          // };

          // video.onerror = () => {
          //   URL.revokeObjectURL(video.src);
          //   setError('Invalid video file. Please use a supported format (mp4, webm).');
          // };

          // video.src = URL.createObjectURL(file);
        } else {
          // For audio files, just check the file type
          const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp3'];
          if (!validAudioTypes.includes(file.type)) {
            setError('Invalid audio format. Please use MP3, WAV, or M4A files.');
            return;
          }

          // Proceed with audio file
          const reader = new FileReader();
          reader.onloadend = () => {
            setAudioUrl(reader.result as string);
            setIsAudioBase64(true);
            setError(null);
          };
          reader.readAsDataURL(file);
        }
      }
    };

  const handleUrlChange = (type: 'video' | 'audio') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'video') {
      setVideoUrl(e.target.value);
      setIsVideoBase64(false);
    } else {
      setAudioUrl(e.target.value);
      setIsAudioBase64(false);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutputUrl(null);
    setProgress('');

    if (!videoUrl || !audioUrl) {
      setError('Please provide both a video and audio file or URL');
      setLoading(false);
      return;
    }

    try {
      // Validate URLs if not base64
      if (!isVideoBase64) {
        try {
          new URL(videoUrl);
        } catch {
          throw new Error('Please enter a valid video URL');
        }
      }
      if (!isAudioBase64) {
        try {
          new URL(audioUrl);
        } catch {
          throw new Error('Please enter a valid audio URL');
        }
      }

      const requestOptions: LipSyncRequestOptions = {
        model,
        video_url: videoUrl,
        audio_url: audioUrl.trim(),
        sync_mode: syncMode,
      };

      // Validate URLs before submitting
      if (!isVideoBase64) {
        try {
          new URL(videoUrl);
        } catch {
          throw new Error('Please enter a valid video URL');
        }
      }

      if (!isAudioBase64) {
        try {
          new URL(audioUrl);
        } catch {
          throw new Error('Please enter a valid audio URL');
        }
      }

      // Create background task
      const taskId = addTask({
        type: 'lipsync',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<LipSyncResponse>(
        'fal-ai/sync-lipsync',
        API_KEY.trim(),
        requestOptions,
        (status, percent, logs) => {
          setPercentage(percent);
          setProgress(status);
          if (logs?.length) {
            console.log('Processing logs:', logs);
          }
        },
        'video'
      );

      // Start background polling
      startBackgroundPolling(taskId, 'fal-ai/sync-lipsync', result?.request_id, API_KEY, user?.uid);

      // Add event listener for response updates
      const handleVideoUpdate = (event: CustomEvent) => {
        const { videoUrl: newVideoUrl } = event.detail;
        if (newVideoUrl) {
          setOutputUrl(newVideoUrl);
          setLoading(false);
        }
      };

      window.addEventListener('video-update', handleVideoUpdate as EventListener);

      // Cleanup listener when component unmounts
      return () => {
        window.removeEventListener('video-update', handleVideoUpdate as EventListener);
      };
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

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('413')) {
        errorMessage =
          'File size too large. Please use smaller files (max 50MB each) or compress your media files.';
      } else if (errorMessage.toLowerCase().includes('invalid request')) {
        errorMessage =
          'Invalid request parameters. Please check your video and audio files/URLs and try again.';
      } else if (errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage =
          'Failed to access media files. Please ensure your video and audio URLs are publicly accessible.';
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        errorMessage =
          'Request timed out. Please try again with smaller files or check your internet connection.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please wait a few minutes before trying again.';
      } else if (errorMessage.toLowerCase().includes('api key')) {
        errorMessage = 'Invalid API key. Please check your FAL API key in the .env file.';
      } else if (errorMessage.toLowerCase().includes('network error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('api key')) {
        errorMessage = 'Invalid API key. Please check your FAL API key in the .env file.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
      }

      // Log the error for debugging
      console.error('LipSync error:', {
        message: errorMessage,
        originalError: err,
      });
      setError(errorMessage);
    } finally {
      setProgress('');
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Lip Sync"
      description="Synchronize video lips with new audio using AI"
      controls={
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="videoUrl" className="block text-sm font-medium">
                  Video File or URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="videoUrl"
                    type="text"
                    value={videoUrl}
                    onChange={handleUrlChange('video')}
                    className="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/video.mp4"
                    disabled={isVideoBase64}
                  />
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleFileUpload('video')}
                    accept="video/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600"
                    title="Upload Video"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  {isVideoBase64 && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoUrl('');
                        setIsVideoBase64(false);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Supported formats: mp4, webm. Max size: 25MB. Maximum resolution: 1280x1280
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="audioUrl" className="block text-sm font-medium">
                  Audio File or URL
                </label>
                <div className="flex gap-2">
                  <input
                    id="audioUrl"
                    type="text"
                    value={audioUrl}
                    onChange={handleUrlChange('audio')}
                    className="flex-1 px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/audio.mp3"
                    disabled={isAudioBase64}
                  />
                  <input
                    type="file"
                    ref={audioInputRef}
                    onChange={handleFileUpload('audio')}
                    accept="audio/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600"
                    title="Upload Audio"
                    onClick={() => audioInputRef.current?.click()}
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  {isAudioBase64 && (
                    <button
                      type="button"
                      onClick={() => {
                        setAudioUrl('');
                        setIsAudioBase64(false);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  Supported formats: mp3, wav, m4a. Max size: 10MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Model Version</label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value as LipSyncModel)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lipsync-1.9.0-beta">v1.9.0 Beta (Latest)</option>
                  <option value="lipsync-1.8.0">v1.8.0</option>
                  <option value="lipsync-1.7.1">v1.7.1</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Sync Mode</label>
                <select
                  value={syncMode}
                  onChange={e => setSyncMode(e.target.value as SyncMode)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cut_off">Cut Off</option>
                  <option value="loop">Loop</option>
                  <option value="bounce">Bounce</option>
                </select>
                <p className="text-sm text-gray-400">
                  How to handle audio/video duration mismatches
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !videoUrl || !audioUrl}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {progress || 'Processing... This may take a few minutes'}
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Generate Lip-Synced Video
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

          {loading && !outputUrl && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress}
              title="Generating Lip Sync Video"
            />
          )}

          {outputUrl && (
            <div className="mt-8 space-y-4">
              <div className="aspect-video bg-white/5 rounded-lg overflow-hidden">
                <video
                  src={outputUrl}
                  onError={e => {
                    console.error('Video error:', e);
                    setVideoError(
                      'Failed to load video. Please try downloading and playing it locally.'
                    );
                  }}
                  onLoadedData={() => setVideoError(null)}
                  className="w-full h-auto"
                  muted
                  loop
                  playsInline
                  onMouseEnter={e => e.currentTarget.play()}
                  onMouseLeave={e => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                >
                  Your browser does not support the video tag.
                </video>
                {videoError && (
                  <div className="p-4 bg-red-900/50 text-red-200 text-sm">{videoError}</div>
                )}
              </div>
              <p className="text-center">
                <div className="flex justify-center gap-4">
                  <a
                    href={outputUrl}
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                    title="Download video"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <a
                    href={outputUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(outputUrl)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                    title="Copy video URL"
                  >
                    <Link2 className="w-4 h-4" />
                    Copy URL
                  </button>
                </div>
              </p>
            </div>
          )}
        </>
      }
      history={
        outputUrl ? (
          <div className="space-y-4">
            <div className="card overflow-hidden">
              <div className="aspect-video bg-white/5">
                <video
                  src={outputUrl}
                  onError={e => {
                    console.error('Video error:', e);
                    setVideoError(
                      'Failed to load video. Please try downloading and playing it locally.'
                    );
                  }}
                  onLoadedData={() => setVideoError(null)}
                  className="w-full h-full"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
                {videoError && (
                  <div className="p-4 bg-red-900/50 text-red-200 text-sm">{videoError}</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm text-white/60 mb-2">Video URL:</p>
                <p className="text-white/90 truncate">{videoUrl}</p>
                <p className="text-sm text-white/60 mt-4 mb-2">Audio URL:</p>
                <p className="text-white/90 truncate">{audioUrl}</p>
              </div>
            </div>
          </div>
        ) : undefined
      }
    />
  );
}

export default LipSync;
