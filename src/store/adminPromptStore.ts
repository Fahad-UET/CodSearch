import create from 'zustand';

// Define the AdminPrompt type
interface AdminPrompt {
  id: string;
  content: string;
  language: 'ar' | 'en' | 'fr' | 'es';
  tags: string[];
  createdAt: Date;
  usedInPrompt?: boolean;
  productId: string;
  prompt?: any;
}

// Define the Zustand store
interface AdminPromptState {
  adminPrompts: AdminPrompt[];
  activeAdminPrompt: AdminPrompt | null;
  tags: string[]; // Global tags state
  setActiveAdminPrompt: (prompt: AdminPrompt | null) => void;
  addAdminPrompt: (newPrompt: any) => void;
  updateAdminPrompt: (id: string, content: string) => void;
  updateAdminPromptTags: (id: string, tags: string[]) => void;
  deleteAdminPrompt: (id: string) => void;
  markAdminPromptAsUsed: (id: string, used: boolean) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setAdminPrompts: (prompts: any) => void; // New handler to set the adminPrompts state
}

export const useAdminPromptsStore = create<AdminPromptState>((set, get) => ({
  adminPrompts: [],
  activeAdminPrompt: null,
  tags: [],

  setActiveAdminPrompt: prompt => set(() => ({ activeAdminPrompt: prompt })),

  addAdminPrompt: (newPrompt: any) => {
    set(state => ({ adminPrompts: newPrompt }));
  },

  updateAdminPrompt: (id, content) => {
    set(state => ({
      adminPrompts: state.adminPrompts.map(prompt =>
        prompt.id === id ? { ...prompt, content, createdAt: new Date() } : prompt
      ),
    }));
    set(() => ({ activeAdminPrompt: null }));
  },

  updateAdminPromptTags: (id, tags) => {
    set(state => ({
      adminPrompts: state.adminPrompts.map(prompt =>
        prompt.id === id ? { ...prompt, tags } : prompt
      ),
    }));
  },

  deleteAdminPrompt: id => {
    set(state => ({
      adminPrompts: state.adminPrompts.filter(prompt => prompt.id !== id),
    }));
  },

  markAdminPromptAsUsed: (id, used) => {
    set(state => ({
      adminPrompts: state.adminPrompts.map(prompt =>
        prompt.id === id ? { ...prompt, usedInPrompt: used } : prompt
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

  // New handler to set the entire adminPrompts state
  setAdminPrompts: prompts => set(() => ({ adminPrompts: prompts })),
}));
