export function getEmbedUrl(url: string, platform: 'tiktok' | 'facebook'): string {
  try {
    const urlObj = new URL(url);

    if (platform === 'tiktok') {
      const videoId = urlObj.pathname.split('/').pop();
      return `https://www.tiktok.com/embed/${videoId}`;
    } else {
      const adId = urlObj.searchParams.get('id');
      return adId ? `https://www.facebook.com/ads/archive/render_ad/?id=${adId}` : url;
    }
  } catch {
    return url;
  }
}

export function getVideoType(url: string): 'facebook' | 'tiktok' | 'direct' {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('facebook.com')) return 'facebook';
    if (hostname.includes('tiktok.com')) return 'tiktok';
    return 'direct';
  } catch {
    return 'direct';
  }
}

export function isValidPlatformUrl(url: string, platform: 'tiktok' | 'facebook'): boolean {
  try {
    const urlObj = new URL(url);

    if (platform === 'tiktok') {
      return urlObj.hostname.includes('tiktok.com') && urlObj.pathname.includes('/video/');
    } else {
      return (
        urlObj.hostname.includes('facebook.com') &&
        urlObj.pathname.includes('/ads/library') &&
        urlObj.searchParams.has('id')
      );
    }
  } catch {
    return false;
  }
}
