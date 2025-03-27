import React from 'react';
import type { Tag } from '../../../../types/tags';

interface Props {
  tags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagId: string) => void;
}

export default function TagFilter({ tags, selectedTags, onTagSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <button
          key={tag.id}
          onClick={() => onTagSelect(tag.id)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedTags.includes(tag.id)
              ? `text-white shadow-md`
              : 'text-gray-600 hover:text-gray-800 bg-white/50 hover:bg-white'
          }`}
          style={{
            backgroundColor: selectedTags.includes(tag.id) ? tag.color : undefined,
            borderColor: tag.color,
            borderWidth: '1px',
          }}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
