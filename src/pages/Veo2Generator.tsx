import React, { useEffect } from 'react';
import {
  Upload,
  Video,
  Loader2,
  Camera,
  Sparkles,
  ExternalLink,
  Link2,
  Download,
} from 'lucide-react';
import OpenAI from 'openai';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import PromptGeneratorModal from '@/components/AICreator/PromptGeneratorModal';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import CameraMovementModal from '@/components/AICreator/CameraMovementModal';
import { useBackground } from '../store/background';
import type { Veo2RequestOptions, Veo2Response, AspectRatio, Duration } from '../types/veo2';
import { useProductStore } from '@/store';
import { useLocation } from 'react-router-dom';
import { getAiGenerations } from '@/services/firebase/aiGenerations';

function Veo2Generator() {
  const [prompt, setPrompt] = React.useState('');
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>('16:9');
  const [duration, setDuration] = React.useState<Duration>('5s');
  const [enhancingPrompt, setEnhancingPrompt] = React.useState(false);
  const [showCameraModal, setShowCameraModal] = React.useState(false);
  const [showPromptModal, setShowPromptModal] = React.useState(false);
  const { user } = useProductStore();
  const { addTask } = useBackground();
  const API_KEY =
    import.meta.env.VITE_FAL_KEY;
  const OPENAI_API_KEY =
    import.meta.env.VITE_OPENAI_API_KEY;

  const EXAMPLE_PROMPT =
    'Professional Cinematic Scene\n\nScene Overview:\nCreate a single, impactful 5-second shot in 4K resolution. Focus on achieving a natural, cinematic look with professional camera work and authentic lighting. The composition should be clean and purposeful, without any text overlays or graphics.\n\nLighting and Atmosphere:\nMain Lighting: Natural lighting setup that enhances depth and dimension.\nAccent Lights: Subtle edge lighting for natural subject separation.\nMood: Create an authentic atmosphere that matches the scene context.\n\nVisual Style:\nColor Treatment: Natural color palette with balanced tones.\nFocus: Professional depth of field to guide viewer attention.\nDepth: Create natural depth through thoughtful composition.\n\nPost-Processing:\nSharpness: Professional clarity while maintaining natural film-like qualities.\nContrast: Balanced dynamic range for a cinematic look.\nColor Grading: Professional grade inspired by high-end cinema cameras.';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = (item: any) => {
    if (item.type === 'veo2' && item.content.videoUrl) {
      setVideoUrl(item.content.videoUrl);
      if (item.content.prompt) {
        setPrompt(item.content.prompt);
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

  React.useEffect(() => {
    const TextToImage = sessionStorage.getItem('TextToVedio');
    if (TextToImage) {
      setPrompt(TextToImage);
      // Clear the stored URL
      sessionStorage.removeItem('TextToVedio');
    }
  }, []);

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
              'You are a cinematography and video sequence expert. Focus on creating detailed, vivid descriptions that will generate high-quality, cinematic video sequences.',
          },
          {
            role: 'user',
            content: `You are an expert at writing prompts for AI video generation. Your task is to:
  
1. If the input is not in English, translate it to English
         
 2. Scene Overview:
Create a dynamic and engaging video optimized for TikTok advertising, featuring ultra-sharp 4K quality .

Lighting and Atmosphere:
Main Lighting: Implement high-key lighting setup with strong contrast to make colors pop and details sharp.
Accent Lights: Position rim lights to create separation and depth, emphasizing product edges or subject silhouettes.

Post-Processing:
Sharpness: Enhance detail clarity without over-processing.
Contrast: Boost dynamic range for impactful presentation.
Stabilization: Apply subtle stabilization while preserving intentional camera movements.
Color Grading: Implement punchy, social media-optimized color grade that pops on mobile screens.
does not add stars or special characters to raw text
3. Format: Return ONLY the enhanced prompt, no explanations


            
            Original prompt: "${prompt}"`,
          },
        ],
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

    if (!prompt) {
      setError('Please provide a prompt');
      setLoading(false);
      return;
    }

    try {
      const requestOptions: Veo2RequestOptions = {
        prompt,
        aspect_ratio: aspectRatio,
        duration,
      };

      // Create background task
      const taskId = addTask({
        type: 'veo2',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<Veo2Response>(
        'fal-ai/veo2',
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
      startBackgroundPolling(taskId, 'fal-ai/veo2', result.request_id, API_KEY, user?.uid);

      // Listen for video updates
      const handleVideoUpdate = (event: CustomEvent) => {
        const { videoUrl: newVideoUrl } = event.detail;
        if (newVideoUrl) {
          setVideoUrl(newVideoUrl);
          setLoading(false);
        }
      };

      window.addEventListener('video-update', handleVideoUpdate as EventListener);

      // Cleanup listener when component unmounts
      return () => {
        window.removeEventListener('video-update', handleVideoUpdate as EventListener);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setProgress('');
      setLoading(false);
    }
  };

  const handleDownload = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = url.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error('Download failed:', err));
  };

  return (
    <ToolLayout
      title="Text to Video"
      description="Create cinematic videos from text descriptions"
      controls={
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <button
              type="button"
              onClick={() => setShowPromptModal(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-[#4A2A7A] to-[#7A4AAA] hover:from-[#5A3A8A] hover:to-[#8A5ABA] rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-[#2A1A5A]/20 mb-6"
            >
              <Sparkles className="w-5 h-5" />
              <span>Open Video Prompt Generator</span>
            </button>

            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium">
                Scene Description
              </label>
              <div className="relative">
                <InputWithPaste
                  id="prompt"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onPasteText={text => setPrompt(text)}
                  multiline
                  className="input-area pr-12"
                  placeholder="Describe the cinematic scene you want to generate..."
                  rows={6}
                />
                <div className="absolute right-3 top-3">
                  <button
                    type="button"
                    onClick={enhancePrompt}
                    disabled={!prompt || enhancingPrompt}
                    className="p-2 text-white/80 hover:text-[#9A6ACA] transition-colors rounded-md hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
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
                onClick={() => setPrompt(EXAMPLE_PROMPT)}
                className="text-sm text-[#9A6ACA] hover:text-[#BA8AEA] transition-colors"
              >
                Use example prompt
              </button>
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
                <label className="block text-sm font-medium">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={e => setAspectRatio(e.target.value as AspectRatio)}
                  className="input-area"
                >
                  <option value="16:9">Landscape (16:9)</option>
                  <option value="9:16">Portrait (9:16)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Duration</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value as Duration)}
                  className="input-area"
                >
                  <option value="5s">5 seconds</option>
                  <option value="6s">6 seconds</option>
                  <option value="7s">7 seconds</option>
                  <option value="8s">8 seconds</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading || !prompt} className="btn-primary">
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
          {showPromptModal && (
            <PromptGeneratorModal
              onClose={() => setShowPromptModal(false)}
              onPromptGenerated={generatedPrompt => {
                setPrompt(generatedPrompt);
                setShowPromptModal(false);
              }}
            />
          )}
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
              <div className="aspect-video bg-[#1A1A3A]/30 rounded-xl overflow-hidden backdrop-blur-md shadow-lg shadow-[#4A3A7A]/20 border border-[#4A3A7A]/20">
                <video
                  src={videoUrl}
                  className="w-full h-full"
                  muted
                  loop
                  onMouseEnter={e => e.currentTarget.play()}
                  onMouseLeave={e => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={(e: React.MouseEvent) => handleDownload(e, videoUrl)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                  title="Download video"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(videoUrl)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                  title="Copy video URL"
                >
                  <Link2 className="w-4 h-4" />
                  Copy URL
                </button>
              </div>
            </div>
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
      setPrompt={(prompt) => setPrompt(prompt)}
    />
  );
}

export default Veo2Generator;
