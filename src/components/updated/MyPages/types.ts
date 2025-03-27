export interface AdCreative {
  id: string;
  url: string;
  originalUrl: string;
  platform: 'tiktok' | 'facebook' | 'direct';
  type: 'video' | 'image';
  thumbnailUrl?: string;
  embedUrl?: boolean;
}

export interface AdFormData {
  url: string;
  platform: 'tiktok' | 'facebook' | 'direct';
}
