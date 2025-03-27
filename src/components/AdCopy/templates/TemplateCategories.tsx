import React from 'react';
import { Template } from '../../../types/templates';

interface TemplateCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  templates: Template[];
}

export function TemplateCategories({
  selectedCategory,
  onSelectCategory,
  templates
}: TemplateCategoriesProps) {
  // Get unique categories and count templates in each
  const categories = templates.reduce((acc, template) => {
    acc[template.category] = (acc[template.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = templates.length;

  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelectCategory('all')}
        className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
          selectedCategory === 'all'
            ? 'bg-purple-100 text-purple-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <div className="flex justify-between items-center">
          <span>All Templates</span>
          <span className="text-sm bg-white px-2 py-0.5 rounded-full">
            {totalCount}
          </span>
        </div>
      </button>

      {Object.entries(categories).map(([category, count]) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
            selectedCategory === category
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{category}</span>
            <span className="text-sm bg-white px-2 py-0.5 rounded-full">
              {count}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}