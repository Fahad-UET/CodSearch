interface ImportMetaEnv {
  readonly VITE_MAKE_WEBHOOK_URL: string;
  readonly VITE_MAKE_API_KEY: string;
  readonly VITE_FAL_KEY: string;
  readonly VITE_ELEVENLABS_API_KEY: string;
  readonly VITE_OPENAI_API_KEY: string;
}

export const env: ImportMetaEnv = {
  VITE_MAKE_WEBHOOK_URL: import.meta.env.VITE_MAKE_WEBHOOK_URL || '',
  VITE_MAKE_API_KEY: import.meta.env.VITE_MAKE_API_KEY || '',
  VITE_FAL_KEY: import.meta.env.VITE_FAL_KEY || '',
  VITE_ELEVENLABS_API_KEY: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  VITE_OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
};
