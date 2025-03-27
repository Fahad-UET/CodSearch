import React, { useState } from 'react';
import { Tag, Plus, Trash2, Edit2, Save, Check, Star, ArrowDown, ArrowUp, Copy, AlertCircle } from 'lucide-react';
import { AdCopyVariant, AdCopyTag, DEFAULT_TAGS } from '../../types/adCopy';
import { updateProduct as updateProductService } from '../../services/firebase';
import { useProductStore } from '../../store';
import { useVariableStore } from '../../store/variableStore';

interface NotesListProps {
  productId: string;
  product: any;
}

export function NotesList({ productId, product }: NotesListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<AdCopyVariant | null>(null);
  const [editingVariant, setEditingVariant] = useState<AdCopyVariant | null>(null);
  const [editText, setEditText] = useState('');
  const [tags] = useState<AdCopyTag[]>(DEFAULT_TAGS);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const updateProduct = useProductStore(state => state.updateProduct);
  const { replaceVariables } = useVariableStore();

  const variants = product?.adCopy || [];

  const sortedAndFilteredVariants = React.useMemo(() => {
    let filtered = selectedTag
      ? variants.filter(v => v.tags?.includes(selectedTag))
      : variants;

    return filtered.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return sortDirection === 'desc' ? ratingB - ratingA : ratingA - ratingB;
    });
  }, [variants, selectedTag, sortDirection]);

  const toggleExpand = (variantId: string) => {
    setExpandedVariants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(variantId)) {
        newSet.delete(variantId);
      } else {
        newSet.add(variantId);
      }
      return newSet;
    });
  };

  const handleEdit = (variant: AdCopyVariant) => {
    setEditingVariant(variant);
    setEditText(variant.description);
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingVariant || !productId || !editText.trim()) return;
    setError(null);
    setIsLoading(true);

    try {
      const updatedAdCopy = variants.map(v =>
        v.id === editingVariant.id ? { ...v, description: editText.trim() } : v
      );

      await updateProductService(productId, { adCopy: updatedAdCopy });
      await updateProduct(productId, { adCopy: updatedAdCopy });
      setEditingVariant(null);
      setEditText('');
    } catch (err) {
      setError('Failed to save changes');
      console.error('Failed to save edit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (variantId: string) => {
    if (!productId) return;
    setError(null);
    setIsLoading(true);

    try {
      const updatedAdCopy = variants.filter(v => v.id !== variantId);
      await updateProductService(productId, { adCopy: updatedAdCopy });
      await updateProduct(productId, { adCopy: updatedAdCopy });
    } catch (err) {
      setError('Failed to delete text');
      console.error('Failed to delete variant:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, variantId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(variantId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setError('Failed to copy text');
      console.error('Failed to copy text:', err);
    }
  };

  const handleRating = async (variant: AdCopyVariant, rating: number) => {
    if (!productId) return;
    setError(null);
    setIsLoading(true);

    try {
      const updatedAdCopy = variants.map(v =>
        v.id === variant.id ? { ...v, rating } : v
      );

      await updateProductService(productId, { adCopy: updatedAdCopy });
      await updateProduct(productId, { adCopy: updatedAdCopy });
    } catch (err) {
      setError('Failed to update rating');
      console.error('Failed to update rating:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagSelect = async (variant: AdCopyVariant, tagId: string) => {
    if (!productId) return;
    setError(null);
    setIsLoading(true);

    try {
      const currentTags = variant.tags || [];
      const newTags = currentTags.includes(tagId)
        ? currentTags.filter(t => t !== tagId)
        : [...currentTags, tagId];

      const updatedAdCopy = variants.map(v =>
        v.id === variant.id ? { ...v, tags: newTags } : v
      );

      await updateProductService(productId, { adCopy: updatedAdCopy });
      await updateProduct(productId, { adCopy: updatedAdCopy });
      setSelectedVariant(null);
    } catch (err) {
      setError('Failed to update tags');
      console.error('Failed to update tags:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTagStyles = (tag: AdCopyTag, isSelected: boolean): [string, React.CSSProperties] => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors";
    const style: React.CSSProperties = {};

    if (isSelected) {
      style.backgroundColor = `${tag.color}22`;
      style.color = tag.color;
      style.borderColor = tag.color;
    } else {
      style.backgroundColor = 'transparent';
      style.color = tag.color;
      style.border = `1px solid ${tag.color}22`;
    }

    return [baseClasses, style];
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Tags Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const [classes, style] = getTagStyles(tag, selectedTag === tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                className={classes}
                style={style}
                disabled={isLoading}
              >
                <Tag size={16} />
                {tag.name}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
          disabled={isLoading}
        >
          Sort by Rating
          {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </button>
      </div>

      {/* Variants Grid */}
      <div className="grid grid-cols-1 gap-4">
        {sortedAndFilteredVariants.map((variant: AdCopyVariant) => {
          const isExpanded = expandedVariants.has(variant.id);
          const isEditing = editingVariant?.id === variant.id;
          
          return (
            <div
              key={variant.id}
              className="bg-white p-4 rounded-xl border border-gray-200 hover:border-purple-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap gap-1">
                  {variant.tags?.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <span
                        key={tag.id}
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${tag.color}22`,
                          color: tag.color
                        }}
                      >
                        {tag.name}
                      </span>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(variant, star)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      disabled={isLoading}
                    >
                      <Star
                        size={16}
                        className={`${
                          variant.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full h-32 p-2 border rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
                      disabled={isLoading}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingVariant(null)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={`text-gray-900 ${isExpanded ? '' : 'line-clamp-3'}`} 
                       dangerouslySetInnerHTML={{ __html: replaceVariables(variant.description) }}>
                    </p>
                    {variant.description.length > 150 && (
                      <button
                        onClick={() => toggleExpand(variant.id)}
                        className="mt-2 text-sm text-purple-600 hover:text-purple-700"
                        disabled={isLoading}
                      >
                        {isExpanded ? (
                          <span className="flex items-center gap-1">
                            <ArrowUp size={14} />
                            Show Less
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <ArrowDown size={14} />
                            Read More
                          </span>
                        )}
                      </button>
                    )}
                  </>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(variant)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit text"
                      disabled={isLoading}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(variant.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete text"
                      disabled={isLoading}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => handleCopy(variant.description, variant.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Copy text"
                      disabled={isLoading}
                    >
                      {copiedId === variant.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedVariant(variant)}
                    className="text-purple-600 hover:text-purple-700 text-sm"
                    disabled={isLoading}
                  >
                    Manage Tags
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tag Selection Modal */}
      {selectedVariant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Select Tags</h3>
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {tags.map(tag => {
                const [classes, style] = getTagStyles(
                  tag,
                  selectedVariant.tags?.includes(tag.id) || false
                );
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagSelect(selectedVariant, tag.id)}
                    className={classes}
                    style={style}
                    disabled={isLoading}
                  >
                    <Tag size={16} />
                    {tag.name}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedVariant(null)}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                disabled={isLoading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}