import React from 'react';

interface TextItem {
  id: string;
  content: string;
  tags: string[];
}

interface TextListProps {
  texts: TextItem[];
  selectedTag: string | null;
  onSelectText: (content: string) => void;
}

export const TextList: React.FC<TextListProps> = ({
  texts,
  selectedTag,
  onSelectText,
}) => {
  const filteredTexts = selectedTag
    ? texts.filter(text => text.tags.includes(selectedTag))
    : texts;

  return (
    <div className="space-y-2 mt-4">
      {filteredTexts.map(text => (
        <button
          key={text.id}
          onClick={() => onSelectText(text.content)}
          className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 
                     transition-colors text-sm text-gray-700"
        >
          <div className="line-clamp-2">{text.content}</div>
        </button>
      ))}
    </div>
  );
};