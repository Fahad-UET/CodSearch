import { VideoExtractor } from '../../../../../types';

export const facebookExtractor: VideoExtractor = {
  async extract(url: string) {
    return {
      type: 'video',
      url,
      embedUrl: false,
    };
  },
};
