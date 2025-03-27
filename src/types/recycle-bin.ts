export interface RecycleBinItem {
  id: string;
  type: 'board' | 'list' | 'card';
  data: any;
  deletedAt: Date;
  parentId?: string; // Board ID for lists and cards, List ID for cards
}

export interface RecycleBin {
  items: RecycleBinItem[];
  maxItems: number;
  retentionDays: number;
}