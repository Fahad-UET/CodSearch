import { create } from 'zustand';

interface CalculatorState {
  purchasePrice: number;
  salePrice: number;
  numberOfLeads: number;
  confirmationRate: number;
  deliveryRate: number;
  selectedCountry: string;
  productType: 'cosmetic' | 'gadget';
  serviceType: 'with' | 'without';
  monthlyCharges: number;
  setPurchasePrice: (price: number) => void;
  setSalePrice: (price: number) => void;
  setNumberOfLeads: (leads: number) => void;
  setConfirmationRate: (rate: number) => void;
  setDeliveryRate: (rate: number) => void;
  setSelectedCountry: (country: string) => void;
  setProductType: (type: 'cosmetic' | 'gadget') => void;
  setServiceType: (type: 'with' | 'without') => void;
  setMonthlyCharges: (charges: number) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  purchasePrice: 0,
  salePrice: 0,
  numberOfLeads: 100,
  confirmationRate: 60,
  deliveryRate: 45,
  selectedCountry: 'KSA',
  productType: 'cosmetic',
  serviceType: 'with',
  monthlyCharges: 0,

  setPurchasePrice: (price) => set({ purchasePrice: price }),
  setSalePrice: (price) => set({ salePrice: price }),
  setNumberOfLeads: (leads) => set({ numberOfLeads: leads }),
  setConfirmationRate: (rate) => set({ confirmationRate: rate }),
  setDeliveryRate: (rate) => set({ deliveryRate: rate }),
  setSelectedCountry: (country) => set({ selectedCountry: country }),
  setProductType: (type) => set({ productType: type }),
  setServiceType: (type) => set({ serviceType: type }),
  setMonthlyCharges: (charges) => set({ monthlyCharges: charges })
}));