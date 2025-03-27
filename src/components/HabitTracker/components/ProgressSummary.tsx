import React from 'react';
import { CheckCircle, TrendingUp } from 'lucide-react';
import { Habit, Language, ViewMode } from '../types';

interface ProgressSummaryProps {
  habits: Habit[];
  viewMode: ViewMode;
  language: Language;
}

function getProgressPercentage(habits: Habit[]): number {
  if (habits.length === 0) return 0;
  const completed = habits.filter(habit => habit.completed).length;
  return Math.round((completed / habits.length) * 100);
}

export function ProgressSummary({ habits, viewMode, language }: ProgressSummaryProps) {
  const percentage = getProgressPercentage(habits);
  const completed = habits.filter(habit => habit.completed).length;
  const total = habits.length;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Completion Rate */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle size={20} className="text-purple-200" />
          <h3 className="font-medium">
            {language === 'en' ? 'Completion Rate' : 'معدل الإنجاز'}
          </h3>
        </div>
        <p className="text-3xl font-bold">{percentage}%</p>
        <p className="text-sm text-purple-200 mt-1">
          {language === 'en' 
            ? `${completed} of ${total} habits completed`
            : `${completed} من ${total} عادات مكتملة`
          }
        </p>
      </div>

      {/* Progress by Period */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={20} className="text-emerald-200" />
          <h3 className="font-medium">
            {language === 'en' ? `${viewMode} Progress` : `تقدم ال${viewMode === 'day' ? 'يوم' : viewMode === 'week' ? 'أسبوع' : viewMode === 'month' ? 'شهر' : 'سنة'}`}
          </h3>
        </div>
        <p className="text-3xl font-bold">{percentage}%</p>
        <p className="text-sm text-emerald-200 mt-1">
          {language === 'en'
            ? `${completed} habits completed this ${viewMode}`
            : `${completed} عادات مكتملة هذا ال${viewMode === 'day' ? 'يوم' : viewMode === 'week' ? 'أسبوع' : viewMode === 'month' ? 'شهر' : 'سنة'}`
          }
        </p>
      </div>
    </div>
  );
}