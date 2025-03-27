import { Folder, FolderOpen } from 'lucide-react';
import type { BookmarkCategory } from './types';

interface CategoryListProps {
  categories: BookmarkCategory[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const CategoryList = ({ categories, selectedId, onSelect }: CategoryListProps) => {
  return (
    <div className="w-48 bg-white rounded-lg shadow p-3">
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 w-full p-2 rounded text-left ${
          selectedId === null ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
        }`}
      >
        {selectedId === null ? (
          <FolderOpen className="w-4 h-4" />
        ) : (
          <Folder className="w-4 h-4" />
        )}
        <span>All Bookmarks</span>
      </button>
      
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`flex items-center gap-2 w-full p-2 rounded text-left ${
            selectedId === category.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
          }`}
        >
          {selectedId === category.id ? (
            <FolderOpen className="w-4 h-4" />
          ) : (
            <Folder className="w-4 h-4" />
          )}
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};