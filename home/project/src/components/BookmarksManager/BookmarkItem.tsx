import { Copy, Trash2 } from 'lucide-react';
import type { Bookmark } from './types';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onCopy: (sourceId: string, targetId: string) => void;
  onRemove: (bookmarkId: string) => void;
}

export const BookmarkItem = ({ bookmark, onCopy, onRemove }: BookmarkItemProps) => {
  const handleCopy = () => {
    const targetId = prompt('Enter target product ID:');
    if (targetId) {
      onCopy(bookmark.productId, targetId);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow">
      <span className="text-sm text-gray-600">Product ID: {bookmark.productId}</span>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="p-1.5 text-gray-500 hover:text-blue-500 transition-colors"
          title="Copy to another product"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onRemove(bookmark.id)}
          className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
          title="Remove bookmark"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};