import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KpiSettings, DEFAULT_KPI_SETTINGS } from '../types/kpi';

interface KpiState {
  settings: KpiSettings;
  updateCountrySettings: (countryCode: string, settings: typeof DEFAULT_KPI_SETTINGS) => void;
  resetToDefaults: (countryCode: string) => void;
  getCountrySettings: (countryCode: string) => typeof DEFAULT_KPI_SETTINGS;
}

export const useKpiStore = create<KpiState>()(
  persist(
    (set, get) => ({
      settings: {
        SAR: DEFAULT_KPI_SETTINGS // Initialize with default settings for SAR
      },
      
      updateCountrySettings: (countryCode, settings) => 
        set((state) => ({
          settings: {
            ...state.settings,
            [countryCode]: settings
          }
        })),
      
      resetToDefaults: (countryCode) =>
        set((state) => ({
          settings: {
            ...state.settings,
            [countryCode]: DEFAULT_KPI_SETTINGS
          }
        })),

      getCountrySettings: (countryCode) => {
        const state = get();
        return state.settings[countryCode] || DEFAULT_KPI_SETTINGS;
      }
    }),
    {
      name: 'kpi-settings',
      version: 1
    }
  )
);