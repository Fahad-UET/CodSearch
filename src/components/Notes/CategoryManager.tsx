import React, { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { NOTE_COLORS } from './types';

interface CategoryManagerProps {
  categories: { id: string; name: string; color: string }[];
  onAddCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  onClose: () => void;
}

export function CategoryManager({ categories, onAddCategory, onDeleteCategory, onClose }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(Object.values(NOTE_COLORS)[0]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      setError('Category already exists');
      return;
    }

    onAddCategory(newCategoryName, selectedColor);
    setNewCategoryName('');
    setSelectedColor(Object.values(NOTE_COLORS)[0]);
    setError(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Manage Categories</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Color
              </label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(NOTE_COLORS).map(([name, color]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-full aspect-square rounded-lg bg-gradient-to-r ${color} ${
                      selectedColor === color ? 'ring-2 ring-purple-600 ring-offset-2' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Category
            </button>
          </div>
        </form>

        <div className="p-6 border-t bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Existing Categories</h3>
          <div className="space-y-2">
            {categories.filter(c => c.id !== 'all').map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${category.color}`} />
                  <span className="font-medium">{category.name}</span>
                </div>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}