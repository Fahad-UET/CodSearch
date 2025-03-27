export const OCR_CONFIG = {
  apiKey: import.meta.env.VITE_VIDEO_DOWNLOADER_API_KEY,
  apiEndpoint: 'https://api.ocr.space/parse/image',
  defaultOptions: {
    language: 'eng',
    isOverlayRequired: true,
    detectOrientation: true,
    scale: true,
    isTable: false,
  },
} as const;