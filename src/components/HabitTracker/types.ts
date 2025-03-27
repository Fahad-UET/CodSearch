export type Language = 'en' | 'ar';
export type ViewMode = 'day' | 'week' | 'month' | 'year';

export interface HabitCategory {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  order: number;
}

export interface Habit {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  categoryId: string;
  completed: boolean;
  order: number;
  frequency: ViewMode;
  createdAt: Date;
  updatedAt: Date;
}