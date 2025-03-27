import { FileType } from './types';

export const FILE_TYPE_COLORS: Record<FileType, string> = {
  typescript: '#3178c6',
  javascript: '#f7df1e',
  css: '#264de4',
  html: '#e34c26',
  json: '#292929',
  markdown: '#083fa1',
  other: '#718096'
};

export const DEFAULT_TIMELINE_CONFIG = {
  view: 'timeline' as const,
  // to resolve build issue please check this
  // scale: 'day' as const,
  scale: 'day',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
};

export const DRAG_THRESHOLD = 5;
export const MIN_TASK_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds
export const TASK_HEIGHT = 40;
export const HEADER_HEIGHT = 60;
  //These are to remove errors in future if there is any error solve this
export const TIME_SCALES = {scale: 120}
export const ROW_HEIGHT = 120