import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { CreateListDto, FavoritesList } from '../../../../types';
import { useFavoritesStore } from '../../../../store/FavouriteStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (list: FavoritesList) => void;
}

export default function CreateListModal({ isOpen, onClose, onCreated }: Props) {
  const [formData, setFormData] = useState<CreateListDto>({
    name: '',
    description: '',
    isPublic: false,
  });

  const { createList } = useFavoritesStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const list = createList(formData);
    const newList: FavoritesList = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      isPublic: formData.isPublic ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'current-user', // Replace with actual user ID
      items: [],
    };
    onCreated(newList);
    setFormData({ name: '', description: '', isPublic: false });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Créer une nouvelle liste</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la liste</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnelle)
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              rows={3}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={e => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="rounded border-gray-300 text-[#5D1C83] focus:ring-[#5D1C83]"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-600">
              Rendre cette liste publique
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-[#5D1C83] hover:bg-[#6D2C93] rounded-md"
            >
              Créer la liste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
