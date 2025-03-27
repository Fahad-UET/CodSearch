import { VideoExtractor } from '../../../../../types';

export const tiktokExtractor: VideoExtractor = {
  async extract(url: string) {
    return {
      type: 'video',
      url,
      embedUrl: false,
    };
  },
};
