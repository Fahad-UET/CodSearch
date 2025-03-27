export interface Bookmark {
  id: string;
  productId: string;
  parentId: string | null;
  createdAt: Date;
}

export interface BookmarkCategory {
  id: string;
  name: string;
  parentId: string | null;
}

export interface BookmarksManagerProps {
  onCopy: (sourceId: string, targetId: string) => void;
  onRemove: (bookmarkId: string) => void;
  bookmarks: Bookmark[];
  categories: BookmarkCategory[];
}