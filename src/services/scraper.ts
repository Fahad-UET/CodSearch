import axios from 'axios';
import * as cheerio from 'cheerio';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export interface ScrapedImage {
  url: string;
  filename: string;
  alt?: string;
}

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://cors.bridged.cc/'
];

async function fetchWithCorsProxy(url: string): Promise<any> {
  let lastError;

  for (const proxy of CORS_PROXIES) {
    try {
      const response = await axios.get(proxy + encodeURIComponent(url), {
        timeout: 10000,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return response;
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  throw lastError;
}

export async function scrapeImagesFromUrl(url: string): Promise<ScrapedImage[]> {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format');
  }

  try {
    let response;
    try {
      response = await axios.get(url, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });
    } catch (error) {
      response = await fetchWithCorsProxy(url);
    }

    const $ = cheerio.load(response.data);
    const images: ScrapedImage[] = [];
    const seenUrls = new Set<string>();

    const processImageUrl = (imgUrl: string, imgAlt?: string) => {
      try {
        if (imgUrl.startsWith('data:')) return;
        
        const absoluteUrl = new URL(imgUrl, url).toString();
        
        if (seenUrls.has(absoluteUrl)) return;
        seenUrls.add(absoluteUrl);

        if (imgUrl.includes('icon') || imgUrl.includes('logo')) return;

        const urlParts = absoluteUrl.split('/');
        const originalFilename = urlParts[urlParts.length - 1]?.split('?')[0] || '';
        const extension = originalFilename.match(/\.(jpg|jpeg|png|gif|webp)$/i)?.[0] || '.jpg';
        const filename = `image-${images.length + 1}${extension}`;

        if (absoluteUrl.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i)) {
          images.push({
            url: absoluteUrl,
            filename,
            alt: imgAlt || originalFilename
          });
        }
      } catch (err) {
        console.warn('Skipped invalid image URL:', imgUrl);
      }
    };

    // Process regular img tags
    $('img').each((_, element) => {
      const imgUrl = $(element).attr('src');
      const imgAlt = $(element).attr('alt');
      if (imgUrl) processImageUrl(imgUrl, imgAlt);
    });

    // Process background images in style attributes
    $('[style*="background-image"]').each((_, element) => {
      const style = $(element).attr('style');
      const urlMatch = style?.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (urlMatch?.[1]) processImageUrl(urlMatch[1]);
    });

    // Process srcset attributes
    $('img[srcset]').each((_, element) => {
      const srcset = $(element).attr('srcset');
      if (!srcset) return;
      
      srcset.split(',').forEach(src => {
        const url = src.trim().split(' ')[0];
        if (url) processImageUrl(url);
      });
    });

    // Process Open Graph image meta tags
    $('meta[property="og:image"]').each((_, element) => {
      const imgUrl = $(element).attr('content');
      if (imgUrl) processImageUrl(imgUrl);
    });

    // Process data-src and data-original attributes (lazy loading)
    $('img[data-src], img[data-original]').each((_, element) => {
      const dataSrc = $(element).attr('data-src');
      const dataOriginal = $(element).attr('data-original');
      const imgAlt = $(element).attr('alt');
      
      if (dataSrc) processImageUrl(dataSrc, imgAlt);
      if (dataOriginal) processImageUrl(dataOriginal, imgAlt);
    });

    if (images.length === 0) {
      throw new Error('No valid images found on the page');
    }

    return JSON.parse(JSON.stringify(images));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out');
      }
      if (error.response?.status === 404) {
        throw new Error('Page not found');
      }
      if (error.response?.status === 403) {
        throw new Error('Access denied');
      }
      throw new Error(`Failed to access the page: ${error.message}`);
    }
    throw new Error('Failed to scrape images');
  }
}

export async function downloadImages(images: ScrapedImage[]): Promise<Blob> {
  if (images.length === 0) {
    throw new Error('No images to download');
  }

  const zip = new JSZip();
  const imageFolder = zip.folder('images');
  
  if (!imageFolder) {
    throw new Error('Failed to create zip folder');
  }

  const downloadPromises = images.map(async (image) => {
    try {
      const response = await axios.get(image.url, {
        responseType: 'arraybuffer',
        timeout: 10000,
        headers: {
          'Accept': 'image/*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      return {
        filename: image.filename,
        data: response.data
      };
    } catch (error) {
      console.error(`Failed to download ${image.url}:`, error);
      return null;
    }
  });

  const results = await Promise.all(downloadPromises);
  const successfulDownloads = results.filter((result): result is { filename: string; data: ArrayBuffer } => 
    result !== null
  );

  if (successfulDownloads.length === 0) {
    throw new Error('Failed to download any images');
  }

  successfulDownloads.forEach(({ filename, data }) => {
    imageFolder.file(filename, data, { binary: true });
  });

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  return zipBlob;
}

function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}