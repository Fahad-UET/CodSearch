import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface HistoryItem {
  id: string;
  type:
    | 'video'
    | 'video-background-remover'
    | 'transcribe'
    | 'speech-to-video'
    | 'prompt'
    | 'lipsync'
    | 'text-to-image'
    | 'image'
    | 'text'
    | 'veo2'
    | 'text-to-speech'
    | 'image-watermark-remover'
    | 'video-watermark-remover'
    | 'video-to-audio'
    | 'change-image-background'
    | 'remove-image-background'
    | 'face-retoucher'
    | 'face-swap'
    | 'image-to-text'
    | 'outfits-image'
    | 'outfits-video'
    | 'product-image'
    | 'product-variations'
    | 'product-video'
    | 'product-replace'
    | 'image-upscaler'
    | 'video-upscaler';
  content: {
    prompt?: string;
    systemPrompt?: string;
    response?: string;
    reasoning?: string;
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    sourceImage?: string;
    sourceVideo?: string;
    aspectRatio?: string;
    duration?: string;
    seed?: string;
    details?: string;
  };
  timestamp: number;
}

interface HistoryState {
  items: HistoryItem[];
  addItem: (item: HistoryItem) => void;
  clearHistory: () => void;
  removeItem: (id: string) => void;
  setItems: (items: any) => void;
}

export const useHistory = create<HistoryState>()(
  persist(
    set => ({
      items: [],
      addItem: item =>
        set(state => ({
          items: [item, ...state.items],
        })),
      removeItem: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
      clearHistory: () => set({ items: [] }),
      setItems: (items: any) => set({ items }),
    }),
    {
      name: 'ai-tools-history',
    }
  )
);
