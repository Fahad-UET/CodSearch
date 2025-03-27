import { useState } from 'react';
import { BookmarksList } from './BookmarksList';
import { CategoryList } from './CategoryList';
import type { BookmarksManagerProps } from './types';

export const BookmarksManager = ({
  onCopy,
  onRemove,
  bookmarks,
  categories,
}: BookmarksManagerProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBookmarks = selectedCategory
    ? bookmarks.filter(b => b.parentId === selectedCategory)
    : bookmarks.filter(b => !b.parentId);

  return (
    <div className="flex gap-4">
      <CategoryList
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <BookmarksList
        bookmarks={filteredBookmarks}
        onCopy={onCopy}
        onRemove={onRemove}
      />
    </div>
  );
};