import React, { useEffect } from 'react';
import {
  Image,
  Loader2,
  Download,
  Dices,
  Sparkles,
  Shield,
  FileType,
  Ratio as AspectRatioIcon,
} from 'lucide-react';
import { submitToQueue } from '@/utils/api';
import { startBackgroundPolling } from '@/utils/background-worker';
import ToolLayout from '@/components/AICreator/ToolLayout';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import { useHistory, type HistoryItem } from '@/store/history';
import { useBackground } from '@/store/background';
import type {
  FluxRequestOptions,
  FluxResponse,
  SafetyTolerance,
  OutputFormat,
  AspectRatio,
} from '@/types/flux';
import { useProductStore } from '@/store';
import { getAiGenerations } from '@/services/firebase/aiGenerations';
import { useLocation } from 'react-router-dom';

function ImageGenerator() {
  const [prompt, setPrompt] = React.useState('');
  const [images, setImages] = React.useState<{ url: string; content_type: string }[]>([]);
  const [progress, setProgress] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [seed, setSeed] = React.useState<number | ''>('');
  const [numImages, setNumImages] = React.useState(1);
  const [safetyTolerance, setSafetyTolerance] = React.useState<SafetyTolerance>('2');
  const [outputFormat, setOutputFormat] = React.useState<OutputFormat>('jpeg');
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>('16:9');
  const [raw, setRaw] = React.useState(false);
  const [enableSafetyChecker, setEnableSafetyChecker] = React.useState(true);
  const { user } = useProductStore();
  const { addTask } = useBackground();

  const API_KEY = import.meta.env.VITE_FAL_KEY || '';
  const EXAMPLE_PROMPT =
    'Extreme close-up of a single tiger eye, direct frontal view. Detailed iris and pupil. Sharp focus on eye texture and color. Natural lighting to capture authentic eye shine and depth. The word "FLUX" is painted over it in big, white brush strokes with visible texture.';

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

  const handleHistoryItemClick = (item: HistoryItem) => {
    if (item.type === 'image' && item.content.imageUrl) {
      setImages([{ url: item.content.imageUrl, content_type: 'image/jpeg' }]);
      if (item.content.prompt) {
        setPrompt(item.content.prompt);
      }
    }
  };

  const generateRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1000000));
  };

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
      const requestOptions: FluxRequestOptions = {
        prompt,
        seed: seed || undefined,
        num_images: numImages,
        enable_safety_checker: enableSafetyChecker,
        safety_tolerance: safetyTolerance,
        output_format: outputFormat,
        aspect_ratio: aspectRatio,
        raw,
      };

      // Create background task
      const taskId = addTask({
        type: 'image',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<FluxResponse>(
        'fal-ai/flux-pro/v1.1-ultra',
        API_KEY,
        requestOptions,
        (status, logs: any) => {
          setProgress(status);
        },
        'image'
      );

      // Start background polling
      startBackgroundPolling(
        taskId,
        'fal-ai/flux-pro/v1.1-ultra',
        result?.request_id,
        API_KEY,
        user?.uid
      );

      setProgress('Request submitted. You can safely navigate away from this page.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setProgress('');
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Text to Image"
      description="Create stunning images with Flux AI"
      controls={
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium">
                Description Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="input-area"
                placeholder="Describe the image you want to generate..."
                rows={4}
              />
              <button
                type="button"
                onClick={() => setPrompt(EXAMPLE_PROMPT)}
                className="text-sm text-[#9A6ACA] hover:text-[#BA8AEA] transition-colors"
              >
                Use example prompt
              </button>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={e => setAspectRatio(e.target.value as AspectRatio)}
                  className="input-area"
                >
                  <option value="21:9">Ultra Wide (21:9)</option>
                  <option value="16:9">Landscape (16:9)</option>
                  <option value="4:3">Standard (4:3)</option>
                  <option value="3:2">Photo (3:2)</option>
                  <option value="1:1">Square (1:1)</option>
                  <option value="2:3">Portrait (2:3)</option>
                  <option value="3:4">Portrait (3:4)</option>
                  <option value="9:16">Mobile (9:16)</option>
                  <option value="9:21">Ultra Tall (9:21)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Output Format</label>
                <select
                  value={outputFormat}
                  onChange={e => setOutputFormat(e.target.value as OutputFormat)}
                  className="input-area"
                >
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Safety Tolerance</label>
                <select
                  value={safetyTolerance}
                  onChange={e => setSafetyTolerance(e.target.value as SafetyTolerance)}
                  className="input-area"
                  disabled={!enableSafetyChecker}
                >
                  <option value="1">Very Strict</option>
                  <option value="2">Strict</option>
                  <option value="3">Moderate</option>
                  <option value="4">Relaxed</option>
                  <option value="5">Very Relaxed</option>
                  <option value="6">Minimal</option>
                </select>
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enableSafetyChecker}
                    onChange={e => setEnableSafetyChecker(e.target.checked)}
                    className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                  />
                  <span className="text-sm font-medium">Enable Safety Checker</span>
                </label>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={raw}
                    onChange={e => setRaw(e.target.checked)}
                    className="w-4 h-4 rounded border-[#4A3A7A]/20 text-[#9A6ACA] focus:ring-[#6A4A9A]/50 bg-[#1A1A3A]/30"
                  />
                  <span className="text-sm font-medium">Raw Output</span>
                </label>
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
                  <Image className="w-5 h-5" />
                  Generate Image
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

          {images.length > 0 && (
            <div className="mt-8 space-y-4 card p-6">
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="card overflow-hidden">
                    <img src={image.url} alt={`Generated ${index + 1}`} className="w-full h-auto" />
                    <div className="p-4 border-t border-[#4A3A7A]/20">
                      <a
                        href={image.url}
                        download
                        className="text-[#9A6ACA] hover:text-[#BA8AEA] underline text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Image {images.length > 1 ? index + 1 : ''}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              {seed !== '' && (
                <p className="text-center text-sm text-white/60">Seed: {seed} - Click to copy</p>
              )}
            </div>
          )}
        </>
      }
      history={
        images.length > 0
          ?
          <div className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="card overflow-hidden">
                <img
                  src={image.url}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-auto"
                />
                <div className="p-4 border-t border-[#4A3A7A]/20">
                  <a
                    href={image.url}
                    download
                    className="text-[#9A6ACA] hover:text-[#BA8AEA] underline text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Image {images.length > 1 ? index + 1 : ''}
                  </a>
                </div>
              </div>
            ))}
          </div>
          : undefined
      }
    />
  );
}

export default ImageGenerator;
