import React from 'react';
import { BookmarkPlus } from 'lucide-react';

interface SavedPromptsProps {
  onSelect: (prompt: string) => void;
}

export const SavedPrompts: React.FC<SavedPromptsProps> = ({ onSelect }) => {
  const savedPrompts = [
    { id: 1, name: 'Product Description', text: 'Write a compelling product description...' },
    { id: 2, name: 'Feature List', text: 'Create a bullet-point list of key features...' },
  ];

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {}} // Implement save functionality
        className="p-2 text-gray-600 hover:text-blue-600"
        title="Save current prompt"
      >
        <BookmarkPlus className="h-5 w-5" />
      </button>

      <select
        onChange={e => onSelect(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md 
                   focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="">Saved Prompts</option>
        {savedPrompts.map(prompt => (
          <option key={prompt.id} value={prompt.text}>
            {prompt.name}
          </option>
        ))}
      </select>
    </div>
  );
};