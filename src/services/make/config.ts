import { env } from '../../env';

export const MAKE_CONFIG = {
  webhookUrl: 'https://hook.eu2.make.com/ymtkrd9y2khaj3xce36lwj6jzdqi0870',
  apiKey: import.meta.env.VITE_MAKE_API_KEY || '',
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_MAKE_API_KEY || ''}`
  }
};