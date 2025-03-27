import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Habit, HabitCategory, Language } from '../components/HabitTracker/types';
import { DEFAULT_CATEGORIES, DEFAULT_HABITS } from '../components/HabitTracker/constants'; 

interface HabitStore {
  habits: Habit[];
  categories: HabitCategory[];
  language: Language;
  initialized: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  toggleHabit: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  addCategory: (category: Omit<HabitCategory, 'id' | 'order'>) => void;
  deleteCategory: (categoryId: string) => void;
  setLanguage: (language: Language) => void;
  resetToDefaults: () => void;
  initialize: () => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      categories: [],
      language: 'en',
      initialized: false,

      initialize: () => {
        const { initialized } = get();
        if (!initialized) {
          set({
            habits: DEFAULT_HABITS,
            categories: DEFAULT_CATEGORIES,
            initialized: true
          });
        }
      },

      addHabit: (habit) => set((state) => {
        const maxOrder = Math.max(0, ...state.habits
          .filter(h => h.categoryId === habit.categoryId)
          .map(h => h.order));

        const newHabit: Habit = {
          ...habit,
          id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          order: maxOrder + 1
        };

        return { habits: [...state.habits, newHabit] };
      }),

      toggleHabit: (habitId) => set((state) => ({
        habits: state.habits.map(habit =>
          habit.id === habitId
            ? { ...habit, completed: !habit.completed, updatedAt: new Date() }
            : habit
        )
      })),

      deleteHabit: (habitId) => set((state) => ({
        habits: state.habits.filter(habit => habit.id !== habitId)
      })),

      addCategory: (category) => set((state) => {
        const maxOrder = Math.max(0, ...state.categories.map(c => c.order));
        const newCategory: HabitCategory = {
          ...category,
          id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          order: maxOrder + 1
        };
        return { categories: [...state.categories, newCategory] };
      }),

      deleteCategory: (categoryId) => set((state) => ({
        categories: state.categories.filter(category => category.id !== categoryId),
        habits: state.habits.filter(habit => habit.categoryId !== categoryId)
      })),

      setLanguage: (language) => set({ language }),

      resetToDefaults: () => set({
        habits: DEFAULT_HABITS,
        categories: DEFAULT_CATEGORIES,
        initialized: true
      })
    }),
    {
      name: 'habit-store',
      version: 2,
      onRehydrateStorage: () => (state) => {
        // Initialize store with defaults if empty
        if (!state?.initialized) {
          state?.initialize();
        }
      }
    }
  )
);