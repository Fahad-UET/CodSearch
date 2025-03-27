import React, { useEffect } from 'react';
import { Package, Upload, Loader2, Download, ExternalLink, Link2, X, Dices } from 'lucide-react';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import { useBackground } from '../store/background';
import { useHistory } from '../store/history';
import { useProductStore } from '@/store';
import { getAiGenerations } from '@/services/firebase/aiGenerations';
import { useLocation } from 'react-router-dom';
import ImageContainer from '@/components/AICreator/ImageContainer';

type AspectRatioEnum =
  | '10:16'
  | '16:10'
  | '9:16'
  | '16:9'
  | '4:3'
  | '3:4'
  | '1:1'
  | '1:3'
  | '3:1'
  | '3:2'
  | '2:3';
type StyleEnum = 'auto' | 'general' | 'realistic' | 'design' | 'render_3D' | 'anime';

interface IdeogramResponse {
  images: Array<{
    url: string;
  }>;
  seed: number;
}

function ProductImageVariations() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatioEnum>('1:1');
  const [style, setStyle] = React.useState<StyleEnum>('auto');
  const [strength, setStrength] = React.useState(0.8);
  const [expandPrompt, setExpandPrompt] = React.useState(true);
  const [seed, setSeed] = React.useState<number | undefined>();
  const { user } = useProductStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const { addItem } = useHistory();
  const API_KEY = import.meta.env.VITE_FAL_KEY || 'c356025c-0f92-4873-a43b-e3346e53cd93:b43044d3956488e624cac9d8ebdc098d';

  const EXAMPLE_PROMPT = 'An ice field in north atlantic';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = item => {
    if (item.type === 'product-variations' && item.content.imageUrl) {
      setOutputUrl(item.content.imageUrl);
      if (item.content.sourceImage) {
        setImageUrl(item.content.sourceImage);
      }
      if (item.content.prompt) {
        setPrompt(item.content.prompt);
      }
    }
  };
  useEffect(() => {
    const getData = async () => {
      try {
        setImageLoading(true)
        const result: any = await getAiGenerations(user?.uid, id);
        handleHistoryItemClick(result[0]);
      } catch (error) {
        console.log({ error });
      }finally{
        setImageLoading(false);
      }
    };
    if (user?.uid && id) {
      getData();
    }
  }, [user, id]);

  // Listen for response updates
  React.useEffect(() => {
    const handleResponse = ((event: CustomEvent) => {
      if (event.detail.type === 'product-variations' && event.detail?.images?.[0]) {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutputUrl(null);
    setProgress('');

    if (!imageUrl) {
      setError('Please provide a product image');
      setLoading(false);
      return;
    }

    if (!prompt) {
      setError('Please provide a prompt');
      setLoading(false);
      return;
    }

    try {
      // Validate URLs if not base64
      if (!isBase64) {
        try {
          new URL(imageUrl);
        } catch {
          throw new Error('Please enter a valid product image URL');
        }
      }

      const requestOptions = {
        prompt,
        image_url: imageUrl,
        aspect_ratio: aspectRatio,
        strength,
        expand_prompt: expandPrompt,
        style,
        seed,
      };

      // Create background task
      const taskId = addTask({
        type: 'product-variations',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<IdeogramResponse>(
        'fal-ai/ideogram/v2a/remix',
        API_KEY.trim(),
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
      startBackgroundPolling(
        taskId,
        'fal-ai/ideogram/v2a/remix',
        result?.request_id,
        API_KEY,
        user?.uid
      );

      setProgress('Request submitted. Processing your images...');
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
      } else if (errorMessage.toLowerCase().includes('400')) {
        errorMessage =
          'Invalid input images. Please ensure images are valid and in the correct format.';
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
      title="Product Variations"
      description="Create creative variations of product images with AI"
      controls={
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium">
              Product Image
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e)}
                onPasteText={text => handleUrlChange({ target: { value: text } } as any)}
                className="input-area flex-1"
                placeholder="https://example.com/product.jpg"
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
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                title="Upload Product Image"
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
            <p className="text-sm text-white/60">Upload a product image to transform (max 10MB)</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium">
              Prompt
            </label>
            <InputWithPaste
              id="prompt"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onPasteText={text => setPrompt(text)}
              multiline
              className="input-area"
              placeholder="Describe how you want to transform the product..."
              rows={3}
            />
            <button
              type="button"
              onClick={() => setPrompt(EXAMPLE_PROMPT)}
              className="text-sm text-[#9A6ACA] hover:text-[#BA8AEA] transition-colors"
            >
              Use example description
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                <option value="16:10">Widescreen (16:10)</option>
                <option value="10:16">Tall (10:16)</option>
                <option value="3:2">Photo (3:2)</option>
                <option value="2:3">Portrait Photo (2:3)</option>
                <option value="3:1">Panorama (3:1)</option>
                <option value="1:3">Vertical Panorama (1:3)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Style</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value as StyleEnum)}
                className="input-area"
              >
                <option value="auto">Auto</option>
                <option value="general">General</option>
                <option value="realistic">Realistic</option>
                <option value="design">Design</option>
                <option value="render_3D">3D Render</option>
                <option value="anime">Anime</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Strength</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={strength}
                onChange={e => setStrength(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>Subtle</span>
                <span>Strong</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Seed (Optional)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={seed}
                  onChange={e => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
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
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={expandPrompt}
                onChange={e => setExpandPrompt(e.target.checked)}
                className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
              />
              <span className="text-sm font-medium">Expand Prompt</span>
            </label>
            <p className="text-sm text-white/60 pl-6">
              Automatically enhance the prompt with additional details
            </p>
          </div>

          <button type="submit" disabled={loading || !imageUrl || !prompt} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                Generate Variation
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
              progressText={progress || 'Generating variation...'}
              title="Processing Image"
            />
          )}

          {(outputUrl || id) && (
            <div className="mt-8 space-y-4">
              <ImageContainer outputUrl={outputUrl} title={'Generated Variation'} imageLoading={imageLoading} />
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

export default ProductImageVariations;
