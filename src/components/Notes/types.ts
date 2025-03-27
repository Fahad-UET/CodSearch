export interface Note {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  categoryId: string;
}

export interface NoteCategory {
  id: string;
  name: string;
  color: string;
  count: number;
}

export const NOTE_COLORS = {
  purple: 'from-purple-500 to-indigo-500',
  pink: 'from-pink-500 to-rose-500',
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-500 to-orange-500',
  red: 'from-red-500 to-pink-500',
  indigo: 'from-indigo-500 to-violet-500',
  teal: 'from-teal-500 to-emerald-500',
  orange: 'from-orange-500 to-red-500',
  cyan: 'from-cyan-500 to-blue-500'
} as const;