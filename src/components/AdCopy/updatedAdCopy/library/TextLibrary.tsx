import React, { useEffect, useState } from 'react';
import { Tag as TagIcon, Filter } from 'lucide-react';
import { DEFAULT_TAGS } from '../../../../types/tags';
import SavedTextCard from './SavedTextCard';
import TagFilter from './TagFilter';
import { useSavedTextsStore } from '@/store/savedTextStore';
import { getEditorAiTextByProductId, updateEditorAiText } from '@/services/firebase/textEditor';
import { updateProduct as updateProductService } from '@/services/firebase';
import { useProductStore } from '@/store';

export default function TextLibrary({ product, setActiveTab }: any) {
  const updateProduct = useProductStore(state => state.updateProduct);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagMenu, setShowTagMenu] = React.useState<{ status: boolean; index: number }>({
    index: null,
    status: false,
  });
  const { updateTags } = useSavedTextsStore();

  const filteredTexts = React.useMemo(() => {
    if (selectedTags.length === 0) return product?.generatedText;
    return product?.generatedText?.filter(text =>
      selectedTags.some(tag => text.tags.includes(tag))
    );
  }, [product, selectedTags]);

  // useEffect(() => {
  //   const fetchEditorAiText = async () => {
  //     try {
  //       const data = await getEditorAiTextByProductId(product.id);
  //       setSavedTexts(data);
  //     } catch (error) {
  //       console.error('Error fetching editor AI text:', error);
  //     }
  //   };

  //   fetchEditorAiText();
  // }, [product.id]);
  const handleDelete = async (id: string) => {
    try {
      const updatedProduct = {
        ...product,
        generatedText: product?.generatedText?.filter((text: any) => text.id !== id),
      };
      await updateProductService(product.id, updatedProduct);
      updateProduct(product?.id, updatedProduct);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tag filters */}
      <div
        className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm"
        key="filter-section"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            {/* <Filter className="w-4 h-4" /> */}
            <span className="text-sm font-medium">Filter by tags:</span>
          </div>
          <TagFilter
            tags={DEFAULT_TAGS}
            selectedTags={selectedTags}
            onTagSelect={tagId => {
              setSelectedTags(prev =>
                prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
              );
            }}
          />
        </div>
      </div>

      {/* Grid of saved texts */}
      <div className="flex-1 p-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {filteredTexts?.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                {product?.generatedText?.length === 0
                  ? 'No saved texts yet. Start saving some texts!'
                  : 'No texts match the selected filters.'}
              </p>
            </div>
          )}
          {filteredTexts?.map((text, ind) => (
            <div className="relative" key={text.id}>
              <SavedTextCard
                showTagMenu={showTagMenu}
                setShowTagMenu={setShowTagMenu}
                text={text}
                onDelete={handleDelete}
                onCopy={content => {
                  navigator.clipboard.writeText(content);
                }}
                ind={ind}
                setActiveTab={setActiveTab}
              />
              {showTagMenu.status && showTagMenu.index === ind && (
                <div
                  className="absolute top-5 right-[1rem] mt-5 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 py-1 z-50"
                  onClick={e => e.stopPropagation()}
                >
                  {DEFAULT_TAGS.map(tag => (
                    <button
                      key={tag.id}
                      onClick={async () => {
                        const clonedStructure = structuredClone(product?.generatedText || []);
                        // Iterate over the clonedStructure to find the matching item and update its tags
                        const updatedStructure = clonedStructure.map(item => {
                          if (item.id === text.id) {
                            const newTags = item.tags?.includes(tag.id)
                              ? item.tags.filter(id => id !== tag.id) // Remove tag if it exists
                              : [...(item.tags || []), tag.id]; // Add tag if it doesn't exist

                            return { ...item, tags: newTags }; // Update the tags of the matched item
                          }
                          return item; // Return unchanged items
                        });
                        await updateProductService(product.id, { generatedText: updatedStructure });
                        updateProduct(product?.id, { generatedText: updatedStructure });
                      }}
                      className="w-full px-3 py-1.5 text-sm text-left hover:bg-gray-50 flex items-center justify-between group transition-colors"
                    >
                      <span>{tag.name}</span>
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-colors ${
                          text.tags.includes(tag.id)
                            ? 'bg-current border-current'
                            : 'border-gray-300 group-hover:border-current'
                        }`}
                        style={{ color: tag.color }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
