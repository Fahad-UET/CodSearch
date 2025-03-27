import { create } from 'zustand';
import { DEFAULT_VARIABLES } from '@/data/defaultVariables';

// Default variables

export interface Variable {
  id: string;
  name: string;
  value: string;
  description?: string;
  category?: string;
  productId?: string;
  global: boolean;
  updatedAt: Date;
}

export interface CreateVariableDto {
  name: string;
  value: string;
  description?: string;
  category?: string;
  productId?: string;
  global: boolean;
}

interface VariableStore {
  variables: Variable[];
  activeVariable: Variable | null;
  setActiveVariable: (variable: Variable | null) => void;
  createVariable: (data: CreateVariableDto) => void;
  updateVariable: (id: string, data: any) => void;
  // updateVariable: (id: string, data: Partial<Variable>) => void;
  deleteVariable: (id: string) => void;
  getVariableValue: (name: string, productId?: string) => string;
  replaceVariables: (text: string, productId?: string) => string;
  setVariables: (variables: Variable[]) => void;
}

export const useVariableStore = create<VariableStore>((set, get) => ({
  variables: [],
  activeVariable: null,

  setActiveVariable: variable => set(() => ({ activeVariable: variable })),

  createVariable: data =>
    set(state => ({
      variables: [
        ...state.variables,
        {
          ...data,
          id: `var-${Date.now()}`,
          updatedAt: new Date(),
        },
      ],
    })),

  updateVariable: (id, data) =>
    set(state => ({
      variables: state.variables.map(v =>
        v.id === id ? { ...v, ...data, updatedAt: new Date() } : v
      ),
    })),

  deleteVariable: id =>
    set(state => ({
      variables: state.variables.filter(v => v.id !== id),
    })),

  getVariableValue: (name, productId) => {
    const state = get();

    // Check product-specific variable first
    if (productId) {
      const productVar = state.variables.find(v => v.name === name && v.productId === productId);
      if (productVar) return productVar.value;
    }

    // Fall back to global variable
    const globalVar = state.variables.find(v => v.name === name && v.global);
    return globalVar?.value || '';
  },

  replaceVariables: (text: string, productId?: string) => {
    const state = get();
    return text.replace(/\{\{(\w+)\}\}/g, (_, name) => {
      return state.getVariableValue(name, productId) || `{{${name}}}`;
    });
  },

  setVariables: variables =>
    set(() => ({
      variables: variables.map(variable => ({
        ...variable,
        updatedAt: variable.updatedAt || new Date(),
      })),
    })),
}));
