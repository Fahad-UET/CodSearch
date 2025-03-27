import axios from 'axios';

const API_KEY = import.meta.env.VITE_VIDEO_DOWNLOADER_API_KEY;
const API_HOST = import.meta.env.VITE_VIDEO_DOWNLOADER_API_HOST;

export interface DownloadResponse {
  success: boolean;
  message?: string;
  data?: {
    url: string;
    title?: string;
    thumbnail?: string;
    duration?: string;
    quality?: string;
    size?: string;
  };
}

export async function downloadVideo(url: string): Promise<DownloadResponse> {
  try {
    const response = await axios.post(
      'https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink',
      { url },
      {
        headers: {
          'x-rapidapi-key': API_KEY,
          'x-rapidapi-host': API_HOST,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to download video');
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Download failed: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during download');
  }
}