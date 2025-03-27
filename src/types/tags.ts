export interface Tag {
  id: string;
  name: string;
  color: string;
}

export const TAG_COLORS = {
  'voice-over-creative': '#3498db',
  'voice-over-review': '#2ecc71',
  'ad-copy': '#9b59b6',
  'customer-review': '#e67e22',
  'landing-page': '#e74c3c',
  title: '#3498db',
  description: '#9b59b6',
} as const;

export const DEFAULT_TAGS: Tag[] = [
  {
    id: 'voice-over-creative',
    name: 'Voice Over Creative',
    color: TAG_COLORS['voice-over-creative'],
  },
  { id: 'voice-over-review', name: 'Voice Over Review', color: TAG_COLORS['voice-over-review'] },
  { id: 'ad-copy', name: 'Ad Copy', color: TAG_COLORS['ad-copy'] },
  { id: 'customer-review', name: 'Customer Review', color: TAG_COLORS['customer-review'] },
  { id: 'landing-page', name: 'Landing Page', color: TAG_COLORS['landing-page'] },
  { id: 'title', name: 'Title', color: TAG_COLORS['title'] },
  { id: 'description', name: 'Description', color: TAG_COLORS['description'] },
];
