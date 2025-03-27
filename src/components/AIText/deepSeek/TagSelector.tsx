import React from 'react';
import { Tag } from 'lucide-react';
import { DEFAULT_TAGS } from '@/types/tags';

interface Props {
  selectedTag: string | null;
  onTagSelect: (tagId: string | null) => void;
}

export default function TagSelector({ selectedTag, onTagSelect }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Tag className="w-4 h-4" />
        <span className="text-sm font-medium">Filter by tag:</span>
      </div>
      <select
        value={selectedTag || ''}
        onChange={e => onTagSelect(e.target.value || null)}
        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
      >
        <option value="">All Tags</option>
        {DEFAULT_TAGS.map(tag => (
          <option key={tag.id} value={tag.id}>
            {tag.name}
          </option>
        ))}
      </select>
    </div>
  );
}
