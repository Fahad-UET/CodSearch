import { HabitCategory, Habit } from './types';

export const DEFAULT_CATEGORIES: HabitCategory[] = [
  {
    id: 'all',
    title: { en: 'All Habits', ar: 'كل العادات' },
    order: 0
  },
  {
    id: 'daily-routine',
    title: { en: 'Daily Routine', ar: 'الروتين اليومي' },
    order: 1
  },
  {
    id: 'marketing',
    title: { en: 'Marketing', ar: 'التسويق والإعلانات' },
    order: 2
  },
  {
    id: 'analysis',
    title: { en: 'Analysis', ar: 'التحليل والتحسين' },
    order: 3
  },
  {
    id: 'development',
    title: { en: 'Development', ar: 'التطوير الشخصي' },
    order: 4
  },
  {
    id: 'operations',
    title: { en: 'Operations', ar: 'العمليات المتقدمة' },
    order: 5
  },
  {
    id: 'wellbeing',
    title: { en: 'Wellbeing', ar: 'الرفاهية والتنظيم' },
    order: 6
  }
];

export const DEFAULT_HABITS: Habit[] = [
  // Daily Routine
  {
    id: 'habit-1',
    title: { en: 'Morning Prayer', ar: 'أداء صلاة الفجر في وقتها' },
    categoryId: 'daily-routine',
    completed: false,
    order: 1,
    frequency: 'day',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  // Add more default habits here...
];

export const VIEW_MODES = [
  { id: 'day', label: { en: 'Day', ar: 'اليوم' } },
  { id: 'week', label: { en: 'Week', ar: 'الأسبوع' } },
  { id: 'month', label: { en: 'Month', ar: 'الشهر' } },
  { id: 'year', label: { en: 'Year', ar: 'السنة' } }
] as const;