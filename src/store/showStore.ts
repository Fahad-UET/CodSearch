import { create } from 'zustand';

interface AiTextState {
  showStore: any;
  setShowStore: (data: any) => void;
}

export const useShowStore = create<AiTextState>(set => ({
  showStore: [],

  setShowStore: (text: string) => {
    set({ showStore: text });
  },
}));
