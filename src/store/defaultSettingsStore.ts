import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DefaultSettings {
  chargePerProduct: number;
  stock: number;
  profitPerProduct: number;
  cpl: number;
  country: string;
  providerId: string;
  pomodoroTime?: string;
}

interface DefaultSettingsState {
  settings: DefaultSettings;
  updateSettings: (updates: Partial<DefaultSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: DefaultSettings = {
  chargePerProduct: 2.45,
  stock: 100,
  profitPerProduct: 10,
  cpl: 2.5,
  country: 'SAR',
  providerId: 'cod-network',
  pomodoroTime: undefined
};

export const useDefaultSettingsStore = create<DefaultSettingsState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      
      updateSettings: (updates) => set((state) => ({
        settings: { ...state.settings, ...updates }
      })),
      
      resetSettings: () => set({ settings: DEFAULT_SETTINGS })
    }),
    {
      name: 'default-settings-store',
      version: 1
    }
  )
);