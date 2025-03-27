import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RatingAnswers, ProductRatings } from '../types';

interface RatingState {
  ratings: ProductRatings;
  getProductRatingAnswers: (productId: string) => RatingAnswers;
  updateProductRatingAnswers: (productId: string, answers: RatingAnswers) => number;
  calculateRating: (answers: RatingAnswers) => number;
}

export const useRatingStore = create<RatingState>()(
  persist(
    (set, get) => ({
      ratings: {},

      getProductRatingAnswers: (productId: string) => {
        return get().ratings[productId]?.answers || {};
      },

      updateProductRatingAnswers: (productId: string, answers: RatingAnswers) => {
        const rating = get().calculateRating(answers);
        
        set((state) => ({
          ratings: {
            ...state.ratings,
            [productId]: {
              rating,
              answers: { ...answers },
              lastUpdated: new Date().toISOString()
            }
          }
        }));

        return rating;
      },

      calculateRating: (answers: RatingAnswers): number => {
        if (Object.keys(answers).length === 0) return 0;
        
        const totalScore: any = Object.values(answers).reduce((sum: number, score: number) => sum + score, 0);
        const averageScore: number = totalScore / Object.keys(answers).length;
        
        // Convert to 0-10 scale and round to nearest 0.5
        return Math.round(averageScore * 2) / 2;
      }
    }),
    {
      name: 'product-ratings',
      version: 1,
      partialize: (state) => ({ ratings: state.ratings })
    }
  )
);