export type LipSyncModel = 'lipsync-1.8.0' | 'lipsync-1.7.1' | 'lipsync-1.9.0-beta';
export type SyncMode = 'cut_off' | 'loop' | 'bounce';

export interface LipSyncRequestOptions {
  model: LipSyncModel;
  video_url: string;
  audio_url: string;
  sync_mode: SyncMode;
}

export interface LipSyncResponse {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}
