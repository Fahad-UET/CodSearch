import { PenLine, MessageSquare, Layout, Mic, Video } from 'lucide-react';

export const TABS = [
  {
    id: 'ad-copy',
    label: 'Ad Copy',
    icon: PenLine,
    tagId: 'ad-copy',
    bgColor: '!from-[#6C3483] !to-[#8E44AD]', // Dark purple gradient
    textColor: 'text-white', // White text for contrast
    borderColor: 'border-[#6C3483]/20', // Slightly lighter border
  },
  {
    id: 'customer-reviews',
    label: 'Customer Reviews',
    icon: MessageSquare,
    tagId: 'customer-review',
    bgColor: '!from-[#E67E22] !to-[#D35400]', // Dark orange gradient
    textColor: 'text-white', // White text for better readability
    borderColor: 'border-[#E67E22]/20', // Match the orange gradient
  },
  {
    id: 'landing-page',
    label: 'Landing Page Text',
    icon: Layout,
    tagId: 'landing-page',
    bgColor: '!from-[#C0392B] !to-[#E74C3C]', // Dark red gradient
    textColor: 'text-white', // White text for high contrast
    borderColor: 'border-[#C0392B]/20', // Use a border tone from the gradient
  },
  {
    id: 'review-voice',
    label: 'Review Voice',
    icon: Mic,
    tagId: 'voice-over-review',
    bgColor: '!from-[#27AE60] !to-[#2ECC71]', // Dark green gradient
    textColor: 'text-white', // White text for better visibility
    borderColor: 'border-[#27AE60]/20', // Complementary green border
  },
  {
    id: 'creative-voice',
    label: 'Creative Voice',
    icon: Video,
    tagId: 'voice-over-creative',
    bgColor: '!from-[#2980B9] !to-[#3498DB]', // Blue gradient (unchanged)
    textColor: 'text-white',
    borderColor: 'border-[#2980B9]/20',
  },
];

export const VoiceTabs = [
  {
    id: 'customerReviews',
    label: 'Review Voice',
    icon: Mic,
    tagId: 'voice-over-review',
    bgColor: '!from-[#27AE60] !to-[#2ECC71]', // Dark green gradient
    textColor: 'text-white', // White text for better visibility
    borderColor: 'border-[#27AE60]/20', // Complementary green border
  },
  {
    id: 'creatives',
    label: 'Creative Voice',
    icon: Video,
    tagId: 'voice-over-creative',
    bgColor: '!from-[#2980B9] !to-[#3498DB]', // Blue gradient (unchanged)
    textColor: 'text-white',
    borderColor: 'border-[#2980B9]/20',
  },
];

export const TABS_Voice = [
  {
    id: 'customerReviews',
    label: 'Customer Reviews',
    icon: PenLine,
    tagId: 'review-voice',
    bgColor: '!from-[#6C3483] !to-[#8E44AD]', // Dark purple gradient
    textColor: 'text-white', // White text for contrast
    borderColor: 'border-[#6C3483]/20', // Slightly lighter border
  },
  {
    id: 'creatives',
    label: 'Creatives',
    icon: MessageSquare,
    tagId: 'creative-voice',
    bgColor: '!from-[#E67E22] !to-[#D35400]', // Dark orange gradient
    textColor: 'text-white', // White text for better readability
    borderColor: 'border-[#E67E22]/20', // Match the orange gradient
  },
];

export const MAX_GENERATIONS = 3;

export const GPT_MODELS = [
  // Default and newest models first
  { id: 'gpt-4o-2024-08-06', name: 'gpt-4o', tokens: 128000 },
  { id: 'gpt-4o-mini-2024-07-18', name: 'gpt-4o-mini', tokens: 128000 },
  { id: 'o1-2024-12-17', name: 'o1', tokens: 128000 },
  { id: 'o1-mini', name: 'o1-mini-2024-09-12', tokens: 128000 },
] as const;

export type GptModel = (typeof GPT_MODELS)[number]['id'];

export const PROMPT_TEMPLATES = {
  'ad-copy': 'Ad Copy Prompt Template',
  'customer-reviews': 'Customer Reviews Prompt Template',
  'landing-page': 'Landing Page Text Prompt Template',
  'review-voice': 'Review Voice Prompt Template',
  'creative-voice': 'Creative Voice Prompt Template',
};

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  hasDialect: boolean;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'ar', name: 'العربية', flag: '🇸🇦', hasDialect: true },
  { code: 'fr', name: 'Français', flag: '🇫🇷', hasDialect: true },
  { code: 'es', name: 'Español', flag: '🇪🇸', hasDialect: true },
  { code: 'en', name: 'English', flag: '🇺🇸', hasDialect: true },
  { code: 'pt', name: 'Português', flag: '🇵🇹', hasDialect: true },
];
