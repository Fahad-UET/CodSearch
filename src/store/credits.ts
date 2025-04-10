import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CreditEntry {
  id: string;
  type: 'image' | 'video' | 'voice' | 'text';
  model: string;
  cost: number;
  timestamp: number;
  status: 'completed' | 'failed';
  details?: {
    prompt?: string;
    imageUrl?: string;
    quantity?: number;
    videoUrl?: string;
    duration?: string;
    resolution?: string;
  };
}

interface CreditsState {
  entries: CreditEntry[];
  addEntry: (entry: Omit<CreditEntry, 'id'>) => void;
  clearHistory: () => void;
  removeEntry: (id: string) => void;
  getTotalCost: () => number;
}

// Cost mapping for different models (in credits)
export const AI_CREATOR_COSTS = {
  // Text Tools
  'anthropic/claude-3-opus': { type: '1k tokens', unit: 150 },
  'anthropic/claude-3.7-sonnet': { type: '1k tokens', unit: 30 },
  'anthropic/claude-3.7-sonnet-thinking': { type: '1k tokens', unit: 30 },
  'anthropic/claude-3-sonnet': { type: '1k tokens', unit: 30 },
  'anthropic/claude-3-haiku': { type: '1k tokens', unit: 4 },
  'openai/o1-mini': { type: '1k tokens', unit: 10 },
  'openai/o1': { type: '1k tokens', unit: 120 },
  'openai/o3-mini': { type: '1k tokens', unit: 10 },
  'openai/o3-mini-high': { type: '1k tokens', unit: 10 },
  'openai/gpt-4.5-preview': { type: '1k tokens', unzit: 300 },
  'openai/gpt-4o-mini': { type: '1k tokens', unit: 2 },
  'openai/gpt-4o': { type: '1k tokens', unit: 30 },
  'openai/gpt-4o-mini-search': { type: '1k tokens', unit: 40 },
  'openai/gpt-4o-search': { type: '1k tokens', unit: 70 },
  'google/gemini-pro': { type: '1k tokens', unit: 10 },
  'google/gemini-pro-1.5': { type: '1k tokens', unit: 10 },
  'google/gemini-pro-vision': { type: '1k tokens', unit: 10 },
  'google/gemini-2.0-flash': { type: '1k tokens', unit: 2 },
  'google/gemini-2.0-flash-exp': { type: '1k tokens', unit: 1 },
  'google/gemini-2.0-pro-exp': { type: '1k tokens', unit: 1 },
  'google/gemma-3-27b-it': { type: '1k tokens', unit: 1 },
  'xai/grok-vision-beta': { type: '1k tokens', unit: 30 },
  'xai/grok-beta': { type: '1k tokens', unit: 30 },
  'xai/grok-2-vision': { type: '1k tokens', unit: 30 },
  'xai/grok-2': { type: '1k tokens', unit: 30 },
  'xai/grok-2-mini': { type: '1k tokens', unit: 10 },
  'qwen/qwen-2.5-32b': { type: '1k tokens', unit: 8 },
  'qwen/qwen-2.5-vl-72b': { type: '1k tokens', unit: 2 },
  'qwen/qwen-max': { type: '1k tokens', unit: 14 },
  'qwen/eva-qwen-2.5-32b': { type: '1k tokens', unit: 8 },
  'deepseek/deepseek-r1': { type: '1k tokens', unit: 6 },
  'deepseek/deepseek-r1-free': { type: '1k tokens', unit: 1 },
  'deepseek/deepseek-chat': { type: '1k tokens', unit: 4 },
  'deepseek/deepseek-chat-free': { type: '1k tokens', unit: 1 },
  'amazon/nova-pro': { type: '1k tokens', unit: 8 },
  'amazon/nova-lite': { type: '1k tokens', unit: 1 },
  'amazon/nova-micro': { type: '1k tokens', unit: 0.5 },
  'meta/llama-3.1-405b': { type: '1k tokens', unit: 6 },
  'meta/llama-3.2-90b-vision': { type: '1k tokens', unit: 12 },
  'meta/llama-3.1-405b-instruct': { type: '1k tokens', unit: 2 },
  'meta/hermes-3-llama': { type: '1k tokens', unit: 2 },
  'meta/euryale-70b': { type: '1k tokens', unit: 2 },
  'meta/tulu-3-405b': { type: '1k tokens', unit: 20 },
  'meta/magnum-v2-72b': { type: '1k tokens', unit: 6 },
  'meta/magnum-v4-72b': { type: '1k tokens', unit: 10 },
  'microsoft/phi-3-medium-128k': { type: '1k tokens', unit: 2 },
  'google/palm-2-chat-bison-32k': { type: '1k tokens', unit: 4 },
  'rocinante/rocinante-12b': { type: '1k tokens', unit: 2 },
  'perplexity/sonar-reasoning': { type: '1k tokens', unit: 20 },
  'perplexity/sonar': { type: '1k tokens', unit: 20 },
  'perplexity/sonar-pro': { type: '1k tokens', unit: 30 },
  'perplexity/sonar-deep-research': { type: '1k tokens', unit: 20 },
  'perplexity/r1-1776': { type: '1k tokens', unit: 20 },

  // COD Analytics
  'cod/add-product': { type: 'request', unit: 100 },
  'cod/save-price': { type: 'request', unit: 10 },
  'cod/import-image': { type: 'request', unit: 1 },
  'cod/download-image': { type: 'request', unit: 1 },
  'cod/import-video': { type: 'request', unit: 1 },
  'cod/download-video': { type: 'request', unit: 5 },
  'cod/scrape-landing': { type: 'request', unit: 5 },
  'cod/create-landing': { type: 'request', unit: 1 },
  'cod/marketing-list': { type: 'request', unit: 5 },
  'cod/generate-text': { type: 'request', unit: 30 },
  'cod/keyword-research': { type: 'request', unit: 10 },
  'cod/google-search': { type: 'request', unit: 0.5 },
  
  // Audio Tools
  'elevenlabs/text-to-speech': { type: 'second', unit: 5 },
  'elevenlabs/voice-design': { type: 'second', unit: 5 },
  'elevenlabs/voice-clone': { type: 'second', unit: 5 },
  'elevenlabs/speech-to-text': { type: 'second', unit: 5 },
  'fal-ai/sync-lipsync': { type: 'second', unit: 20 },
  'fal-ai/sync-lipsync/video': { type: 'second', unit: 1 },
  
  // Image Tools
  'fal-ai/kling-video': { type: 'second', unit: 150 },
  'fal-ai/retoucher': { type: 'request', unit: 10 },
  'fal-ai/fooocus/inpaint': { type: 'request', unit: 200 },
  'fal-ai/bria/background/replace': { type: 'request', unit: 60 },
  'fal-ai/ben/v2/image': { type: 'request', unit: 60 },
  'fal-ai/any-llm/vision/text': { type: 'request', unit: 15 },
  'fal-ai/drct-super-resolution': { type: 'request', unit: 150 },
  'fashn/tryon': { type: 'request', unit: 100 },
  'fal-ai/iclight-v2': { type: 'request', unit: 200 },
  
  // Video Tools
  'fal-ai/ben/v2/video': { type: 'second', unit: 50 },
  'fal-ai/ideogram/v2a/remix': { type: 'request', unit: 60 },
  'fal-ai/fooocus/inpaint/video': { type: 'request', unit: 200 }, 
  'fal-ai/topaz/upscale/video': { type: 'second', unit: 150 },
  'fal-ai/sync-lipsync/video-to-audio': { type: 'second', unit: 1 },
  'fal-ai/sync-lipsync/video-to-images': { type: 'image', unit: 1 },
  'fal-ai/sync-lipsync/video-to-gif': { type: 'request', unit: 20 },
  'fal-ai/sync-lipsync/video-trimmer': { type: 'second', unit: 1 },
  'fal-ai/sync-lipsync/video-mixer': { type: 'second', unit: 1 }
};

export const useCredits = create<CreditsState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => set((state) => ({
        entries: [
          { 
            ...entry, 
            id: crypto.randomUUID(),
            cost: (entry.details?.quantity || 1) * (AI_CREATOR_COSTS[entry.model]?.unit || 1),
            details: {
              ...entry.details,
              quantity: entry.details?.quantity || 1
            }
          },
          ...state.entries
        ].slice(0, 1000) // Keep last 1000 entries
      })),
      removeEntry: (id) => set((state) => ({
        entries: state.entries.filter(entry => entry.id !== id)
      })),
      clearHistory: () => set({ entries: [] }),
      getTotalCost: () => {
        const { entries } = get();
        return entries.reduce((total, entry) => total + entry.cost, 0);
      }
    }),
    {
      name: 'credits-store'
    }
  )
);