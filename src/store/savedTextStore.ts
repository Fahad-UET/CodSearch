import create from 'zustand';

// Define the SavedText type
interface SavedText {
  id: string;
  content: string;
  language: 'ar' | 'en' | 'fr' | 'es';
  tags: string[];
  createdAt: Date;
  usedInPrompt?: boolean;
  productId: string;
}

// Define the Zustand store
interface SavedTextsState {
  savedTexts: SavedText[];
  activeText: SavedText | null;
  tags: string[]; // Global tags state
  setActiveText: (text: SavedText | null) => void;
  addText: (newText: any) => void;
  updateText: (id: string, content: string) => void;
  updateTags: (id: string, tags: string[]) => void;
  deleteText: (id: string) => void;
  markTextAsUsed: (id: string, used: boolean) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setSavedTexts: (texts: any) => void; // New handler to set the savedTexts state
}

export const useSavedTextsStore = create<SavedTextsState>((set, get) => ({
  savedTexts: [],
  activeText: null,
  tags: [],

  setActiveText: text => set(() => ({ activeText: text })),

  addText: (newText: any) => {
    set(state => ({ savedTexts: [newText, ...state.savedTexts] }));
  },

  updateText: (id, content) => {
    set(state => ({
      savedTexts: state.savedTexts.map(text =>
        text.id === id ? { ...text, content, createdAt: new Date() } : text
      ),
    }));
    set(() => ({ activeText: null }));
  },

  updateTags: (id, tags) => {
    set(state => ({
      savedTexts: state.savedTexts.map(text => (text.id === id ? { ...text, tags } : text)),
    }));
  },

  deleteText: id => {
    set(state => ({
      savedTexts: state.savedTexts.filter(text => text.id !== id),
    }));
  },

  markTextAsUsed: (id, used) => {
    set(state => ({
      savedTexts: state.savedTexts.map(text =>
        text.id === id ? { ...text, usedInPrompt: used } : text
      ),
    }));
  },

  addTag: tag => {
    set(state => ({
      tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag],
    }));
  },

  removeTag: tag => {
    set(state => ({
      tags: state.tags.filter(t => t !== tag),
    }));
  },

  // New handler to set the entire savedTexts state
  setSavedTexts: texts => set(() => ({ savedTexts: texts })),
}));
