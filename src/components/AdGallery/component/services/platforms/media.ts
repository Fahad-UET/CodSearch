import { VideoExtractor } from '../../../../../types';

export const mediaExtractor: VideoExtractor = {
  async extract(url: string) {
    return {
      type: url.toLowerCase().endsWith('.gif') ? 'gif' : 'image',
      url,
      embedUrl: false,
    };
  },
};
