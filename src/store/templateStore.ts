import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TemplateStore {
  templates: AdTemplate[];
  addTemplate: (template: Omit<AdTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<AdTemplate>) => void;
  deleteTemplate: (id: string) => void;
  getTemplatesByCategory: (category: string) => AdTemplate[];
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],

      addTemplate: (template) => set((state) => ({
        templates: [
          ...state.templates,
          {
            ...template,
            id: `template-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      })),

      updateTemplate: (id, updates) => set((state) => ({
        templates: state.templates.map(template =>
          template.id === id
            ? { ...template, ...updates, updatedAt: new Date() }
            : template
        )
      })),

      deleteTemplate: (id) => set((state) => ({
        templates: state.templates.filter(template => template.id !== id)
      })),

      getTemplatesByCategory: (category) => {
        const state = get();
        return state.templates.filter(template => template.category === category);
      }
    }),
    {
      name: 'template-store',
      version: 1
    }
  )
);