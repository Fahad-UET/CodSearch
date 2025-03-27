import React, { useEffect } from 'react';
import { Replace, Upload, Loader2, Download, ExternalLink, Link2, X } from 'lucide-react';
import { submitToQueue } from '@/utils/api';
import { startBackgroundPolling } from '@/utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import { useBackground } from '@/store/background';
import { useHistory } from '@/store/history';
import { useProductStore } from '@/store';
import { useLocation } from 'react-router-dom';
import { getAiGenerations } from '@/services/firebase/aiGenerations';
import ImageContainer from '@/components/AICreator/ImageContainer';

interface BackgroundReplaceResponse {
  images: Array<{
    url: string;
    content_type: string;
  }>;
  seed?: number;
}

function ChangeImageBackground() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [refImageUrl, setRefImageUrl] = React.useState('');
  const [isRefBase64, setIsRefBase64] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [fast, setFast] = React.useState(true);
  const [refinePrompt, setRefinePrompt] = React.useState(true);
  const [numImages, setNumImages] = React.useState(1);
  const [seed, setSeed] = React.useState<number | undefined>();
  const { user } = useProductStore();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const refFileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const { addItem } = useHistory();
  const API_KEY = import.meta.env.VITE_FAL_KEY || 'c356025c-0f92-4873-a43b-e3346e53cd93:b43044d3956488e624cac9d8ebdc098d';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  useEffect(() => {
    const getData = async () => {
      try {
        setImageLoading(true)
        const result: any = await getAiGenerations(user?.uid, id);
        handleHistoryItemClick(result[0]);
      } catch (error) {
        console.log({ error });
      } finally { setImageLoading(false) }
    };
    if (user?.uid && id) {
      getData();
    }
  }, [user, id]);

  const handleHistoryItemClick = (item: any) => {
    if (item.type === 'change-image-background' && item.content.imageUrl) {
      setOutputUrl(item.content.imageUrl);
      if (item.content.sourceImage) {
        setImageUrl(item.content.sourceImage);
      }
      if (item.content.prompt) {
        setPrompt(item.content.prompt);
      }
    }
  };

  // Show API key error if not set
  React.useEffect(() => {
    if (!API_KEY) {
      setError('Please set your FAL API key in the .env file as VITE_FAL_KEY');
    }
  }, [API_KEY]);

  // Listen for response updates
  React.useEffect(() => {
    const handleResponse = (async (event: CustomEvent) => {
      if (event.detail.type === 'change-image-background' && event.detail?.images?.[0]) {
        setOutputUrl(event.detail.images[0].url);
        if (event.detail?.prompt) {
          setPrompt(event.detail.prompt);
        }
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, [imageUrl, prompt, addItem]);

  const handleFileUpload = (type: 'main' | 'ref') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB limit
      if (file.size > maxSize) {
        setError(
          'File size must be less than 10MB. Please compress your image or use a smaller file.'
        );
        return;
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const maxDimension = 2048;
        if (img.width > maxDimension || img.height > maxDimension) {
          setError(
            `Image dimensions too large. Maximum allowed is ${maxDimension}x${maxDimension} pixels.`
          );
          return;
        }

        // If dimensions are ok, proceed with base64 conversion
        const reader = new FileReader();
        reader.onloadend = () => {
          if (type === 'main') {
            setImageUrl(reader.result as string);
            setIsBase64(true);
          } else {
            setRefImageUrl(reader.result as string);
            setIsRefBase64(true);
          }
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

  const handleUrlChange = (type: 'main' | 'ref') => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'main') {
      setImageUrl(e.target.value);
      setIsBase64(false);
    } else {
      setRefImageUrl(e.target.value);
      setIsRefBase64(false);
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutputUrl(null);
    setProgress('');

    if (!imageUrl) {
      setError('Please provide an image');
      setLoading(false);
      return;
    }

    if (!refImageUrl && !prompt) {
      setError('Please provide either a reference image or a prompt');
      setLoading(false);
      return;
    }

    if (refImageUrl && prompt) {
      setError('Please provide either a reference image OR a prompt, not both');
      setLoading(false);
      return;
    }

    try {
      // Validate URLs if not base64
      if (!isBase64) {
        try {
          new URL(imageUrl);
        } catch {
          throw new Error('Please enter a valid image URL');
        }
      }

      if (refImageUrl && !isRefBase64) {
        try {
          new URL(refImageUrl);
        } catch {
          throw new Error('Please enter a valid reference image URL');
        }
      }

      const requestOptions = {
        image_url: imageUrl,
        ref_image_url: refImageUrl || undefined,
        prompt: prompt || undefined,
        refine_prompt: refinePrompt,
        fast,
        num_images: numImages,
        seed,
      };

      // Create background task
      const taskId = addTask({
        type: 'change-image-background',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<BackgroundReplaceResponse>(
        'fal-ai/bria/background/replace',
        API_KEY,
        requestOptions,
        (status, percent, logs) => {
          setPercentage(percent);
          setProgress(status);
        },
        'image'
      );

      // Start background polling
      startBackgroundPolling(
        taskId,
        'fal-ai/bria/background/replace',
        result?.request_id,
        API_KEY,
        user?.uid
      );

      setProgress('Request submitted. Processing your image...');
    } catch (err) {
      let errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('network error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('failed to fetch')) {
        errorMessage = 'Connection error. Please check your internet connection and try again.';
      } else if (errorMessage.toLowerCase().includes('413')) {
        errorMessage =
          'File size too large. Please use a smaller image (max 10MB) or reduce the dimensions.';
      } else if (errorMessage.toLowerCase().includes('api key')) {
        errorMessage = 'Invalid API key. Please check your FAL API key in the .env file.';
      } else if (errorMessage.toLowerCase().includes('invalid request')) {
        errorMessage = 'Invalid request parameters. Please check your image formats.';
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
      title="Change Background"
      description="Replace image backgrounds with AI"
      controls={
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium">
              Image File or URL
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange('main')(e)}
                onPasteText={text => handleUrlChange('main')({ target: { value: text } } as any)}
                className="input-area flex-1"
                placeholder="https://example.com/image.jpg"
                disabled={isBase64}
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload('main')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                title="Upload Image"
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
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-white/60">
              Upload an image to change its background (max 10MB)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="refImageUrl" className="block text-sm font-medium">
              Reference Background Image (Optional)
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="refImageUrl"
                type="text"
                value={refImageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange('ref')(e)}
                onPasteText={text => handleUrlChange('ref')({ target: { value: text } } as any)}
                className="input-area flex-1"
                placeholder="https://example.com/background.jpg"
                disabled={isRefBase64 || !!prompt}
              />
              <input
                type="file"
                ref={refFileInputRef}
                onChange={handleFileUpload('ref')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => refFileInputRef.current?.click()}
                className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                title="Upload Reference Image"
                disabled={!!prompt}
              >
                <Upload className="w-5 h-5" />
              </button>
              {isRefBase64 && (
                <button
                  type="button"
                  onClick={() => {
                    setRefImageUrl('');
                    setIsRefBase64(false);
                  }}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-white/60">
              Optional: Upload a reference image for the new background
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium">
              Background Description (Optional)
            </label>
            <InputWithPaste
              id="prompt"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onPasteText={text => setPrompt(text)}
              multiline
              className="input-area"
              placeholder="Describe the new background (e.g., 'A serene beach at sunset')"
              rows={2}
              disabled={!!refImageUrl}
            />
            <p className="text-sm text-white/60">
              Optional: Describe the background you want to generate
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Processing Speed</label>
              <select
                value={fast ? 'fast' : 'quality'}
                onChange={e => setFast(e.target.value === 'fast')}
                className="input-area"
              >
                <option value="fast">Fast</option>
                <option value="quality">High Quality</option>
              </select>
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
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={refinePrompt}
                onChange={e => setRefinePrompt(e.target.checked)}
                className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
              />
              <span className="text-sm font-medium">Refine Prompt</span>
            </label>
            <p className="text-sm text-white/60 pl-6">
              Automatically enhance the prompt with additional details
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !imageUrl || (!refImageUrl && !prompt)}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <Replace className="w-5 h-5" />
                Change Background
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
              progressText={progress || 'Changing background...'}
              title="Processing Image"
            />
          )}

          {(outputUrl || id) && (
            <div className="mt-8 space-y-4">
              <ImageContainer outputUrl={outputUrl} title={'Background Changed'} imageLoading={imageLoading} />
              {seed !== undefined && (
                <p className="text-center text-sm text-white/60">Seed: {seed} (Click to copy)</p>
              )}
            </div>
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
      setPrompt={(prompt) => setPrompt(prompt)}
    />
  );
}

export default ChangeImageBackground;
