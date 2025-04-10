import React, { useEffect } from 'react';
import { Wand2, Upload, Loader2, Download, ExternalLink, Link2, X, Dices } from 'lucide-react';
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

interface RetoucherResponse {
  image: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
  seed?: number;
}

function FaceRetoucher() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [seed, setSeed] = React.useState<number | undefined>();
  const { user } = useProductStore();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const { addItem } = useHistory();
  const API_KEY = import.meta.env.VITE_FAL_KEY || '';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = (item: any) => {
    if (item.type === 'face-retoucher' && item.content.imageUrl) {
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
      }finally{
        setImageLoading(false)
      }
    };
    if (user?.uid && id) {
      getData();
    }
  }, [user, id]);
  // Listen for response updates
  React.useEffect(() => {
    const handleResponse = (async (event: CustomEvent) => {
      if (event.detail.type === 'face-retoucher' && event.detail?.images) {
        setOutputUrl(event.detail.images.url);
        if (event.detail.seed) {
          setSeed(event.detail.seed);
        }
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, [imageUrl, addItem]);

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
      setError('Please provide an image');
      setLoading(false);
      return;
    }

    try {
      // Validate URL if not base64
      if (!isBase64) {
        try {
          new URL(imageUrl);
        } catch {
          throw new Error('Please enter a valid URL');
        }
      }

      const requestOptions = {
        image_url: imageUrl,
        seed,
      };

      // Create background task
      const taskId = addTask({
        type: 'face-retoucher',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<RetoucherResponse>(
        'fal-ai/retoucher',
        API_KEY,
        requestOptions,
        (status, percent, logs) => {
          setPercentage(percent);
          setProgress(status);
        },
        'image'
      );

      // Start background polling
      startBackgroundPolling(taskId, 'fal-ai/retoucher', result?.request_id, API_KEY, user?.uid);

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
      } else if (errorMessage.toLowerCase().includes('400')) {
        errorMessage =
          'Invalid input image. Please ensure the image is valid and in the correct format.';
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
      title="Face Retoucher"
      description="Remove blemishes and retouch face photos with AI"
         modelId="fal-ai/retoucher"
      controls={
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="imageUrl" className="block text-sm font-medium">
              Face Photo
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e)}
                onPasteText={text => handleUrlChange({ target: { value: text } } as any)}
                className="input-area flex-1"
                placeholder="https://example.com/photo.jpg"
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
                title="Upload Photo"
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
            <p className="text-sm text-white/60">Upload a face photo to retouch (max 10MB)</p>
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
            <p className="text-sm text-white/60">Optional: Set a seed for reproducible results</p>
          </div>

          <button type="submit" disabled={loading || !imageUrl} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Retouch Photo
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
              progressText={progress || 'Retouching photo...'}
              title="Processing Image"
            />
          )}

          {(outputUrl || id) && (
            <div className="mt-8 space-y-4">
              <ImageContainer outputUrl={outputUrl} title={'Retouched Photo'} imageLoading={imageLoading} />
              {seed !== undefined && (
                <p className="text-center text-sm text-white/60">Seed: {seed} (Click to copy)</p>
              )}
            </div>
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
    />
  );
}

export default FaceRetoucher;
