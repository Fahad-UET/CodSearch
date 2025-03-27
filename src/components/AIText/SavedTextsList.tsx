import React from 'react';
import { DEFAULT_TAGS } from './ui/DefaultTags';
import TextCarousel from './carousel/TextCarousel';
import { useSavedTextsStore } from '@/store/savedTextStore';

interface Props {
  selectedTag: string | null;
  onTextSelect: (text: string, id: string) => void;
  currentPrompt: string;
  product: any;
}

export default function SavedTextsList({
  selectedTag,
  onTextSelect,
  currentPrompt,
  product,
}: Props) {
  const { savedTexts } = useSavedTextsStore();

  const filteredTexts = React.useMemo(() => {
    if (!selectedTag) return product?.generatedText;
    return product?.generatedText?.filter(text => text.tags.includes(selectedTag));
  }, [product?.generatedText, selectedTag]);

  if (filteredTexts?.length === 0) {
    const tag = DEFAULT_TAGS.find(t => t.id === selectedTag);
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No saved texts found {tag ? `for ${tag.name}` : ''}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TextCarousel
        activeTab={selectedTag}
        texts={filteredTexts || []}
        onTextSelect={onTextSelect}
        currentPrompt={currentPrompt}
      />
    </div>
  );
}
