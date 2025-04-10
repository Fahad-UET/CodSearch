import React, { useEffect } from 'react';
import { Upload, Video, Loader2, Sparkles, Camera, Download } from 'lucide-react';
import OpenAI from 'openai';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import { useHistory, type HistoryItem } from '../store/history';
import { useBackground } from '../store/background';
import CameraMovementModal from '@/components/AICreator/CameraMovementModal';
import type {
  KlingRequestOptions,
  KlingResponse,
  AspectRatioEnum,
  DurationEnum,
} from '../types/kling';
import { useProductStore } from '@/store';
import { useLocation } from 'react-router-dom';
import { getAiGenerations } from '@/services/firebase/aiGenerations';

function VideoGenerator() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [duration, setDuration] = React.useState<DurationEnum>('5');
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatioEnum>('9:16');
  const [percentage, setPercentage] = React.useState(0);
  const [enhancingPrompt, setEnhancingPrompt] = React.useState(false);
  const [showCameraModal, setShowCameraModal] = React.useState(false);

  // Check for image URL from text-to-image page
  React.useEffect(() => {
    setImageUrl(sessionStorage.getItem('imageToVideo'))
    const handleStorageChange = () => {
      const currentValue = sessionStorage.getItem('imageToVideo');
      if (currentValue) {
        setImageUrl(currentValue);
        sessionStorage.removeItem('imageToVideo');
      }
    };
  
    window.addEventListener('session-storage-change', handleStorageChange);
  
    return () => {
      window.removeEventListener('session-storage-change', handleStorageChange);
    };
  }, []);

  const EXAMPLE_PROMPT =
    'TikTok Advertising Video\n\nScene Overview:\nCreate a dynamic and engaging video optimized for TikTok advertising, featuring ultra-sharp 4K quality and vibrant colors designed to instantly capture viewer attention.\n\nLighting and Atmosphere:\nMain Lighting: Implement high-key lighting setup with strong contrast to make colors pop and details sharp.\nAccent Lights: Position rim lights to create separation and depth, emphasizing product edges or subject silhouettes.\nDynamic Elements: Incorporate subtle light movements and transitions to maintain visual interest.\n\nVisual Style and Effects:\nColor Treatment: Utilize bold, saturated colors with enhanced contrast to stand out in social feeds.\nText Integration: Add impactful, motion-tracked text overlays that complement the movement.\nTransitions: Use quick, dynamic transitions between shots to maintain pace and energy.\nFocus: Employ strategic focus pulls to guide viewer attention to key details.\n\nPost-Processing:\nSharpness: Enhance detail clarity without over-processing.\nContrast: Boost dynamic range for impactful presentation.\nStabilization: Apply subtle stabilization while preserving intentional camera movements.\nColor Grading: Implement punchy, social media-optimized color grade that pops on mobile screens.';

  const { addTask } = useBackground();
  const { user } = useProductStore();
  const OPENAI_API_KEY =
    import.meta.env.VITE_OPENAI_API_KEY ||
    '';

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const API_KEY =
    import.meta.env.VITE_FAL_KEY ||
    '';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
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

  React.useEffect(() => {
    // Listen for response updates
    const handleResponse = ((event: CustomEvent) => {
      if (event.detail.type === 'video') {
        setVideoUrl(event.detail.videoUrl);
        if (event.detail.prompt) {
          setPrompt(event.detail.prompt);
        }
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, []);

  const handleHistoryItemClick = (item: HistoryItem) => {
    if (item.type === 'video' && item.content.videoUrl) {
      setVideoUrl(item.content.videoUrl);
      if (item.content.prompt) {
        setPrompt(item.content.prompt);
      }
      if (item.content.sourceImage) {
        setImageUrl(item.content.sourceImage);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB limit
      // if (file.size > maxSize) {
      //   setError(
      //     'File size must be less than 2MB. Please compress your image or use a smaller file.'
      //   );
      //   return;
      // }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const maxDimension = 1024;
        // if (img.width > maxDimension || img.height > maxDimension) {
        //   setError(
        //     `Image dimensions too large. Maximum allowed is ${maxDimension}x${maxDimension} pixels.`
        //   );
        //   return;
        // }

        // If dimensions are ok, proceed with base64 conversion
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result as string);
          setIsBase64(true);
          setError(null);
        };
        reader.readAsDataURL(file);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        setError('Invalid image file. Please use a supported format (jpg, jpeg, png, webp).');
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setIsBase64(false);
    setError(null);
  };

  const enhancePrompt = async () => {
    if (!prompt) return;

    if (!OPENAI_API_KEY) {
      setError(
        'OpenAI API key is missing. Please add your API key to the .env file as VITE_OPENAI_API_KEY.'
      );
      return;
    }

    setEnhancingPrompt(true);
    try {
      const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              `You are a professional video director and cinematographer. 
Your job is to rewrite basic video prompts to make them slightly more detailed and visually clear — 
without exaggerating or overloading the description.

You use simple, natural language. 
Avoid long-winded descriptions or excessive visual effects. 
Focus on clarity, concise camera direction, and minimal cinematic touches.`,
          },
          {
            role: 'user',
            content: `Simplify and slightly enhance this video prompt with calm cinematic direction:\n\n${prompt}\n\nInclude subtle:\n- Camera movement or angle (if needed)\n- Natural lighting or tone\n- Realistic style\n\nKeep it short, clean, and not over-dramatic.`,
          },
        ],
        // messages: [
        //   {
        //     role: 'system',
        //     content:
        //       'You are a professional cinematographer and video director specializing in creating highly detailed, photorealistic video sequences. Your expertise includes:\n\n1. Advanced cinematography techniques\n2. Professional video production\n3. Visual effects and motion design\n4. Lighting and color theory\n5. Scene composition and framing\n\nYour goal is to transform basic video descriptions into professional, detailed prompts that will generate highly realistic and visually stunning videos.',
        //   },
        //   {
        //     role: 'user',
        //     content: `Enhance this video prompt with cinematic details:\n\n${prompt}\n\nInclude:\n- Camera movements and angles\n- Lighting and atmosphere\n- Visual effects and motion\n- Color grading and style\n\nMake it photorealistic and detailed.`,
        //   },
        // ],
      });

      if (completion.choices[0]?.message?.content) {
        setPrompt(completion.choices[0].message.content.trim());
      } else {
        throw new Error('Failed to enhance prompt. Please try again.');
      }
    } catch (err) {
      console.error('Failed to enhance prompt:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to enhance prompt';
      setError(`${errorMessage}. Please try again or use the original prompt.`);
    } finally {
      setEnhancingPrompt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setProgress('');

    if (!imageUrl) {
      if (!showCameraModal) {
        setError('Please provide an image');
      }
      setLoading(false);
      return;
    }

    if (!prompt) {
      if (!showCameraModal) {
        setError('Please provide a prompt');
      }
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = imageUrl;

      // Validate URL if not base64
      if (!isBase64) {
        try {
          new URL(imageUrl);
        } catch {
          throw new Error('Please enter a valid URL');
        }
      }

      const requestOptions = {
        model: 'fal-ai/kling-video/v1.6/pro/image-to-video',
        prompt,
        image_url: finalImageUrl,
        duration,
        aspect_ratio: aspectRatio,
      } as KlingRequestOptions;

      // Create background task
      const taskId = addTask({
        type: 'video',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue(
        'fal-ai/kling-video/v1.6/pro/image-to-video',
        API_KEY.trim(),
        {
          prompt,
          image_url: finalImageUrl,
          duration,
          aspect_ratio: aspectRatio,
        },
        (status, percent, logs) => {
          setPercentage(percent);
          setProgress(status || 'Processing your request...');
          if (logs?.length) {
            console.log('Processing logs:', logs);
          }
        },
        'video'
      );

      // Start background polling
      startBackgroundPolling(taskId, requestOptions.model, result?.request_id, API_KEY, user?.uid);

      setProgress('Request submitted. You can safely navigate away from this page.');
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'An error occurred';

      // Handle specific error cases
      if (
        errorMessage.toLowerCase().includes('network error') ||
        errorMessage.toLowerCase().includes('failed to fetch') || 
        errorMessage.toLowerCase().includes("balance")
      ) {
        errorMessage =
          'Network error. Please check your internet connection and try again. If the issue persists, the service may be temporarily unavailable.';
      } else if (errorMessage.includes('413')) {
        errorMessage =
          'File size too large. Please use a smaller image (max 2MB) or reduce the dimensions.';
      } else if (errorMessage.toLowerCase().includes('api key')) {
        errorMessage = 'Invalid API key. Please check your FAL API key in the .env file.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
      } else if (
        errorMessage.toLowerCase().includes('service unavailable') ||
        errorMessage.toLowerCase().includes('503')
      ) {
        errorMessage =
          'The video generation service is temporarily unavailable. Please try again in a few minutes.';
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        errorMessage =
          'The request timed out. Please try again with a smaller image or simpler prompt.';
      } else if (errorMessage.toLowerCase().includes('exhausted balance')) {
        errorMessage =
          'Your FAL.ai account balance is exhausted. Please visit https://fal.ai/dashboard/billing to top up your balance.';
      } else if (errorMessage.toLowerCase().includes('invalid request')) {
        errorMessage =
          'Invalid request parameters. Please check your image format and prompt, then try again.';
      }

      setError(errorMessage);
    } finally {
      setProgress('');
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Image to Video"
      description="Transform your images into dynamic videos with AI"
      modelId='fal-ai/kling-video'
      controls={
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium">
                Image File or URL
              </label>
              <div className="flex gap-2 items-center">
                <InputWithPaste
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e)}
                  onPasteText={text => handleUrlChange({ target: { value: text } } as any)}
                  className="input-area"
                  placeholder="https://example.com/image.jpg"
                  disabled={isBase64}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                  title="Upload Image"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5" />
                </button>
                {isBase64 && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl('');
                      setIsBase64(false);
                    }}
                    className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-sm text-white/60 mt-2">
                Supported formats: jpg, jpeg, png, webp. Max size: 2MB. Max dimensions: 1024x1024
                pixels.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium">
                Description Prompt
              </label>
              <div className="relative">
                <InputWithPaste
                  id="prompt"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onPasteText={text => setPrompt(text)}
                  multiline
                  className="input-area pr-12"
                  placeholder="Describe the camera movements for your video..."
                  rows={3}
                />
                <button
                  type="button"
                  onClick={enhancePrompt}
                  disabled={!prompt || enhancingPrompt}
                  className="absolute right-3 top-3 p-2 text-white/80 hover:text-[#9A6ACA] transition-colors rounded-md hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Enhance scene description with AI"
                >
                  {enhancingPrompt ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!prompt.trim()) {
                  setError('Please enter a prompt before selecting a camera movement');
                  return;
                }
                setShowCameraModal(true);
              }}
              className="w-full px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              <span>Choose Camera Movement</span>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Duration</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value as '5' | '10')}
                  className="input-area"
                >
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={e => setAspectRatio(e.target.value as '16:9' | '9:16' | '1:1')}
                  className="input-area"
                >
                  <option value="16:9">Landscape (16:9)</option>
                  <option value="9:16">Portrait (9:16)</option>
                  <option value="1:1">Square (1:1)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !imageUrl}
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
                  Generate Video
                </>
              )}
            </button>
          </form>
        </>
      }
      result={
        <>
          {showCameraModal && (
            <CameraMovementModal
              onClose={() => setShowCameraModal(false)}
              onSelect={movement => {
                // Append camera movement to existing prompt
                setShowCameraModal(false);
                const existingPrompt = prompt.trim();
                const newPrompt = existingPrompt
                  ? `${existingPrompt}\n\n${movement.prompt}`
                  : movement.prompt;
                setPrompt(newPrompt);
                setError(null);
              }}
            />
          )}

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

          {loading && !videoUrl && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress}
              title="Generating Video"
            />
          )}

          {videoUrl && (
            <div className="mt-8 space-y-4 card p-6">
              <div className="aspect-video bg-white/5 rounded-xl overflow-hidden backdrop-blur-md shadow-lg shadow-black/10 border border-white/10">
                <video
                  src={videoUrl}
                  onError={e => {
                    console.error('Video error:', e);
                    setError(
                      'Failed to load video. Please try downloading and playing it locally.'
                    );
                  }}
                  className="w-full h-full"
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
                {error && <div className="p-4 bg-red-900/50 text-red-200 text-sm">{error}</div>}
                {error && <div className="p-4 bg-red-900/50 text-red-200 text-sm">{error}</div>}
              </div>
              <p className="text-center">
                <a
                  href={videoUrl}
                  download
                  className="text-[#9A6ACA] hover:text-[#BA8AEA] underline text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Video
                </a>
              </p>
            </div>
          )}
        </>
      }
      setPrompt={(prompt) => setPrompt(prompt)}
    />
  );
}

export default VideoGenerator;
