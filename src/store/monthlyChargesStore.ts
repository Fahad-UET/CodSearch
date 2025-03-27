import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MonthlyCharge, ChargeCategory } from '../types';

interface MonthlyChargesState {
  monthlyCharges: MonthlyCharge[];
  chargeCategories: ChargeCategory[];
  addMonthlyCharge: (charge: Omit<MonthlyCharge, 'id'>) => void;
  updateMonthlyCharge: (id: string, updates: Partial<MonthlyCharge>) => void;
  deleteMonthlyCharge: (id: string) => void;
  addCategory: (category: Omit<ChargeCategory, 'id' | 'subcategories'>) => void;
  updateCategory: (id: string, updates: Partial<ChargeCategory>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, label: string) => void;
  updateSubcategory: (
    categoryId: string,
    subcategoryId: string,
    updates: Partial<{ label: string; isActive: boolean }>
  ) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;
  initializeDefaultCategories: () => void;
}

// Default categories configuration
const DEFAULT_CATEGORIES: ChargeCategory[] = [
  {
    id: 'fixed-charges',
    label: 'Fixed Charges',
    isActive: true,
    subcategories: [
      { id: 'store', label: 'Store', isActive: true },
      { id: 'software', label: 'Software Subscriptions', isActive: true },
      { id: 'teams', label: 'Teams', isActive: true },
      { id: 'banking', label: 'Banking', isActive: true },
      { id: 'company', label: 'Company', isActive: true },
    ],
  },
  {
    id: 'variable-charges',
    label: 'Variable Charges',
    isActive: true,
    subcategories: [
      { id: 'ad-accounts', label: 'Ad Accounts', isActive: true },
      { id: 'testing-ads', label: 'Testing ads', isActive: true },
    ],
  },
];

// Default charges configuration
const DEFAULT_CHARGES: Omit<MonthlyCharge, 'id'>[] = [
  {
    name: 'YouCan Hosting',
    amount: 27,
    period: 'monthly',
    categoryId: 'fixed-charges',
    subcategoryId: 'store',
    isActive: false,
  },
  {
    name: 'Domain Name',
    amount: 20,
    period: 'yearly',
    categoryId: 'fixed-charges',
    subcategoryId: 'store',
    isActive: true,
  },
  {
    name: 'Video Editing',
    amount: 19,
    period: 'monthly',
    categoryId: 'fixed-charges',
    subcategoryId: 'software',
    isActive: false,
  },
  {
    name: 'ChatGPT',
    amount: 20,
    period: 'monthly',
    categoryId: 'fixed-charges',
    subcategoryId: 'software',
    isActive: true,
  },
];

export const useMonthlyChargesStore = create<MonthlyChargesState>()(
  persist(
    (set, get) => ({
      monthlyCharges: [],
      chargeCategories: DEFAULT_CATEGORIES,

      addMonthlyCharge: charge =>
        set(state => ({
          monthlyCharges: [
            ...state.monthlyCharges,
            {
              ...charge,
              // id: `charge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            },
          ],
        })),

      updateMonthlyCharge: (id, updates) =>
        set(state => ({
          monthlyCharges: state.monthlyCharges.map(charge =>
            charge.id === id ? { ...charge, ...updates } : charge
          ),
        })),

      deleteMonthlyCharge: id =>
        set(state => ({
          monthlyCharges: state.monthlyCharges.filter(charge => charge.id !== id),
        })),

      addCategory: category =>
        set(state => ({
          chargeCategories: [
            ...state.chargeCategories,
            {
              ...category,
              id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              subcategories: [],
            },
          ],
        })),

      updateCategory: (id, updates) =>
        set(state => ({
          chargeCategories: state.chargeCategories.map(category =>
            category.id === id ? { ...category, ...updates } : category
          ),
        })),

      deleteCategory: id =>
        set(state => ({
          chargeCategories: state.chargeCategories.filter(category => category.id !== id),
          monthlyCharges: state.monthlyCharges.filter(charge => charge.categoryId !== id),
        })),

      addSubcategory: (categoryId, label) =>
        set(state => ({
          chargeCategories: state.chargeCategories.map(category =>
            category.id === categoryId
              ? {
                  ...category,
                  subcategories: [
                    ...category.subcategories,
                    {
                      id: `subcategory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      label,
                      isActive: true,
                    },
                  ],
                }
              : category
          ),
        })),

      updateSubcategory: (categoryId, subcategoryId, updates) =>
        set(state => ({
          chargeCategories: state.chargeCategories.map(category =>
            category.id === categoryId
              ? {
                  ...category,
                  subcategories: category.subcategories.map(sub =>
                    sub.id === subcategoryId ? { ...sub, ...updates } : sub
                  ),
                }
              : category
          ),
        })),

      deleteSubcategory: (categoryId, subcategoryId) =>
        set(state => ({
          chargeCategories: state.chargeCategories.map(category =>
            category.id === categoryId
              ? {
                  ...category,
                  subcategories: category.subcategories.filter(sub => sub.id !== subcategoryId),
                }
              : category
          ),
          monthlyCharges: state.monthlyCharges.filter(
            charge => !(charge.categoryId === categoryId && charge.subcategoryId === subcategoryId)
          ),
        })),

      initializeDefaultCategories: () =>
        set({
          chargeCategories: DEFAULT_CATEGORIES,
          monthlyCharges: DEFAULT_CHARGES.map(charge => ({
            ...charge,
            id: `charge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })),
        }),
    }),
    {
      name: 'monthly-charges-storage',
      version: 1,
    }
  )
);
