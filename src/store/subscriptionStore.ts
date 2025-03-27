import { create } from 'zustand';
import { SubscriptionTier, UserSubscription } from '../types';

interface SubscriptionState {
  tiers: SubscriptionTier[];
  currentSubscription: UserSubscription | null;
  setCurrentSubscription: (subscription: UserSubscription | null) => void;
  upgradeSubscription: (tierId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: {
      monthly: 9.99,
      yearly: 7.99
    },
    productLimit: 50,
    features: [
      '1 Board',
      '5 Lists per Board',
      '50 Products',
      'Basic Features'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: {
      monthly: 19.99,
      yearly: 15.99
    },
    productLimit: 150,
    features: [
      '5 Boards',
      '20 Lists per Board',
      '150 Products',
      'Advanced Features'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    price: {
      monthly: 49.99,
      yearly: 39.99
    },
    productLimit: 500,
    features: [
      'Unlimited Boards',
      'Unlimited Lists',
      '500 Products',
      'Premium Features'
    ]
  }
];

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  tiers: subscriptionTiers,
  currentSubscription: {
    userId: 'default',
    tierId: 'starter',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
    autoRenew: true
  },

  setCurrentSubscription: (subscription) => set({ currentSubscription: subscription }),

  upgradeSubscription: async (tierId) => {
    try {
      const subscription: UserSubscription = {
        userId: 'current-user-id',
        tierId,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
        autoRenew: true
      };
      
      set({ currentSubscription: subscription });
    } catch (error) {
      console.error('Failed to upgrade subscription:', error);
      throw error;
    }
  },

  cancelSubscription: async () => {
    try {
      set((state) => ({
        currentSubscription: state.currentSubscription
          ? { ...state.currentSubscription, autoRenew: false }
          : null
      }));
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }
}));