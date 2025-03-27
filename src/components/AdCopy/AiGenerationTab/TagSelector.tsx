import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PREDEFINED_TAGS = [
  'Voice Over',
  'Ad Copy',
  'Header',
  'Customer Review',
  'Subtitle',
  'CTA',
  'Description',
  'Testimonial',
  'USP',
  'Notification Banner',
  'Guarantee',
  'Social Proof',
  'Title',
  'Benefits',
  'FAQ',
  'Offer'
];

interface TagSelectorProps {
  onSelect: (tag: string) => void;
}

export const TagSelector = ({ onSelect }: TagSelectorProps) => {
  const [selectedTag, setSelectedTag] = useState<string>('');

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    onSelect(tag);
  };

  return (
    <div className="relative">
      <select
        value={selectedTag}
        onChange={(e) => handleTagChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option value="">Select Text Type</option>
        {PREDEFINED_TAGS.map(tag => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
};