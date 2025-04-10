import React, { useEffect } from 'react';
import { Scissors, Upload, Loader2, Download, ExternalLink, Link2, X } from 'lucide-react';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import { useBackground } from '../store/background';
import { useHistory } from '../store/history';
import { useProductStore } from '@/store';
import { useLocation } from 'react-router-dom';
import { getAiGenerations } from '@/services/firebase/aiGenerations';

interface RemoveBackgroundResponse {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}

function VideoBackgroundRemover() {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const { addItem } = useHistory();
  const { user } = useProductStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const API_KEY = import.meta.env.VITE_FAL_KEY || '';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = item => {
    if (item.type === 'video-background-remover' && item.content.videoUrl) {
      setOutputUrl(item.content.videoUrl);
      if (item.content.sourceVideo) {
        setVideoUrl(item.content.sourceVideo);
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

  // Listen for response updates
  React.useEffect(() => {
    const handleResponse = ((event: CustomEvent) => {
      const detail = event.detail;
      if (detail.type === 'video-background-remover') {
        // Handle both direct video URL and result object formats
        const videoUrl = detail.videoUrl || detail.result?.video?.url;
        if (videoUrl) {
          setOutputUrl(videoUrl);
          setLoading(false);
        }
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, [videoUrl, addItem]);

  // Listen for video-specific updates
  React.useEffect(() => {
    const handleVideoUpdate = ((event: CustomEvent) => {
      const videoUrl = event.detail.videoUrl;
      if (videoUrl) {
        setOutputUrl(videoUrl);
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('video-update', handleVideoUpdate);
    return () => window.removeEventListener('video-update', handleVideoUpdate);
  }, [videoUrl, addItem]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 50 * 1024 * 1024; // 50MB limit
      if (file.size > maxSize) {
        setError(
          'File size must be less than 50MB. Please compress your video or use a smaller file.'
        );
        return;
      }

      // Check video dimensions
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        const maxDimension = 1280; // 720p is safer for processing
        // if (video.videoWidth > maxDimension || video.videoHeight > maxDimension) {
        //   setError(
        //     `Video dimensions too large. Maximum allowed is ${maxDimension}x${maxDimension} pixels. Please compress your video.`
        //   );
        //   return;
        // }

        // If dimensions are ok, proceed with base64 conversion
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoUrl(reader.result as string);
          setIsBase64(true);
          setError(null);
        };
        reader.readAsDataURL(file);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        setError('Invalid video file. Please use a supported format (mp4, webm).');
      };

      video.src = URL.createObjectURL(file);
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
    setOutputUrl(null);
    setProgress('');

    if (!videoUrl) {
      setError('Please provide a video');
      setLoading(false);
      return;
    }

    try {
      // Validate URL if not base64
      if (!isBase64) {
        try {
          new URL(videoUrl);
        } catch {
          throw new Error('Please enter a valid URL');
        }
      }

      const requestOptions = {
        model: 'fal-ai/ben/v2/video',
        video_url: videoUrl,
      };

      // Create background task
      const taskId = addTask({
        type: 'video-background-remover',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<RemoveBackgroundResponse>(
        'fal-ai/ben/v2/video',
        API_KEY,
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
      startBackgroundPolling(taskId, 'fal-ai/ben/v2/video', result?.request_id, API_KEY, user?.uid);
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('network error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('413')) {
        errorMessage =
          'File size too large. Please use a smaller video (max 50MB) or reduce the dimensions.';
      } else if (errorMessage.toLowerCase().includes('api key')) {
        errorMessage = 'Invalid API key. Please check your FAL API key in the .env file.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
      }

      setError(errorMessage);
    } finally {
      setProgress('');
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Remove Video Background"
      description="Remove backgrounds from videos with AI"
      modelId='fal-ai/ben/v2/video'
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
              Supported formats: mp4, webm. Max size: 50MB. Maximum resolution: 1280x1280
            </p>
          </div>

          <button type="submit" disabled={loading || !videoUrl} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <Scissors className="w-5 h-5" />
                Remove Background
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
              progressText={progress || 'Removing background...'}
              title="Processing Video"
            />
          )}

          {outputUrl && (
            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Original Video */}
                <div className="card overflow-hidden">
                  <div className="aspect-video bg-[#1A1A3A]/30">
                    <video
                      src={videoUrl}
                      className="w-full h-full object-contain"
                      muted
                      loop
                      onMouseEnter={e => e.currentTarget.play()}
                      onMouseLeave={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <h3 className="text-lg font-medium mb-2">Original Video</h3>
                  </div>
                </div>

                {/* Processed Video */}
                <div className="card overflow-hidden">
                  <div className="aspect-video bg-[#1A1A3A]/30">
                    <video
                      src={outputUrl}
                      className="w-full h-full object-contain bg-[#1A1A3A]/30"
                      muted
                      loop
                      playsInline
                      onMouseEnter={e => e.currentTarget.play()}
                      onMouseLeave={e => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      onError={e => {
                        console.error('Video error:', e);
                        setError(
                          'Failed to load video. Please try downloading and playing it locally.'
                        );
                      }}
                    />
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <h3 className="text-lg font-medium mb-2">Background Removed</h3>
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
    />
  );
}

export default VideoBackgroundRemover;
