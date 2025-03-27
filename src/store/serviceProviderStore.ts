import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServiceProviderData, CountrySettingsData } from '../services/serviceProviders/types';
import { COD_NETWORK, DEFAULT_PROVIDERS } from '../services/serviceProviders/constants';

interface ServiceProviderState {
  providers: ServiceProviderData[];
  selectedProviderId: string;
  addProvider: (provider: ServiceProviderData) => void;
  updateProvider: (id: string, updates: Partial<ServiceProviderData>) => void;
  deleteProvider: (id: string) => void;
  setSelectedProvider: (id: string) => void;
  getProviderSettings: (providerId: string, country: string) => CountrySettingsData | undefined;
  resetToDefaults: () => void;
}

export const useServiceProviderStore = create<ServiceProviderState>()(
  persist(
    (set, get) => ({
      providers: DEFAULT_PROVIDERS,
      selectedProviderId: COD_NETWORK.id,

      addProvider: (provider) => {
        if (!provider.name.trim()) {
          throw new Error('Provider name is required');
        }
        
        set((state) => {
          // Check for duplicate names
          if (state.providers.some(p => p.name === provider.name)) {
            throw new Error('A provider with this name already exists');
          }
          
          return {
            providers: [...state.providers, {
              ...provider,
              id: `provider-${Date.now()}`,
              isDefault: false
            }]
          };
        });
      },

      updateProvider: (id, updates) => {
        if (updates.name && !updates.name.trim()) {
          throw new Error('Provider name is required');
        }
        
        set((state) => {
          // Don't allow modifying default provider's core properties
          if (id === COD_NETWORK.id) {
            const { name, isDefault, ...allowedUpdates } = updates;
            return {
              providers: state.providers.map(provider =>
                provider.id === id
                  ? { ...provider, ...allowedUpdates }
                  : provider
              )
            };
          }
          
          return {
            providers: state.providers.map(provider =>
              provider.id === id
                ? { ...provider, ...updates }
                : provider
            )
          };
        });
      },

      deleteProvider: (id) => {
        if (id === COD_NETWORK.id) {
          throw new Error('Cannot delete default provider');
        }
        
        set((state) => ({
          providers: state.providers.filter(provider => provider.id !== id),
          selectedProviderId: state.selectedProviderId === id ? COD_NETWORK.id : state.selectedProviderId
        }));
      },

      setSelectedProvider: (id) => set((state) => {
        // Validate provider exists
        if (!state.providers.some(p => p.id === id)) {
          return { selectedProviderId: COD_NETWORK.id };
        }
        return { selectedProviderId: id };
      }),

      getProviderSettings: (providerId, country) => {
        const state = get();
        const provider = state.providers.find(p => p.id === providerId);
        return provider?.countries[country];
      },

      resetToDefaults: () => set({
        providers: DEFAULT_PROVIDERS,
        selectedProviderId: COD_NETWORK.id
      })
    }),
    {
      name: 'service-provider-store',
      version: 1,
      partialize: (state) => ({
        providers: state.providers,
        selectedProviderId: state.selectedProviderId
      })
    }
  )
);