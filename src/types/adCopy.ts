export interface AdCopyTag {
  id: string;
  name: string;
  color: string;
}

export interface AdCopyVariant {
  id: string;
  description: string;
  createdAt: Date;
  tags: string[];
  rating?: number;
  number: number;
  isAIGenerated?: boolean;
  isExpanded?: boolean;
}

export const DEFAULT_TAGS: AdCopyTag[] = [
  { id: 'voiceover', name: 'Voice Over', color: '#FF0000' },
  { id: 'ad-copy', name: 'Ad Copy', color: '#00FF00' },
  { id: 'header', name: 'Header', color: '#0000FF' },
  { id: 'review', name: 'Customer Review', color: '#FF69B4' },
  { id: 'title', name: 'Title', color: '#FF00FF' },
  { id: 'subtitle', name: 'Subtitle', color: '#00FFFF' },
  { id: 'cta', name: 'CTA', color: '#800000' },
  { id: 'description', name: 'Description', color: '#808000' },
  { id: 'testimonial', name: 'Testimonial', color: '#008080' },
  { id: 'usp', name: 'USP', color: '#800080' },
  { id: 'banner', name: 'Notification Banner', color: '#FFA500' },
  { id: 'guarantee', name: 'Guarantee', color: '#A52A2A' },
  { id: 'social-proof', name: 'Social Proof', color: '#008000' },
  { id: 'benefits', name: 'Benefits', color: '#4B0082' },
  { id: 'faq', name: 'FAQ', color: '#F08080' },
  { id: 'offer', name: 'Offer', color: '#4682B4' }
];