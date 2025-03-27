export const validateApiKey = (key: string, type?: string): boolean => {
  switch (type) {
    case 'openai':
      return /^sk-[a-zA-Z0-9]{32,}$/.test(key);
    case 'apify':
      return /^apify_api_[a-zA-Z0-9]{32,}$/.test(key);
    case 'rapidapi':
      return key.length >= 32;
    case 'facebook':
      return key.length >= 32;
    case 'codnetwork':
      return key.length >= 32;
    default:
      return true;
  }
};

export const maskApiKey = (key: string): string => {
  if (!key) return '';
  if (key.length <= 8) return '*'.repeat(key.length);
  return `${key.slice(0, 4)}${'*'.repeat(key.length - 8)}${key.slice(-4)}`;
};