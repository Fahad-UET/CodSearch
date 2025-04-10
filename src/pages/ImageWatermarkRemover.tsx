import React, { useEffect } from 'react';
import { Eraser, Upload, Loader2, Download, ExternalLink, Link2, X, Brush } from 'lucide-react';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import ToolLayout from '@/components/AICreator/ToolLayout';
import InputWithPaste from '@/components/AICreator/InputWithPaste';
import MaskEditor from '@/components/AICreator/MaskEditor';
import { useBackground } from '../store/background';
import { useHistory } from '../store/history';
import { useProductStore } from '@/store';
import { useLocation } from 'react-router-dom';
import { getAiGenerations } from '@/services/firebase/aiGenerations';
import ImageContainer from '@/components/AICreator/ImageContainer';

interface InpaintingResponse {
  images: Array<{
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
    width: number;
    height: number;
  }>;
}

function ImageWatermarkRemover() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [maskUrl, setMaskUrl] = React.useState('');
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [showMaskEditor, setShowMaskEditor] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const { user } = useProductStore();
  const API_KEY = import.meta.env.VITE_FAL_KEY || '';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = (item: any) => {
    if (item.type === 'image-watermark-remover' && item.content.imageUrl) {
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

  // Show API key error if not set
  React.useEffect(() => {
    if (!API_KEY) {
      setError('Please set your FAL API key in the .env file as VITE_FAL_KEY');
    }
  }, [API_KEY]);

  // Listen for response updates
  React.useEffect(() => {
    const handleResponse = ((event: CustomEvent) => {
      if (event.detail.type === 'image-watermark-remover' && event.detail.result?.images?.[0]) {
        setOutputUrl(event.detail.result.images[0].url);
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, [imageUrl]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate image URL
    if (!imageUrl) {
      setError('Please provide an image');
      return;
    }

    // Validate mask URL
    if (!maskUrl) {
      setError('Please create a mask first');
      return;
    }

    // Verify mask data
    try {
      const maskImage = new Image();
      maskImage.src = maskUrl;
      await new Promise((resolve, reject) => {
        maskImage.onload = resolve;
        maskImage.onerror = reject;
      });

      // Create a canvas to verify mask data
      const canvas = document.createElement('canvas');
      canvas.width = maskImage.width;
      canvas.height = maskImage.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to create canvas context');

      // Draw and verify mask
      ctx.drawImage(maskImage, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Check if mask contains any white pixels
      let hasWhitePixels = false;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
          hasWhitePixels = true;
          break;
        }
      }

      if (!hasWhitePixels) {
        setError('Please paint the area you want to remove in the mask editor');
        return;
      }
    } catch (err) {
      setError('Failed to process mask. Please try creating the mask again.');
      return;
    }

    setLoading(true);
    setError(null);
    setOutputUrl(null);
    setProgress('');

    // Prepare API request
    const requestOptions = {
      // Required parameters
      inpaint_image_url: imageUrl,
      mask_image_url: maskUrl,

      // Optional parameters with good defaults for watermark removal
      prompt: prompt || 'Remove watermark and restore original content',
      negative_prompt:
        '(worst quality, low quality, normal quality, lowres, low details, oversaturated, undersaturated, overexposed, underexposed, grayscale, bw, bad photo, bad photography, bad art:1.4), (watermark, signature, text font, username, error, logo, words, letters, digits, autograph, trademark, name:1.2), (blur, blurry, grainy), morbid, ugly, asymmetrical, mutated malformed, mutilated, poorly lit, bad shadow, draft, cropped, out of frame, cut off, censored, jpeg artifacts, out of focus, glitch, duplicate, (airbrushed, cartoon, anime, semi-realistic, cgi, render, blender, digital art, manga, amateur:1.3)',
      styles: ['Fooocus Enhance', 'Fooocus V2', 'Fooocus Sharp'],
      performance: 'Extreme Speed',
      guidance_scale: 7.5,
      sharpness: 2,
      inpaint_mode: 'Inpaint or Outpaint (default)',
      inpaint_additional_prompt: 'Remove watermark and restore original content',
      inpaint_engine: 'v2.6',
      inpaint_strength: 1,
      inpaint_respective_field: 0.618,
      enable_safety_checker: true,
      output_format: 'png',
    };

    try {

      // Create background task
      const taskId = addTask({
        type: 'image-watermark-remover',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });
      setProgress('Submitting request...');

      // Submit request
      const result: any = await submitToQueue<InpaintingResponse>(
        'fal-ai/fooocus/inpaint',
        API_KEY,
        requestOptions,
        (status, percent, logs) => {
          setPercentage(Math.max(0, Math.min(100, percent)));
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
        'fal-ai/fooocus/inpaint',
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
        errorMessage = 'Invalid request parameters. Please check your image and mask formats.';
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
      title="Remove Watermark"
      description="Remove watermarks from images with AI"
         modelId="fal-ai/fooocus/inpaint"
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange(e)}
                onPasteText={text => handleUrlChange({ target: { value: text } } as any)}
                className="input-area flex-1"
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
            <p className="text-sm text-white/60">Upload an image to remove watermarks (max 10MB)</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Watermark Mask</label>
            <button
              type="button"
              onClick={() => setShowMaskEditor(true)}
              disabled={!imageUrl}
              className="w-full px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Brush className="w-5 h-5" />
              {maskUrl ? 'Edit Mask' : 'Create Mask'}
            </button>
            <p className="text-sm text-white/60">
              Paint over the watermark area you want to remove
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium">
              Restoration Prompt (Optional)
            </label>
            <InputWithPaste
              id="prompt"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onPasteText={text => setPrompt(text)}
              multiline
              className="input-area"
              placeholder="Describe how to restore the image (e.g., 'Remove watermark and restore the original content')"
              rows={2}
            />
          </div>

          <button type="submit" disabled={loading || !imageUrl || !maskUrl} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <Eraser className="w-5 h-5" />
                Remove Watermark
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
              progressText={progress || 'Removing watermark...'}
              title="Processing Image"
            />
          )}

          {(outputUrl || id) && (
            <div className="mt-8 space-y-4">
              <ImageContainer outputUrl={outputUrl} title={'Watermark Removed'} imageLoading={imageLoading} />
            </div>
          )}

          {showMaskEditor && imageUrl && (
            <MaskEditor
              imageUrl={imageUrl}
              onClose={() => setShowMaskEditor(false)}
              onMaskGenerated={maskDataUrl => {
                setMaskUrl(maskDataUrl);
                setShowMaskEditor(false);
              }}
            />
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
      setPrompt={(prompt) => setPrompt(prompt)}
    />
  );
}

export default ImageWatermarkRemover;
