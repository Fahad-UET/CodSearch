import { BookmarkItem } from './BookmarkItem';
import type { Bookmark } from './types';

interface BookmarksListProps {
  bookmarks: Bookmark[];
  onCopy: (sourceId: string, targetId: string) => void;
  onRemove: (bookmarkId: string) => void;
}

export const BookmarksList = ({ bookmarks, onCopy, onRemove }: BookmarksListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {bookmarks.map(bookmark => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onCopy={onCopy}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};