import React, { useEffect } from 'react';
import {
  MessageSquare,
  Loader2,
  Copy,
  RotateCcw,
  Download,
  FileText,
  XCircle,
  Check,
} from 'lucide-react';
import PasteButton from '@/components/AICreator/PasteButton';
import jsPDF from 'jspdf';
import { submitToQueue } from '../utils/api';
import { startBackgroundPolling } from '../utils/background-worker';
import LoadingAnimation from '@/components/AICreator/LoadingAnimation';
import ToolLayout from '@/components/AICreator/ToolLayout';
import ApiKeyError from '@/components/AICreator/ApiKeyError';
import { useHistory, type HistoryItem } from '../store/history';
import { useBackground } from '../store/background';
import type { LLMRequestOptions, LLMResponse, LLMModel } from '../types/llm';
import { useProductStore } from '@/store';
import { getAiGenerations } from '@/services/firebase/aiGenerations';
import { useLocation } from 'react-router-dom';

function TextGenerator() {
  const [copiedText, setCopiedText] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [systemPrompt, setSystemPrompt] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [reasoning, setReasoning] = React.useState('');
  const [progress, setProgress] = React.useState('');
  const [percentage, setPercentage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [model, setModel] = React.useState<LLMModel>('google/gemini-flash-1.5');
  const [enableReasoning, setEnableReasoning] = React.useState(false);
  const textGeneratorRef = React.useRef<HTMLFormElement>(null);
  const { user } = useProductStore();
  const { addTask } = useBackground();

  const API_KEY = import.meta.env.VITE_FAL_KEY || 'c356025c-0f92-4873-a43b-e3346e53cd93:b43044d3956488e624cac9d8ebdc098d';
  const EXAMPLE_PROMPT = 'What is the meaning of life?';
  const EXAMPLE_SYSTEM_PROMPT =
    'You are a helpful AI assistant that provides clear and concise answers.';
  useEffect(() => {
    // Listen for response updates
    const handleResponse = ((event: CustomEvent) => {
      const detail = event.detail;
      if (detail && detail.type === 'text') {
        const { response: newResponse, reasoning: newReasoning } = event.detail;
        setResponse(newResponse);
        if (newReasoning) {
          setReasoning(newReasoning);
        }
        setLoading(false);
        setProgress('');
      }
    }) as EventListener;

    window.addEventListener('response-update', handleResponse);
    return () => window.removeEventListener('response-update', handleResponse);
  }, []);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const handleHistoryItemClick = (item: HistoryItem) => {
    if (item.type === 'text' && item.content.response) {
      setResponse(item.content.response);
      if (item.content.prompt) {
        setPrompt(item.content.prompt);
      }
      if (item.content.systemPrompt) {
        setSystemPrompt(item.content.systemPrompt);
      }
      if (item.content.reasoning) {
        setReasoning(item.content.reasoning);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setReasoning('');
    setError(null);
    setProgress('');
    setPercentage(0);

    if (!prompt) {
      setError('Please provide a prompt');
      setLoading(false);
      return;
    }

    try {
      const requestOptions: LLMRequestOptions = {
        model,
        prompt,
        system_prompt: systemPrompt || undefined,
        reasoning: enableReasoning,
      };

      // Create background task
      const taskId = addTask({
        type: 'text',
        status: 'pending',
        progress: 'Submitting request...',
        params: requestOptions,
        timestamp: Date.now(),
      });

      // Submit request
      const result: any = await submitToQueue<LLMResponse>(
        'fal-ai/any-llm',
        API_KEY,
        requestOptions,
        (status, percentage, logs) => {
          setPercentage(percentage);
          setProgress(status);
          if (logs?.length) {
            console.log('Processing logs:', logs);
          }
        },
        'text'
      );

      // Start background polling
      startBackgroundPolling(taskId, 'fal-ai/any-llm', result.request_id, API_KEY, user?.uid);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setLoading(false);
    } finally {
      setProgress('');
    }
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = reasoning
        ? `Response:\n${response}\n\nReasoning:\n${reasoning}`
        : response;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadText = () => {
    const content = reasoning ? `Response:\n${response}\n\nReasoning:\n${reasoning}` : response;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-response-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('AI Generated Response', 20, 20);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

    // Add content
    doc.setFontSize(12);
    doc.text('Response:', 20, 40);

    // Split text into lines that fit the page width
    const splitResponse = doc.splitTextToSize(response, 170);
    doc.text(splitResponse, 20, 50);

    // Add reasoning if present
    if (reasoning) {
      // Calculate Y position after response text
      const yPos = 50 + splitResponse.length * 7;
      doc.text('Reasoning:', 20, yPos);
      const splitReasoning = doc.splitTextToSize(reasoning, 170);
      doc.text(splitReasoning, 20, yPos + 10);
    }

    // Save the PDF
    doc.save(`ai-response-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <ToolLayout
      title="Text to Text"
      description="Generate text responses with advanced AI"
      controls={
        <>
          <form onSubmit={handleSubmit} className="space-y-6" ref={textGeneratorRef}>
            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium">
                Your Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your prompt here..."
                rows={4}
              />
              <div className="flex justify-end mt-2">
                <PasteButton onPaste={text => setPrompt(text)} />
              </div>
              <button
                type="button"
                onClick={() => setPrompt(EXAMPLE_PROMPT)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Use example prompt
              </button>
            </div>

            <div className="space-y-2">
              <label htmlFor="systemPrompt" className="block text-sm font-medium">
                System Prompt (Optional)
              </label>
              <textarea
                id="systemPrompt"
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Provide context or instructions for the AI..."
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <PasteButton onPaste={text => setSystemPrompt(text)} />
              </div>
              <button
                type="button"
                onClick={() => setSystemPrompt(EXAMPLE_SYSTEM_PROMPT)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Use example system prompt
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={model}
                  onChange={e => setModel(e.target.value as LLMModel)}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <optgroup label="Fast Models">
                    <option value="google/gemini-flash-1.5">Gemini Flash 1.5</option>
                    <option value="google/gemini-flash-1.5-8b">Gemini Flash 1.5 8B</option>
                    <option value="meta-llama/llama-3.2-1b-instruct">Llama 3.2 1B</option>
                    <option value="meta-llama/llama-3.2-3b-instruct">Llama 3.2 3B</option>
                  </optgroup>
                  <optgroup label="Standard Models">
                    <option value="google/gemini-pro-1.5">Gemini Pro 1.5</option>
                    <option value="meta-llama/llama-3.1-8b-instruct">Llama 3.1 8B</option>
                    <option value="deepseek/deepseek-r1">DeepSeek R1</option>
                  </optgroup>
                  <optgroup label="Premium Models">
                    <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                    <option value="anthropic/claude-3-5-haiku">Claude 3.5 Haiku</option>
                    <option value="anthropic/claude-3-haiku">Claude 3 Haiku</option>
                    <option value="meta-llama/llama-3.1-70b-instruct">Llama 3.1 70B</option>
                    <option value="openai/gpt-4o-mini">GPT-4 Mini</option>
                    <option value="openai/gpt-4o">GPT-4</option>
                  </optgroup>
                </select>
                <p className="text-xs text-gray-500">
                  Premium models are charged at 10x the rate of standard models
                </p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={enableReasoning}
                    onChange={e => setEnableReasoning(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                  />
                  <span className="text-sm font-medium">Show AI Reasoning</span>
                </label>
                <p className="text-sm text-gray-400">
                  When enabled, the AI will explain its thought process
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {progress || 'Processing... This may take a few minutes'}
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  Generate Response
                </>
              )}
            </button>
          </form>
        </>
      }
      result={
        <div className="min-h-[calc(100vh-16rem)] relative flex flex-col">
          {error && (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-lg p-6 bg-red-900/50 border border-red-700 rounded-lg text-red-200 animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-800/50 rounded-lg">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Error Occurred</h3>
                    <p className="whitespace-pre-wrap">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && !response && (
            <div className="flex-1 flex items-center justify-center">
              <LoadingAnimation
                progress={percentage}
                progressText={progress}
                title="Generating Response"
              />
            </div>
          )}

          {response && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-sm transition-colors"
                    title={copiedText ? 'Copied!' : 'Copy to clipboard'}
                  >
                    {copiedText ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    Copy
                  </button>

                  <button
                    onClick={downloadText}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-sm"
                    title="Download as text file"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={downloadPdf}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-sm"
                    title="Download as PDF"
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </button>
                  <button
                    onClick={() => setResponse('')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 text-sm"
                    title="Clear response"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </div>
              <div className="flex-1 mt-4 p-6 bg-white/5 rounded-lg animate-fade-in overflow-y-auto">
                <p className="text-white/90 whitespace-pre-wrap">{response}</p>
              </div>
              {reasoning && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">AI Reasoning</h3>
                  <div className="p-6 bg-white/5 rounded-lg animate-fade-in overflow-y-auto">
                    <p className="text-white/80 whitespace-pre-wrap">{reasoning}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      }
      onHistoryItemClick={handleHistoryItemClick}
      setPrompt={(prompt) => setPrompt(prompt)}
    />
  );
}

export default TextGenerator;
