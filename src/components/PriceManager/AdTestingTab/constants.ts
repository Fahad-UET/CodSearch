export const NETWORK_COLORS = {
  TikTok: {
    bg: 'bg-[#000000]',
    text: 'text-white',
    border: 'border-gray-800',
    hover: 'hover:bg-gray-900',
    fill: '#000000'
  },
  Facebook: {
    bg: 'bg-[#1877F2]',
    text: 'text-white', 
    border: 'border-blue-700',
    hover: 'hover:bg-blue-700',
    fill: '#1877F2'
  },
  Snapchat: {
    bg: 'bg-[#FFFC00]',
    text: 'text-black',
    border: 'border-yellow-500',
    hover: 'hover:bg-yellow-500',
    fill: '#FFFC00'
  },
  Google: {
    bg: 'bg-[#DB4437]',
    text: 'text-white',
    border: 'border-red-600',
    hover: 'hover:opacity-90',
    fill: '#DB4437'
  },
  'Native Ads': {
    bg: 'bg-[#34A853]',
    text: 'text-white',
    border: 'border-green-700',
    hover: 'hover:bg-green-700',
    fill: '#34A853'
  },
  Other: {
    bg: 'bg-[#6B7280]',
    text: 'text-white',
    border: 'border-gray-700',
    hover: 'hover:bg-gray-700',
    fill: '#6B7280'
  }
} as const;

export const NETWORKS = Object.keys(NETWORK_COLORS);

export const DEFAULT_NETWORK_METRICS = {
  cpm: 0,
  cpc: 0,
  ctr: 0,
  budget: 0,
  impressions: 0,
  clicks: 0,
  leads: 0
};