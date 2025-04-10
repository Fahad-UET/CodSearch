import React, { useEffect } from 'react';
import { Package, Upload, Loader2, Download, ExternalLink, Link2, X } from 'lucide-react';
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
import ImageContainer from '@/components/AICreator/ImageContainer';

type ImageSizeEnum =
  | 'square_hd'
  | 'square'
  | 'portrait_4_3'
  | 'portrait_16_9'
  | 'landscape_4_3'
  | 'landscape_16_9';
type InitialLatentEnum = 'None' | 'Left' | 'Right' | 'Top' | 'Bottom';
type OutputFormatEnum = 'jpeg' | 'png';

interface IcLightResponse {
  image: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt: string;
}

function ProductImageToImage() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const { user } = useProductStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const { addItem } = useHistory();
  const API_KEY = import.meta.env.VITE_FAL_KEY || '';

  const EXAMPLE_PROMPT = 'perfume bottle in a volcano surrounded by lava.';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = (item: any) => {
    if (item.type === 'product-image' && item.content.imageUrl) {
      setOutputUrl(item.content.imageUrl);
      if (item.content.sourceImage) {
        setImageUrl(item.content.sourceImage);
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
      }finally { setImageLoading(false) }
    };
    if (user?.uid && id) {
      getData();
    }
  }, [user, id]);

  // Listen for response updates
  React.useEffect(() => {
    const handleResponse = ((event: CustomEvent) => {
      if (event.detail.type === 'product-image' && event.detail.result?.image) {
        setOutputUrl(event.detail.result.image.url);
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, [imageUrl, prompt, addItem]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 12 * 1024 * 1024; // 12MB limit
      if (file.size > maxSize) {
        setError(
          'File size must be less than 12MB. Please compress your image or use a smaller file.'
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
        image_size: {
          width: 1280,
          height: 720,
        },
        num_inference_steps: 30,
        guidance_scale: 7.5,
        negative_prompt: '',
        num_images: 1,
      };

      // Create background task
      const taskId = addTask({
        type: 'product-image',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<IcLightResponse>(
        'fal-ai/iclight-v2',
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
      startBackgroundPolling(taskId, 'fal-ai/iclight-v2', result?.request_id, API_KEY, user?.uid);

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
          'File size too large. Please use a smaller image (max 12MB) or reduce the dimensions.';
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
      title="Product Shot"
      description="Transform product images with creative lighting and effects"
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
            <p className="text-sm text-white/60">Upload a product image to transform (max 12MB)</p>
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

          <button type="submit" disabled={loading || !imageUrl || !prompt} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                Generate Product Shot
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
              progressText={progress || 'Generating product shot...'}
              title="Processing Image"
            />
          )}

          {(outputUrl || id) && (
            <div className="mt-8 space-y-4">
              <ImageContainer outputUrl={outputUrl} title={'Product Shot'} imageLoading={imageLoading} />
            </div>
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
      setPrompt={(prompt) => setPrompt(prompt)}
    />
  );
}

export default ProductImageToImage;
