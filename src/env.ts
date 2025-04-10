interface ImportMetaEnv {
  readonly VITE_MAKE_WEBHOOK_URL: string;
  readonly VITE_MAKE_API_KEY: string;
  readonly VITE_FAL_KEY: string;
  readonly VITE_ELEVENLABS_API_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_OPENAI_KEY: string;
  readonly VITE_OPENAI_URL: string;
  readonly VITE_DEEPSEEK_API_KEY: string;
  readonly VITE_VIDEO_DOWNLOADER_API_KEY: string;
  readonly VITE_VIDEO_DOWNLOADER_API_HOST: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
}

export const env: ImportMetaEnv = {
  VITE_MAKE_WEBHOOK_URL: import.meta.env.VITE_MAKE_WEBHOOK_URL || '',
  VITE_MAKE_API_KEY: import.meta.env.VITE_MAKE_API_KEY || '',
  VITE_FAL_KEY: import.meta.env.VITE_FAL_KEY || '',
  VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  VITE_OPENAI_KEY: import.meta.env.VITE_OPENAI_KEY || '',
  VITE_OPENAI_URL: import.meta.env.VITE_OPENAI_URL || '',
  VITE_DEEPSEEK_API_KEY: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  VITE_VIDEO_DOWNLOADER_API_KEY: import.meta.env.VITE_VIDEO_DOWNLOADER_API_KEY || '',
  VITE_VIDEO_DOWNLOADER_API_HOST: import.meta.env.VITE_VIDEO_DOWNLOADER_API_HOST || '',
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || '',
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  VITE_FIREBASE_SENDER_ID: import.meta.env.VITE_FIREBASE_SENDER_ID || '',
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || '',
  VITE_FIREBASE_MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};
