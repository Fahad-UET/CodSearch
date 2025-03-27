import { saveAs } from 'file-saver';
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Returns a fallback image URL if the original fails
 */
export const getFallbackImageUrl = (width = 400, height = 300): string => {
  return `https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=${width}&h=${height}&fit=crop`;
};

export const downloadImage = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    // Get full filename without query parameters but preserve _format=2500w if present
    let fileName = url.split('/').pop() || 'image';
    if (fileName.includes('?')) {
      // Keep _format=2500w if it exists, otherwise remove query params
      if (fileName.includes('_format=2500w')) {
        fileName = fileName.split('?')[0] + '?_format=2500w';
      } else {
        fileName = fileName.split('?')[0];
      }
    }
    saveAs(blob, fileName);
    return true;
  } catch (error) {
    console.error('Error downloading image:', error);
    return false;
  }
};