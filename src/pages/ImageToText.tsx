import React, { useEffect } from 'react';
import { FileText, Upload, Loader2, Download, Copy, Check, X } from 'lucide-react';
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

interface VisionResponse {
  output: string;
  reasoning?: string;
  partial?: boolean;
  error?: string;
}

function ImageToText() {
  const [imageUrl, setImageUrl] = React.useState('');
  const [isBase64, setIsBase64] = React.useState(false);
  const [prompt, setPrompt] = React.useState(
    'extract the complete text from the image and organize it into paragraphs following the organization in the image, do not display special characters and #, separate the paragraphs by 4 lines'
  );
  const [systemPrompt, setSystemPrompt] = React.useState(
    "Only answer the question, do not provide any additional information or add any prefix/suffix other than the answer of the original question. Don't use markdown."
  );
  const [output, setOutput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState<string>('');
  const [percentage, setPercentage] = React.useState(0);
  const model = 'google/gemini-flash-1.5';
  const [copied, setCopied] = React.useState(false);
  const { user } = useProductStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addTask } = useBackground();
  const API_KEY = import.meta.env.VITE_FAL_KEY || 'c356025c-0f92-4873-a43b-e3346e53cd93:b43044d3956488e624cac9d8ebdc098d';

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = (item: any) => {
    if (item.type === 'image-to-text' && item.content.response) {
      setOutput(item.content.response);
      if (item.content.prompt) {
        setPrompt(item.content.prompt);
      }
      if (item.content.systemPrompt) {
        setSystemPrompt(item.content.systemPrompt);
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

  // Show API key error if not set
  React.useEffect(() => {
    if (!API_KEY) {
      setError('Please set your FAL API key in the .env file as VITE_FAL_KEY');
    }
  }, [API_KEY]);

  // Listen for response updates
  React.useEffect(() => {
    const handleResponse = (async (event: CustomEvent) => {
      if (event.detail.type === 'image-to-text' && event.detail?.response) {
        setOutput(event.detail.response);
        setLoading(false);
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, [prompt, systemPrompt]);

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
    setLoading(true);
    setError(null);
    setOutput('');
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
        model,
        prompt,
        system_prompt: systemPrompt,
        image_url: imageUrl,
      };

      // Create background task
      const taskId = addTask({
        type: 'image-to-text',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<VisionResponse>(
        'fal-ai/any-llm/vision',
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
        'fal-ai/any-llm/vision',
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
        errorMessage = 'Invalid request parameters. Please check your image format.';
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
      }

      setError(errorMessage);
    } finally {
      setProgress('');
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-description-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Image to Text"
      description="Extract detailed descriptions from images with AI"
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
            <p className="text-sm text-white/60">Upload an image to analyze (max 10MB)</p>
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
              placeholder="What would you like to know about the image?"
              rows={3}
            />
          </div>

          <button type="submit" disabled={loading || !imageUrl} className="btn-primary">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {progress || 'Processing... This may take a few minutes'}
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Analyze Image
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

          {loading && !output && (
            <LoadingAnimation
              progress={percentage}
              progressText={progress || 'Analyzing image...'}
              title="Processing Image"
            />
          )}

          {output && (
            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="card overflow-hidden">
                  <div className="aspect-square bg-[#1A1A3A]/30">
                    <img src={imageUrl} alt="Original" className="w-full h-full object-contain" />
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <h3 className="text-lg font-medium mb-2">Original Image</h3>
                  </div>
                </div>

                {/* Result */}
                <div className="card overflow-hidden">
                  <div className="p-6 bg-[#1A1A3A]/30 h-full">
                    <h3 className="text-lg font-medium mb-4">Description</h3>
                    <p className="text-white/90 whitespace-pre-wrap">{output}</p>
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4A2A7A] hover:bg-[#5A3A8A] rounded-lg text-white transition-colors"
                        title={copied ? 'Copied!' : 'Copy to clipboard'}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        Copy
                      </button>
                      <button
                        onClick={handleDownloadText}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1A1A3A]/30 hover:bg-[#2A1A4A]/30 rounded-lg text-white/90 transition-colors"
                        title="Download as text file"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
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

export default ImageToText;
