import { create } from 'zustand';

interface GlobalValuesState {
  defaultCountry: string;
  setDefaultCountry: (country: string) => void;
  defaultCurrency: string;
  setDefaultCurrency: (currency: string) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  defaultValueComissionType: string;
  setdefaultValueComissionType: (comissionType: string) => void;
  toggleOpen: () => void;
  monthlyCharge: boolean;
  setMonthlyCharge: (charge: boolean) => void;
}

export const useGobalValuesStore = create<GlobalValuesState>(set => ({
  defaultCountry: 'US',
  setDefaultCountry: country => set({ defaultCountry: country }),
  defaultCurrency: 'USD',
  setDefaultCurrency: currency => set({ defaultCurrency: currency }),
  exchangeRate: 1,
  setExchangeRate: rate => set({ exchangeRate: rate }),
  defaultValueComissionType: 'Per Deliverd',
  setdefaultValueComissionType: comissionType => set({ defaultValueComissionType: comissionType }),
  toggleOpen: () => set(state => ({ monthlyCharge: !state.monthlyCharge })),
  monthlyCharge: false,
  setMonthlyCharge: (charge: boolean) => set({ monthlyCharge: charge }),
}));
