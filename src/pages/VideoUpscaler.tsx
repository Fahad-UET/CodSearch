import React from 'react';
import { Maximize2, Upload, Loader2, Download, ExternalLink, Link2, X } from 'lucide-react';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import { useBackground } from '../store/background';
import { useHistory } from '../store/history';

interface UpscalerResponse {
  request_id: string;
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}

interface UpscaleResponse {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}

function VideoUpscaler() {
  const [videoUrl, setVideoUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [upscaleFactor, setUpscaleFactor] = React.useState(2);
  const [targetFps, setTargetFps] = React.useState<number | ''>('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const { addItem } = useHistory();
  const API_KEY = import.meta.env.VITE_FAL_KEY || '';

  // Listen for response updates
  React.useEffect(() => {
    const handleResponse = ((event: CustomEvent) => {
      if (event.detail.type === 'video' && event.detail.result?.video) {
        setOutputUrl(event.detail.result.video.url);
        setLoading(false);
        
        // Add to history
        addItem({
          type: 'video',
          content: {
            videoUrl: event.detail.result.video.url,
            sourceVideo: videoUrl
          },
          timestamp: Date.now(),
          id: ''
        });
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, [videoUrl, addItem]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 500 * 1024 * 1024; // 500MB limit
      if (file.size > maxSize) {
        setError('File size must be less than 500MB. Please compress your video or use a smaller file.');
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

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Create background task
      const taskId = addTask({
        type: 'video',
        status: 'pending',
        progress: 'Submitting request...',
        params: {
          video_url: videoUrl,
          upscale_factor: upscaleFactor,
          target_fps: targetFps || undefined
        },
        timestamp: Date.now()
      });

      // Submit request
      const { request_id } = await submitToQueue<UpscalerResponse>(
        'fal-ai/topaz/upscale/video',
        API_KEY,
        {
          video_url: videoUrl,
          upscale_factor: upscaleFactor,
          ...(targetFps ? { target_fps: targetFps } : {})
        },
        (status, percent, logs) => {
          setPercentage(percent);
          setProgress(status);
          if (logs?.length) {
            console.log('Processing logs:', logs);
          }
        }
      );

      // Start background polling
      startBackgroundPolling(taskId, 'fal-ai/topaz/upscale/video', request_id, API_KEY);

      setProgress('Request submitted. Processing your video...');

    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('network error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('413')) {
        errorMessage = 'File size too large. Please use a smaller video (max 500MB).';
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
      title="Video Upscaler"
      description="Enhance video resolution with AI"
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
                onChange={(e) => handleUrlChange(e)}
                onPaste={(text) => handleUrlChange({ target: { value: text } } as any)}
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
                  onClick={() => { setVideoUrl(''); setIsBase64(false); }}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-white/60">
              Supported formats: mp4, webm. Max size: 500MB
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Upscale Factor
              </label>
              <select
                value={upscaleFactor}
                onChange={(e) => setUpscaleFactor(parseInt(e.target.value))}
                className="input-area"
              >
                <option value={2}>2x</option>
                <option value={4}>4x</option>
                <option value={8}>8x</option>
              </select>
              <p className="text-sm text-white/60">
                Higher values produce larger videos
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Target FPS (Optional)
              </label>
              <select
                value={targetFps}
                onChange={(e) => setTargetFps(e.target.value ? parseInt(e.target.value) : '')}
                className="input-area"
              >
                <option value="">Original FPS</option>
                <option value={30}>30 FPS</option>
                <option value={60}>60 FPS</option>
                <option value={120}>120 FPS</option>
              </select>
              <p className="text-sm text-white/60">
                Enable frame interpolation
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !videoUrl}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <Maximize2 className="w-5 h-5" />
                Upscale Video
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
              progressText={progress || 'Upscaling video...'}
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
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <h3 className="text-lg font-medium mb-2">Original Video</h3>
                  </div>
                </div>

                {/* Result */}
                <div className="card overflow-hidden">
                  <div className="aspect-video bg-[#1A1A3A]/30">
                    <video
                      src={outputUrl}
                      className="w-full h-full object-contain bg-[#1A1A3A]/30"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                      onError={(e) => {
                        console.error('Video error:', e);
                        setError('Failed to load video. Please try downloading and playing it locally.');
                      }}
                    />
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <h3 className="text-lg font-medium mb-2">Upscaled Video</h3>
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
      onHistoryItemClick={(item) => {
        if (item.type === 'video' && item.content.videoUrl) {
          setOutputUrl(item.content.videoUrl);
          if (item.content.sourceVideo) {
            setVideoUrl(item.content.sourceVideo);
          }
        }
      }}
    />
  );
}

export default VideoUpscaler;