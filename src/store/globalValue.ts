// src/stores/useStringStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StringStore {
  defaultValueComissionType: string;
  setdefaultValueComissionType: (newValue: string) => void;
}

export const useGobalValuesStore = create<StringStore>()(
  persist(
    set => ({
      defaultValueComissionType: 'Per Delivered',
      setdefaultValueComissionType: (newValue: string) =>
        set({ defaultValueComissionType: newValue }),
    }),
    {
      name: 'globalValues-store',
      version: 1,
    }
  )
);
