import { AdFormData, AdCreative } from '../../../../types';
import { mediaExtractor } from './platforms/media';
import { facebookExtractor } from './platforms/facebook';
import { tiktokExtractor } from './platforms/tiktok';

const extractors = {
  direct: mediaExtractor,
  facebook: facebookExtractor,
  tiktok: tiktokExtractor,
};

export async function extractCreative(data: AdFormData): Promise<AdCreative> {
  try {
    const id = Math.random().toString(36).substr(2, 9);
    const extractor = extractors[data.platform];

    if (!extractor) {
      throw new Error('Plateforme non supportée');
    }

    const mediaData = await extractor.extract(data.url);

    return {
      id,
      ...mediaData,
      platform: data.platform,
      originalUrl: data.url,
      rating: 0,
    };
  } catch {
    throw new Error("Impossible de charger le média. Vérifiez l'URL et réessayez.");
  }
}
