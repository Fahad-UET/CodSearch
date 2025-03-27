import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedFormula } from '../types/formula';
import { evaluateFormula, validateFormula } from '../utils/formulaEvaluation';

interface FormulaState {
  formulas: SavedFormula[];
  addFormula: (formula: SavedFormula) => void;
  updateFormula: (id: string, updates: Partial<SavedFormula>) => void;
  deleteFormula: (id: string) => void;
  evaluateFormula: (formula: SavedFormula, variables: Record<string, number>) => number;
  validateFormula: (formula: SavedFormula) => boolean;
}

export const useFormulaStore = create<FormulaState>()(
  persist(
    (set, get) => ({
      formulas: [],

      addFormula: (formula) => {
        if (!validateFormula(formula.formula)) {
          throw new Error('Invalid formula');
        }
        set((state) => ({
          formulas: [...state.formulas, formula]
        }));
      },

      updateFormula: (id, updates) => {
        if (updates.formula && !validateFormula(updates.formula)) {
          throw new Error('Invalid formula');
        }
        set((state) => ({
          formulas: state.formulas.map((formula) =>
            formula.id === id
              ? { ...formula, ...updates, updatedAt: new Date() }
              : formula
          )
        }));
      },

      deleteFormula: (id) => set((state) => ({
        formulas: state.formulas.filter((formula) => formula.id !== id)
      })),

      evaluateFormula: (formula, variables) => {
        return evaluateFormula(formula.formula, variables);
      },

      validateFormula: (formula) => {
        return validateFormula(formula.formula);
      }
    }),
    {
      name: 'formula-store',
      version: 1
    }
  )
);