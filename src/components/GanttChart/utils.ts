import { Task, TimelineConfig } from './types';
import { differenceInDays, min, max } from 'date-fns';
import { TIME_SCALES } from './constants';

export const calculateTaskPosition = (task: Task, config: TimelineConfig) => {
  const { scale } = config;
  const { width } = TIME_SCALES[scale];
  
  const daysFromStart = differenceInDays(task.startDate, config.startDate);
  const taskDuration = differenceInDays(task.endDate, task.startDate);
  
  return {
    left: daysFromStart * width,
    width: (taskDuration + 1) * width,
  };
};

export const getTimelineConfig = (tasks: Task[]): TimelineConfig => {
  const startDates = tasks.map(task => task.startDate);
  const endDates = tasks.map(task => task.endDate);
  
  return {
    startDate: min(startDates),
    endDate: max(endDates),
    scale: 'day',
    view: 'timeline'
  };
};