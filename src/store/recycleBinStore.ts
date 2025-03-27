import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RecycleBinItem } from '../types/recycle-bin';

interface RecycleBinState {
  items: RecycleBinItem[];
  addItem: (item: Omit<RecycleBinItem, 'deletedAt'>) => void;
  restoreItem: (id: string) => RecycleBinItem | null;
  deleteItem: (id: string) => void;
  clearBin: () => void;
  getItems: (type?: 'board' | 'list' | 'card') => RecycleBinItem[];
}

const MAX_ITEMS = 100;
const RETENTION_DAYS = 30;

export const useRecycleBinStore = create<RecycleBinState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        // Remove oldest items if limit reached
        let items = [...state.items];
        if (items.length >= MAX_ITEMS) {
          items = items.slice(-MAX_ITEMS + 1);
        }

        // Remove expired items
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);
        items = items.filter(item => new Date(item.deletedAt) > cutoffDate);

        // Add new item
        return {
          items: [
            ...items,
            {
              ...item,
              deletedAt: new Date()
            }
          ]
        };
      }),

      restoreItem: (id) => {
        const item = get().items.find(item => item.id === id);
        if (item) {
          set((state) => ({
            items: state.items.filter(i => i.id !== id)
          }));
        }
        return item || null;
      },

      deleteItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      clearBin: () => set({ items: [] }),

      getItems: (type) => {
        const items = get().items;
        if (type) {
          return items.filter(item => item.type === type);
        }
        return items;
      }
    }),
    {
      name: 'recycle-bin-store',
      version: 1
    }
  )
);