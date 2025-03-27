import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyMetrics } from '../types';

interface AdTestingState {
  days: DailyMetrics[];

  addDay: () => void;
  updateDay: (dayId: string, updates: Partial<DailyMetrics>) => void;
  deleteDay: (dayId: string) => void;
}

export const useAdTestingStore = create<AdTestingState>()(
  persist(
    set => ({
      days: [
        {
          id: '1',
          day: 1,
          sellingPrice: 0,
          cpc: 0,
          cpm: 0,
          ctr: 0,
          adBudget: 0,
          leads: 0,
          confirmedOrders: 0,
          deliveredOrders: 0,
          impressions: 0,
          clicks: 0
        },
      ],

      addDay: () =>
        set(state => {
          const newDay = state.days.length + 1;
          return {
            days: [
              ...state.days,
              {
                id: newDay.toString(),
                day: newDay,
                sellingPrice: 0,
                cpc: 0,
                cpm: 0,
                ctr: 0,
                adBudget: 0,
                leads: 0,
                confirmedOrders: 0,
                deliveredOrders: 0,
                impressions: 0,
                clicks: 0
              },
            ],
          };
        }),

      updateDay: (dayId, updates) =>
        set(state => ({
          days: state.days.map(day => (day.id === dayId ? { ...day, ...updates } : day)),
        })),

      deleteDay: dayId =>
        set(state => ({
          days: state.days.filter(day => day.id !== dayId),
        })),
    }),
    {
      name: 'ad-testing-store',
      version: 1,
    }
  )
);
