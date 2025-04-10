import React, { useEffect } from 'react';
import { Image, Loader2, Download, Dices, Sparkles, Video } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import OpenAI from 'openai';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import { useBackground } from '../store/background';
import type { Imagen3RequestOptions, Imagen3Response, AspectRatioEnum } from '../types/imagen';
import { useProductStore } from '@/store';
import { getAiGenerations } from '@/services/firebase/aiGenerations';

function TextToImage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = React.useState('');
  const [negativePrompt, setNegativePrompt] = React.useState('');
  const [images, setImages] = React.useState<{ url: string; content_type?: string }[]>([]);
  const [progress, setProgress] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [seed, setSeed] = React.useState<number | ''>('');
  const [numImages, setNumImages] = React.useState(1);
  const [percentage, setPercentage] = React.useState(0);
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatioEnum>('16:9');
  const [enhancingPrompt, setEnhancingPrompt] = React.useState(false);
  const { user } = useProductStore();
  const OPENAI_API_KEY =
    import.meta.env.VITE_OPENAI_API_KEY ||
    '';

  const { addTask } = useBackground();
  const API_KEY =
    import.meta.env.VITE_FAL_KEY ||
    '';
  const EXAMPLE_PROMPT =
    'A serene landscape with mountains reflected in a crystal clear lake at sunset, photorealistic style, dramatic lighting, 8k resolution';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = item => {
    if (item.type === 'text-to-image' && item.content.imageUrl) {
      setImages([{ url: item.content.imageUrl }]);
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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a prompt enhancement expert. Focus on creating detailed, vivid prompts that will generate high-quality, photorealistic images.',
          },
          {
            role: 'user',
            content: `You are an expert at writing prompts for AI image generation. Your task is to:
            1. If the input is not in English, translate it to English
            2. Enhance the prompt by adding specific details about:
               - Lighting (e.g., natural, dramatic, soft, golden hour)
               - Camera angle and perspective
               - Style (e.g., photorealistic, cinematic, artistic)
               - Quality indicators (e.g., 8k, high resolution, detailed)
               - Atmosphere and mood
            3. Keep the core idea of the original prompt but make it more vivid
            4. Format: Return ONLY the enhanced prompt, no explanations or additional text
            
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

  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  React.useEffect(() => {
    // Listen for response updates
    const handleResponse = ((event: CustomEvent) => {
      if (event.detail.type === 'text-to-image' && event.detail.images) {
        setImages(event.detail.images);
        if (event.detail.seed) {
          setSeed(event.detail.seed);
        }
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setImages([]);
    setProgress('');

    if (!prompt) {
      setError('Please provide a prompt');
      setLoading(false);
      return;
    }

    try {
      const requestOptions: Imagen3RequestOptions = {
        prompt,
        negative_prompt: negativePrompt || undefined,
        aspect_ratio: aspectRatio || undefined,
        num_images: numImages,
        seed: seed || undefined,
      };

      // Create background task
      const taskId = addTask({
        type: 'text-to-image',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<Imagen3Response>(
        'fal-ai/imagen3',
        API_KEY,
        requestOptions,
        (status, percent, logs) => {
          setPercentage(percent);
          setProgress(status);
          if (logs?.length) {
            console.log('Processing logs:', logs);
          }
        },
        'image'
      );
      // Start background polling
      startBackgroundPolling(taskId, 'fal-ai/imagen3', result?.request_id, API_KEY, user?.uid);

      setProgress('Request submitted. Processing your images...');
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('network error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      }

      setError(errorMessage);
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
      title="Text to Image"
      description="Create stunning images from text descriptions with AI"
       modelId="google/gemini-flash-1.5"
      controls={
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
            <div className="flex  justify-between  gap-11">
                  <label htmlFor="prompt" className="text-sm font-medium whitespace-nowrap">
                    Description Prompt
                  </label>
                  <p className="text-xs font-small text-red-300 ">
                    Only English prompts work. Use enhanced prompts  with AI for better results.
                  </p>
                </div>
              <div className="relative">
                <InputWithPaste
                  id="prompt"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onPasteText={text => setPrompt(text)}
                  multiline
                  className="input-area pr-12"
                  placeholder="Describe the image you want to generate..."
                  rows={4}
                />
                <button
                  type="button"
                  onClick={enhancePrompt}
                  disabled={!prompt || enhancingPrompt}
                  className="absolute right-3 top-3 p-2 text-white/80 hover:text-[#9A6ACA] transition-colors rounded-md hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Enhance prompt with AI"
                >
                  {enhancingPrompt ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setPrompt(EXAMPLE_PROMPT)}
                className="text-sm text-[#9A6ACA] hover:text-[#BA8AEA] transition-colors"
              >
                Use example prompt
              </button>
            </div>

            <div className="space-y-2">
              <label htmlFor="negativePrompt" className="block text-sm font-medium">
                Negative Prompt (Optional)
              </label>
              <InputWithPaste
                id="negativePrompt"
                value={negativePrompt}
                onChange={e => setNegativePrompt(e.target.value)}
                onPasteText={text => setNegativePrompt(text)}
                multiline
                className="input-area"
                placeholder="Describe what you don't want to see in the image..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Seed</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={seed}
                    onChange={e => setSeed(e.target.value ? parseInt(e.target.value) : '')}
                    className="input-area"
                    placeholder="Random"
                  />
                  <button
                    type="button"
                    onClick={generateRandomSeed}
                    className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                    title="Generate Random Seed"
                  >
                    <Dices className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Number of Images</label>
                <input
                  type="number"
                  value={numImages}
                  onChange={e =>
                    setNumImages(Math.max(1, Math.min(4, parseInt(e.target.value) || 1)))
                  }
                  min="1"
                  max="4"
                  className="input-area"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={e => setAspectRatio(e.target.value as AspectRatioEnum)}
                className="input-area"
              >
                <option value="1:1">Square (1:1)</option>
                <option value="16:9">Landscape (16:9)</option>
                <option value="9:16">Portrait (9:16)</option>
                <option value="4:3">Standard (4:3)</option>
                <option value="3:4">Portrait (3:4)</option>
              </select>
            </div>

            <button type="submit" disabled={loading || !prompt} className="btn-primary">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {progress || 'Processing... This may take a few minutes'}
                </>
              ) : (
                <>
                  <Image className="w-5 h-5" />
                  Generate Images
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
                  <ApiKeyError error={error} />
                ) : (
                  <div className="flex-1">
                    <p className="font-medium mb-1">Error:</p>
                    <p className="whitespace-pre-wrap">{error}</p>
                    {error.toLowerCase().includes('language') && (
                      <div className="mt-4 p-3 bg-red-800/50 rounded-lg">
                        <p className="font-medium">Tip:</p>
                        <p>
                          Please write your prompt in English. Other languages are not supported by
                          this model.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {loading && !images.length && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress || 'Generating your images...'}
              title="Generating Images"
            />
          )}

          {images.length > 0 && (
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-medium flex items-center gap-2">
                <Image className="w-5 h-5" />
                Generated Images
              </h2>
              <div className="grid grid-cols-12 gap-1">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="card col-span-9 overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg"
                  >
                    <img
                      src={image.url}
                      alt={`Generated ${index + 1}`}
                      className="w-full h-auto aspect-square object-cover bg-white/5"
                      loading="lazy"
                      onError={e => {
                        const currentSrc = e.currentTarget.src;
                        const retries = parseInt(e.currentTarget.dataset.retries || '0');

                        // Try different CDN endpoints and add cache busting
                        const endpoints = [
                          'v3.fal.media',
                          'v2.fal.media',
                          'v1.fal.media',
                          'storage.fal.ai',
                        ];

                        if (retries < endpoints.length && !currentSrc.includes('fallback')) {
                          const nextEndpoint = endpoints[retries];
                          const newUrl = image.url.replace(/v[1-3]\.fal\.media/, nextEndpoint);
                          const img = e.currentTarget;
                          if (!img) return;

                          // Add timestamp to prevent caching issues
                          img.dataset.retries = (retries + 1).toString();
                          const cacheBuster = `?t=${Date.now()}&retry=${retries + 1}`;
                          img.style.opacity = '0.5';
                          img.src = `${newUrl}${cacheBuster}`;

                          // Reset opacity after a short delay
                          setTimeout(() => {
                            if (img && img.style) {
                              img.style.opacity = '1';
                            }
                          }, 300);
                        } else {
                          // Show fallback image and error message
                          const img = e.currentTarget;
                          if (!img) return;

                          img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E`;
                          img.classList.add('p-12', 'opacity-50');

                          const container = img.parentElement;
                          if (container) {
                            // Remove any existing error message
                            const existingError = container.querySelector('.error-message');
                            if (existingError) {
                              existingError.remove();
                            }

                            const errorDiv = document.createElement('div');
                            errorDiv.className =
                              'error-message p-4 border-t border-red-500/20 bg-red-500/10';
                            errorDiv.innerHTML = `
                              <p class="text-xs text-red-400 text-center">
                                Image failed to load. You can try:
                                <br>1. Downloading directly using the link below
                                <br>2. Generating a new image
                                <br>3. Waiting a few minutes and trying again
                                <br><span class="text-red-300 mt-2 block">Error: Failed to load from ${endpoints.join(
                                  ', '
                                )}</span>
                              </p>
                            `;
                            container.appendChild(errorDiv);
                          }
                        }
                      }}
                      onLoad={e => {
                        // Reset any error styling on successful load
                        const img = e.currentTarget;
                        if (!img) return;

                        img.classList.remove('p-12', 'opacity-50');
                        const container = img.parentElement;
                        if (container) {
                          const errorMessage = container.querySelector('.error-message');
                          if (errorMessage) {
                            errorMessage.remove();
                          }
                        }
                      }}
                    />
                    <div className="py-4 px-1 border-t border-white/10">
                      <div className="flex justify-center gap-2 flex-wrap">
                        <button
                          onClick={(e: React.MouseEvent) => handleDownload(e, image.url)}
                          className="flex whitespace-nowrap items-center gap-1 transition-colors p-2 text-sm bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button
                          onClick={() => {
                            sessionStorage.setItem('imageToVideo', image.url);
                            navigate('/video');
                          }}
                          className="flex whitespace-nowrap items-center gap-1 transition-colors p-2 text-sm bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90"
                        >
                          <Video className="w-4 h-4" />
                          Use in Video
                        </button>
                        <button 
                        onClick={() => {
                          sessionStorage.setItem('TextToVedio', prompt);
                          navigate('/veo2');
                        }}
                        className="flex whitespace-nowrap items-center gap-1 transition-colors p-2 text-sm bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90">
                          Text to Vedio 
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {seed !== '' && (
                <p className="text-center text-sm text-white/60">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(seed.toString());
                      const el = document.createElement('span');
                      el.className = 'text-green-400 ml-2';
                      el.textContent = 'Copied!';
                      const p = document.activeElement?.parentElement;
                      if (p) {
                        p.appendChild(el);
                        setTimeout(() => el.remove(), 2000);
                      }
                    }}
                    className="hover:text-white/80 transition-colors"
                  >
                    Seed: {seed} (Click to copy)
                  </button>
                </p>
              )}
            </div>
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
      setPrompt={(prompt) => {setPrompt(prompt)}}
    />
  );
}

export default TextToImage;
