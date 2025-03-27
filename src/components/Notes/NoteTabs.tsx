import React from 'react';
import { NoteCategory } from './types';

interface NoteTabsProps {
  categories: NoteCategory[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export function NoteTabs({ categories, activeCategory, onSelectCategory }: NoteTabsProps) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-2 px-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all shadow-sm hover:shadow-md ${
            activeCategory === category.id
              ? `bg-gradient-to-r ${category.color} text-white`
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          {category.name}
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/90">
            {category.count}
          </span>
        </button>
      ))}
    </div>
  );
}