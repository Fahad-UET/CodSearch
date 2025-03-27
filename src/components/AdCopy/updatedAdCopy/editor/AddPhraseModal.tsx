import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { QuickPhrase } from '../data/quickPhrases';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (phrase: QuickPhrase) => void;
  categories: string[];
}

export default function AddPhraseModal({ isOpen, onClose, onAdd, categories }: Props) {
  const [formData, setFormData] = useState<Omit<QuickPhrase, 'id'>>({
    text: '',
    category: categories[0],
    emoji: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ text: '', category: categories[0], emoji: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Add New Quick Phrase</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phrase Text</label>
            <input
              type="text"
              value={formData.text}
              onChange={e => setFormData(prev => ({ ...prev, text: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emoji (Optional)</label>
            <input
              type="text"
              value={formData.emoji}
              onChange={e => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              placeholder="Enter an emoji"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-[#5D1C83] hover:bg-[#6D2C93] rounded-md"
            >
              Add Phrase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
