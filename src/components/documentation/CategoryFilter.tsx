import React from 'react';
import { Book, ChevronRight } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => onSelect(null)}
          className={`w-full flex items-center justify-between p-2 rounded-lg transition ${
            !selectedCategory 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center">
            <Book className="h-5 w-5 mr-3" />
            <span>Tous les outils</span>
          </div>
          <ChevronRight className="h-4 w-4" />
        </button>

        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`w-full flex items-center justify-between p-2 rounded-lg transition ${
              selectedCategory === category.id
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <Book className="h-5 w-5 mr-3" />
              <span>{category.name}</span>
            </div>
            <span className="text-sm text-gray-500">{category.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}