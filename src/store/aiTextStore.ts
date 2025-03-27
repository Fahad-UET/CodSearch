import { create } from 'zustand';

interface AiTextState {
  activeAiTextSt: string;
  setActiveAiText: (text: string) => void;
  aiTextSt: any;
  setAiTextSt: (data: any) => void;
}

export const useAiTextStore = create<AiTextState>(set => ({
  activeAiTextSt: '',

  setActiveAiText: (text: string) => {
    set({ activeAiTextSt: text });
  },

  aiTextSt: '',

  setAiTextSt: (text: string) => {
    set({ aiTextSt: text });
  },
}));
