import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Language, ViewMode, HabitCategory } from '../types';
import { VIEW_MODES } from '../constants';

interface AddHabitModalProps {
  onClose: () => void;
  onAdd: (habit: { title: { en: string; ar: string }, categoryId: string, frequency: ViewMode }) => void;
  categories: HabitCategory[];
  language: Language;
}

export function AddHabitModal({ onClose, onAdd, categories, language }: AddHabitModalProps) {
  const [title, setTitle] = useState({ en: '', ar: '' });
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [frequency, setFrequency] = useState<ViewMode>('day');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title[language].trim()) {
      setError(language === 'en' ? 'Habit name is required' : 'اسم العادة مطلوب');
      return;
    }

    if (!categoryId) {
      setError(language === 'en' ? 'Please select a category' : 'الرجاء اختيار فئة');
      return;
    }

    onAdd({
      title,
      categoryId,
      frequency
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {language === 'en' ? 'Add New Habit' : 'إضافة عادة جديدة'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Habit Name' : 'اسم العادة'}
            </label>
            <input
              type="text"
              value={title[language]}
              onChange={(e) => setTitle({ ...title, [language]: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder={language === 'en' ? 'Enter habit name' : 'أدخل اسم العادة'}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Category' : 'الفئة'}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {categories
                .filter(category => category.id !== 'all')
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title[language]}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'en' ? 'Frequency' : 'التكرار'}
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as ViewMode)}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              {VIEW_MODES.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.label[language]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              {language === 'en' ? 'Add Habit' : 'إضافة العادة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}