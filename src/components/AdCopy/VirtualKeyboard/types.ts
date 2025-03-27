import { LucideIcon } from 'lucide-react';

export interface TextVariable {
  id: string;
  name: string;
  value: string;
  icon: LucideIcon;
}

export interface KeyboardLayout {
  [key: string]: string[][];
}