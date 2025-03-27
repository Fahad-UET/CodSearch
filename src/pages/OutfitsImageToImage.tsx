import React, { useEffect } from 'react';
import { Shirt, Upload, Loader2, Download, ExternalLink, Link2, X } from 'lucide-react';
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

type CategoryEnum = 'tops' | 'bottoms' | 'one-pieces';
type GarmentPhotoTypeEnum = 'auto' | 'model' | 'flat-lay';

interface KolorsResponse {
  image: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
    width: number;
    height: number;
  };
}

function OutfitsImageToImage() {
  const [humanImageUrl, setHumanImageUrl] = React.useState('');
  const [isHumanBase64, setIsHumanBase64] = React.useState(false);
  const [garmentImageUrl, setGarmentImageUrl] = React.useState('');
  const [isGarmentBase64, setIsGarmentBase64] = React.useState(false);
  const [outputUrl, setOutputUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const [category, setCategory] = React.useState<CategoryEnum>('tops');
  const [garmentPhotoType, setGarmentPhotoType] = React.useState<GarmentPhotoTypeEnum>('auto');
  const [nsfwFilter, setNsfwFilter] = React.useState(true);
  const [coverFeet, setCoverFeet] = React.useState(false);
  const [adjustHands, setAdjustHands] = React.useState(false);
  const [restoreBackground, setRestoreBackground] = React.useState(false);
  const [restoreClothes, setRestoreClothes] = React.useState(false);
  const [longTop, setLongTop] = React.useState(false);
  const [guidanceScale, setGuidanceScale] = React.useState(2);
  const [timesteps, setTimesteps] = React.useState(50);
  const [seed, setSeed] = React.useState(42);
  const [numSamples, setNumSamples] = React.useState(1);
  const { addItem } = useHistory();
  const { user } = useProductStore();
  const humanFileInputRef = React.useRef<HTMLInputElement>(null);
  const garmentFileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const API_KEY = import.meta.env.VITE_FAL_KEY || 'c356025c-0f92-4873-a43b-e3346e53cd93:b43044d3956488e624cac9d8ebdc098d';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = (item: any) => {
    if (item.type === 'outfits-image' && item.content.imageUrl) {
      setOutputUrl(item.content.imageUrl);
      if (item.content.sourceImage) {
        setHumanImageUrl(item.content.sourceImage);
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
      if (event.detail.type === 'outfits-image' && event.detail?.images) {
        setOutputUrl(event.detail?.images.url);
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, [humanImageUrl, addItem]);

  const handleFileUpload =
    (type: 'human' | 'garment') => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          const maxDimension = 1024;
          if (img.width > maxDimension || img.height > maxDimension) {
            setError(
              `Image dimensions too large. Maximum allowed is ${maxDimension}x${maxDimension} pixels.`
            );
            return;
          }

          // If dimensions are ok, proceed with base64 conversion
          const reader = new FileReader();
          reader.onloadend = () => {
            if (type === 'human') {
              setHumanImageUrl(reader.result as string);
              setIsHumanBase64(true);
            } else {
              setGarmentImageUrl(reader.result as string);
              setIsGarmentBase64(true);
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

  const handleUrlChange =
    (type: 'human' | 'garment') => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'human') {
        setHumanImageUrl(e.target.value);
        setIsHumanBase64(false);
      } else {
        setGarmentImageUrl(e.target.value);
        setIsGarmentBase64(false);
      }
      setError(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutputUrl(null);
    setProgress('');

    if (!humanImageUrl || !garmentImageUrl) {
      setError('Please provide both a human photo and a garment image');
      setLoading(false);
      return;
    }

    try {
      // Validate URLs if not base64
      if (!isHumanBase64) {
        try {
          new URL(humanImageUrl);
        } catch {
          throw new Error('Please enter a valid human image URL');
        }
      }
      if (!isGarmentBase64) {
        try {
          new URL(garmentImageUrl);
        } catch {
          throw new Error('Please enter a valid garment image URL');
        }
      }

      const requestOptions = {
        model_image: humanImageUrl,
        garment_image: garmentImageUrl,
        category,
        garment_photo_type: garmentPhotoType,
        nsfw_filter: nsfwFilter,
        cover_feet: coverFeet,
        adjust_hands: adjustHands,
        restore_background: restoreBackground,
        restore_clothes: restoreClothes,
        long_top: longTop,
        guidance_scale: guidanceScale,
        timesteps,
        seed,
        num_samples: numSamples,
      };

      // Create background task
      const taskId = addTask({
        type: 'outfits-image',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<KolorsResponse>(
        'fashn/tryon',
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
      startBackgroundPolling(taskId, 'fashn/tryon', result?.request_id, API_KEY, user?.uid);

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
          'File size too large. Please use smaller images (max 10MB each) or reduce the dimensions.';
      } else if (errorMessage.toLowerCase().includes('400')) {
        errorMessage =
          'Invalid input images. Please ensure both images are valid and in the correct format.';
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
      title="Outfits Virtual Try-On"
      description="Try on virtual garments on your photos with AI"
      controls={
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="humanImageUrl" className="block text-sm font-medium">
              Human Photo
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="humanImageUrl"
                type="text"
                value={humanImageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange('human')(e)}
                onPasteText={text => handleUrlChange('human')({ target: { value: text } } as any)}
                className="input-area flex-1"
                placeholder="https://example.com/person.jpg"
                disabled={isHumanBase64}
              />
              <input
                type="file"
                ref={humanFileInputRef}
                onChange={handleFileUpload('human')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => humanFileInputRef.current?.click()}
                className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                title="Upload Human Photo"
              >
                <Upload className="w-5 h-5" />
              </button>
              {isHumanBase64 && (
                <button
                  type="button"
                  onClick={() => {
                    setHumanImageUrl('');
                    setIsHumanBase64(false);
                  }}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-white/60">Upload a photo of a person to try on garments</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="garmentImageUrl" className="block text-sm font-medium">
              Garment Image
            </label>
            <div className="flex gap-2">
              <InputWithPaste
                id="garmentImageUrl"
                type="text"
                value={garmentImageUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUrlChange('garment')(e)}
                onPasteText={text => handleUrlChange('garment')({ target: { value: text } } as any)}
                className="input-area flex-1"
                placeholder="https://example.com/garment.jpg"
                disabled={isGarmentBase64}
              />
              <input
                type="file"
                ref={garmentFileInputRef}
                onChange={handleFileUpload('garment')}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => garmentFileInputRef.current?.click()}
                className="px-4 py-3 bg-[#1A1A3A]/30 rounded-xl border border-[#4A3A7A]/20 hover:bg-[#2A1A4A]/30 backdrop-blur-md transition-all duration-200"
                title="Upload Garment Image"
              >
                <Upload className="w-5 h-5" />
              </button>
              {isGarmentBase64 && (
                <button
                  type="button"
                  onClick={() => {
                    setGarmentImageUrl('');
                    setIsGarmentBase64(false);
                  }}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/40 rounded-xl border border-red-700/20 text-white/90 backdrop-blur-md transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-white/60">Upload an image of the garment to try on</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryEnum)}
                className="input-area"
              >
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="one-pieces">One Pieces</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Garment Photo Type</label>
              <select
                value={garmentPhotoType}
                onChange={e => setGarmentPhotoType(e.target.value as GarmentPhotoTypeEnum)}
                className="input-area"
              >
                <option value="auto">Auto Detect</option>
                <option value="model">Model Photo</option>
                <option value="flat-lay">Flat Lay</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Guidance Scale</label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={guidanceScale}
                onChange={e => setGuidanceScale(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>Less Detail</span>
                <span>More Detail</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Timesteps</label>
              <input
                type="range"
                min="20"
                max="100"
                step="1"
                value={timesteps}
                onChange={e => setTimesteps(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-white/60">
                <span>Faster</span>
                <span>Better Quality</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={nsfwFilter}
                  onChange={e => setNsfwFilter(e.target.checked)}
                  className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                />
                <span className="text-sm font-medium">NSFW Filter</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={coverFeet}
                  onChange={e => setCoverFeet(e.target.checked)}
                  className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                />
                <span className="text-sm font-medium">Cover Feet</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={adjustHands}
                  onChange={e => setAdjustHands(e.target.checked)}
                  className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                />
                <span className="text-sm font-medium">Adjust Hands</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={restoreBackground}
                  onChange={e => setRestoreBackground(e.target.checked)}
                  className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                />
                <span className="text-sm font-medium">Restore Background</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={restoreClothes}
                  onChange={e => setRestoreClothes(e.target.checked)}
                  className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                />
                <span className="text-sm font-medium">Restore Clothes</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={longTop}
                  onChange={e => setLongTop(e.target.checked)}
                  className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                />
                <span className="text-sm font-medium">Long Top</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !humanImageUrl || !garmentImageUrl}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <Shirt className="w-5 h-5" />
                Try On Garment
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
              progressText={progress || 'Generating virtual try-on...'}
              title="Processing Images"
            />
          )}

          {(outputUrl || id) && (
            <div className="mt-8 space-y-4">
              <ImageContainer outputUrl={outputUrl} title={'Virtual Try-On'} imageLoading={imageLoading} />
            </div>
          )}
        </>
      }
      onHistoryItemClick={handleHistoryItemClick}
    />
  );
}

export default OutfitsImageToImage;
