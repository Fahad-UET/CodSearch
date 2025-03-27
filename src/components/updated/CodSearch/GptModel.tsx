export const GPT_MODELS = [
  // Default and newest models first
  { id: 'gpt-4-0125-preview', name: 'GPT-4 Turbo (Latest)', tokens: 128000 },
  { id: 'gpt-4-0', name: 'GPT-4 Optimized', tokens: 128000 },
  { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo Preview', tokens: 128000 },
  { id: 'gpt-4-1106-preview', name: 'GPT-4 Turbo 1106', tokens: 128000 },
  { id: 'gpt-4-vision-preview', name: 'GPT-4 Vision', tokens: 128000 },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', tokens: 4096 },
  { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K', tokens: 16384 },

  // Legacy GPT-3.5 models
  { id: 'gpt-3.5-turbo-0613', name: 'GPT-3.5 Turbo 0613', tokens: 4096 },
  { id: 'gpt-3.5-turbo-16k-0613', name: 'GPT-3.5 Turbo 16K 0613', tokens: 16384 },

  // Legacy GPT-4 models
  { id: 'gpt-4', name: 'GPT-4', tokens: 8192 },
  { id: 'gpt-4-32k', name: 'GPT-4 32K', tokens: 32768 },
  { id: 'gpt-4-32k-0613', name: 'GPT-4 32K 0613', tokens: 32768 },
  { id: 'gpt-4-0613', name: 'GPT-4 0613', tokens: 8192 },
] as const;

export type GptModel = (typeof GPT_MODELS)[number]['id'];
