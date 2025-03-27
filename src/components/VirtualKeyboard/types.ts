export type Language = 'ar' | 'en' | 'fr' | 'es';

export interface VirtualKeyboardProps {
  onClose: () => void;
  className?: string;
}

export interface KeyMapping {
  [key: string]: string;
}

export interface NumberMapping {
  standard: string[];
  eastern: string[];
}