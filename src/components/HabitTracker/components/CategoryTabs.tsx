import React from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { HabitCategory, Language } from '../types';

interface CategoryTabsProps {
  categories: HabitCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (categoryId: string) => void;
  language: Language;
}

export function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onDeleteCategory,
  language
}: CategoryTabsProps) {
  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = 200;
      scrollContainer.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Scroll Left Button */}
      <div 
        onClick={() => scroll('left')}
        className="absolute left-0 z-10 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-md cursor-pointer hover:bg-white"
      >
        <ChevronLeft size={20} className="text-gray-600" />
      </div>

      {/* Categories Container */}
      <div 
        ref={scrollContainer}
        className="flex-1 overflow-x-auto hide-scrollbar mx-8 py-2"
      >
        <div className="flex gap-2">
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
            >
              <span 
                onClick={() => onSelectCategory(category.id)}
                className="cursor-pointer whitespace-nowrap"
              >
                {category.title[language]}
              </span>
              {category.id !== 'all' && (
                <span
                  onClick={() => onDeleteCategory(category.id)}
                  className="p-1 hover:bg-red-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} className="text-red-500" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Right Button */}
      <div 
        onClick={() => scroll('right')}
        className="absolute right-0 z-10 p-1 bg-white/80 backdrop-blur-sm rounded-full shadow-md cursor-pointer hover:bg-white"
      >
        <ChevronRight size={20} className="text-gray-600" />
      </div>

      {/* Add Category Button */}
      <div 
        onClick={onAddCategory}
        className="ml-4 p-2 bg-purple-600 text-white rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
      >
        <Plus size={20} />
      </div>
    </div>
  );
}