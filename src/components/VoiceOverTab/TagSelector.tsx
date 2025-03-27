import React from 'react';
import { Tag } from 'lucide-react';

interface TagSelectorProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTag,
  onSelectTag,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Tag size={16} />
        <span>Select a tag to view related texts</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedTag === tag 
                ? 'bg-primary-100 text-primary-700 border-primary-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};