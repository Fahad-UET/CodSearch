import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Habit, Language } from '../types';

interface HabitListProps {
  habits: Habit[];
  selectedCategory: string;
  language: Language;
  onToggleHabit: (habitId: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export function HabitList({
  habits,
  selectedCategory,
  language,
  onToggleHabit,
  onDeleteHabit
}: HabitListProps) {
  const filteredHabits = habits.filter(habit => 
    selectedCategory === 'all' || habit.categoryId === selectedCategory
  );

  return (
    <div className="space-y-2">
      {filteredHabits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div
              onClick={() => onToggleHabit(habit.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                habit.completed
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-300 hover:border-purple-400'
              }`}
            >
              {habit.completed && <Check size={14} className="text-white" />}
            </div>
            <span className={`${habit.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {habit.title[language]}
            </span>
          </div>
          
          <div 
            onClick={() => onDeleteHabit(habit.id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <Trash2 size={16} />
          </div>
        </div>
      ))}

      {filteredHabits.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {language === 'en' ? 'No habits found' : 'لم يتم العثور على عادات'}
        </div>
      )}
    </div>
  );
}