export interface Message {
    role: 'user' | 'assistant';
    content: string;
    image?: string;
    model?: string;
    metadata?: {
      language_used: string;
      input_tokens?: number;
      output_tokens?: number;
    };
  }
  
  export interface ChatResponse {
    model: string;
    content: string;
    metadata?: {
      confidence?: number;
      language_used: string;
      input_tokens?: number;
      output_tokens?: number;
    };
  }
  
  export interface SavedSelection {
    id: string;
    text: string;
    timestamp: number;
    source: string;
    collectionId: string;
  }
  
  export interface SavedPrompt {
    id: string;
    title: string;
    content: string;
    timestamp: number;
    shortcut?: string;
  }
  
  export interface SelectionCollection {
    id: string;
    name: string;
    timestamp: number;
  }
  
  export interface ModelOption {
    [x: string]: any;
    id: string;
    name: string;
    series: string;
    supportsImages: boolean;
    creditsPerThousandTokens: number;
  }
  
  export const AVAILABLE_LANGUAGES = [
    { id: 'en', name: 'English' },
    { id: 'fr', name: 'Français' },
    { id: 'ar', name: 'العربية' },
    { id: 'es', name: 'Español' }
  ] as const;
  
  export type Language = typeof AVAILABLE_LANGUAGES[number]['id'];
  
  export const AVAILABLE_MODELS: ModelOption[] = [
    { id: "anthropic/claude-3-opus", name: "Claude 3", series: "Claude", supportsImages: true, creditsPerThousandTokens: 150 },
    { id: "anthropic/claude-3.7-sonnet", name: "Claude 3.7 Sonnet", series: "Claude", supportsImages: false, creditsPerThousandTokens: 30 },
    { id: "anthropic/claude-3.7-sonnet:thinking", name: "Claude 3.7 Sonnet Thinking", series: "Claude", supportsImages: false, creditsPerThousandTokens: 30 },
    { id: "anthropic/claude-3-sonnet", name: "Claude 3 Sonnet", series: "Claude", supportsImages: false, creditsPerThousandTokens: 30 },
    { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", series: "Claude", supportsImages: false, creditsPerThousandTokens: 4 },
    { id: "openai/o1-mini", name: "O1 Mini", series: "GPT", supportsImages: true, creditsPerThousandTokens: 10 },
    { id: "openai/o1", name: "O1", series: "GPT", supportsImages: true, creditsPerThousandTokens: 120 },
    { id: "openai/o3-mini", name: "O3 Mini", series: "GPT", supportsImages: true, creditsPerThousandTokens: 10 },
    { id: "openai/o3-mini-high", name: "O3 Mini High", series: "GPT", supportsImages: true, creditsPerThousandTokens: 10 },
    { id: "openai/gpt-4.5-preview", name: "GPT-4.5 Preview", series: "GPT", supportsImages: true, creditsPerThousandTokens: 300 },
    { id: "openai/gpt-4o-mini", name: "GPT-4O Mini", series: "GPT", supportsImages: true, creditsPerThousandTokens: 2 },
    { id: "openai/gpt-4o", name: "GPT-4O", series: "GPT", supportsImages: true, creditsPerThousandTokens: 30 },
    { id: "openai/gpt-4o-mini-search-preview", name: "GPT-4O Mini Search", series: "GPT", supportsImages: true, creditsPerThousandTokens: 40, requiresReferences: true },
    { id: "openai/gpt-4o-search-preview", name: "GPT-4O Search", series: "GPT", supportsImages: true, creditsPerThousandTokens: 70, requiresReferences: true },
    { id: "google/gemini-pro", name: "Gemini Pro", series: "Gemini", supportsImages: false, creditsPerThousandTokens: 10 },
    { id: "google/gemini-pro-1.5", name: "Gemini Pro 1.5", series: "Gemini", supportsImages: false, creditsPerThousandTokens: 10 },
    { id: "google/gemini-pro-vision", name: "Gemini Pro Vision", series: "Gemini", supportsImages: true, creditsPerThousandTokens: 10 },
    { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash", series: "Gemini", supportsImages: false, creditsPerThousandTokens: 2 },
    { id: "google/gemma-3-27b-it", name: "Gemma 3 27B IT", series: "Gemini", supportsImages: false, creditsPerThousandTokens: 1 },
    { id: "x-ai/grok-vision-beta", name: "Grok Vision Beta", series: "Grok", supportsImages: true, creditsPerThousandTokens: 30 },
    { id: "x-ai/grok-beta", name: "Grok Beta", series: "Grok", supportsImages: false, creditsPerThousandTokens: 30 },
    { id: "x-ai/grok-2-vision-1212", name: "Grok 2 Vision", series: "Grok", supportsImages: true, creditsPerThousandTokens: 30 },
    { id: "x-ai/grok-2-1212", name: "Grok 2", series: "Grok", supportsImages: false, creditsPerThousandTokens: 30 },
    { id: "x-ai/grok-2-mini", name: "Grok 2 Mini", series: "Grok", supportsImages: false, creditsPerThousandTokens: 10 },
    { id: "qwen/qwen2.5-32b-instruct", name: "Qwen 2.5 32B", series: "Qwen", supportsImages: false, creditsPerThousandTokens: 8 },
    { id: "qwen/qwen2.5-vl-72b-instruct", name: "Qwen 2.5 VL 72B", series: "Qwen", supportsImages: true, creditsPerThousandTokens: 2 },
    { id: "qwen/qwen-max", name: "Qwen Max", series: "Qwen", supportsImages: false, creditsPerThousandTokens: 14 },
    { id: "eva-unit-01/eva-qwen-2.5-32b", name: "Eva Qwen 2.5 32B", series: "Qwen", supportsImages: false, creditsPerThousandTokens: 8 },
    { id: "deepseek/deepseek-r1", name: "DeepSeek R1", series: "DeepSeek", supportsImages: false, creditsPerThousandTokens: 6 },
    { id: "deepseek/deepseek-chat", name: "DeepSeek Chat", series: "DeepSeek", supportsImages: false, creditsPerThousandTokens: 4 },
    { id: "amazon/nova-pro-v1", name: "Nova Pro", series: "Amazon", supportsImages: false, creditsPerThousandTokens: 8 },
    { id: "amazon/nova-lite-v1", name: "Nova Lite", series: "Amazon", supportsImages: false, creditsPerThousandTokens: 1 },
    { id: "amazon/nova-micro-v1", name: "Nova Micro", series: "Amazon", supportsImages: false, creditsPerThousandTokens: 0.5 },
    { id: "meta-llama/llama-3.1-405b", name: "Llama 3.1 405B", series: "Meta", supportsImages: false, creditsPerThousandTokens: 6 },
    { id: "meta-llama/llama-3.2-90b-vision-instruct", name: "Llama 3.2 90B Vision", series: "Meta", supportsImages: true, creditsPerThousandTokens: 12 },
    { id: "meta-llama/llama-3.1-405b-instruct", name: "Llama 3.1 405B Instruct", series: "Meta", supportsImages: false, creditsPerThousandTokens: 2 },
    { id: "nousresearch/hermes-3-llama-3.1-405b", name: "Hermes 3 Llama", series: "Meta", supportsImages: false, creditsPerThousandTokens: 2 },
    { id: "sao10k/l3.1-euryale-70b", name: "Euryale 70B", series: "Meta", supportsImages: false, creditsPerThousandTokens: 2 },
    { id: "allenai/llama-3.1-tulu-3-405b", name: "Tulu 3 405B", series: "Meta", supportsImages: false, creditsPerThousandTokens: 20 },
    { id: "anthracite-org/magnum-v2-72b", name: "Magnum V2 72B", series: "Anthracite", supportsImages: false, creditsPerThousandTokens: 6 },
    { id: "anthracite-org/magnum-v4-72b", name: "Magnum V4 72B", series: "Anthracite", supportsImages: false, creditsPerThousandTokens: 10 },
    { id: "thedrummer/rocinante-12b", name: "Rocinante 12B", series: "Other", supportsImages: false, creditsPerThousandTokens: 2 },
    { id: "microsoft/phi-3-medium-128k-instruct", name: "Phi-3 Medium 128K", series: "Microsoft", supportsImages: false, creditsPerThousandTokens: 2 },
    { id: "google/palm-2-chat-bison-32k", name: "PaLM 2 Chat Bison 32K", series: "Google", supportsImages: false, creditsPerThousandTokens: 4 },
    { id: "perplexity/sonar-reasoning", name: "Sonar Reasoning", series: "Mistral", supportsImages: false, creditsPerThousandTokens: 20, requiresReferences: true },
    { id: "perplexity/sonar", name: "Sonar", series: "Mistral", supportsImages: false, creditsPerThousandTokens: 20, requiresReferences: true },
    { id: "perplexity/sonar-pro", name: "Sonar Pro", series: "Mistral", supportsImages: false, creditsPerThousandTokens: 30, requiresReferences: true },
    { id: "perplexity/sonar-deep-research", name: "Sonar Deep Research", series: "Mistral", supportsImages: false, creditsPerThousandTokens: 20, requiresReferences: true },
    { id: "perplexity/r1-1776", name: "R1 1776", series: "Mistral", supportsImages: false, creditsPerThousandTokens: 20, requiresReferences: true }
  ];