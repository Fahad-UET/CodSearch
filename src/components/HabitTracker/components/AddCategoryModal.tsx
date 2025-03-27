import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface AddCategoryModalProps {
  onClose: () => void;
  onAdd: (category: { title: { en: string; ar: string } }) => void;
  language: Language;
}

export function AddCategoryModal({ onClose, onAdd, language }: AddCategoryModalProps) {
  const [title, setTitle] = useState({ en: '', ar: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title[language].trim()) {
      setError(language === 'en' ? 'Category name is required' : 'اسم الفئة مطلوب');
      return;
    }
    // to resolve build issue please check this
    // onAdd(title);
    onAdd({title});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {language === 'en' ? 'Add New Category' : 'إضافة فئة جديدة'}
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
              {language === 'en' ? 'Category Name' : 'اسم الفئة'}
            </label>
            <input
              type="text"
              value={title[language]}
              onChange={(e) => setTitle({ ...title, [language]: e.target.value })}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder={language === 'en' ? 'Enter category name' : 'أدخل اسم الفئة'}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
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
              {language === 'en' ? 'Add Category' : 'إضافة الفئة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}