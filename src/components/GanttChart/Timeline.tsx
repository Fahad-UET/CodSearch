import React from 'react';
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { TimelineConfig } from './types';
import { TIME_SCALES, HEADER_HEIGHT } from './constants';

interface TimelineProps {
  config: TimelineConfig;
}

const Timeline: React.FC<TimelineProps> = ({ config }) => {
  const { startDate, endDate, scale } = config;
  const { unit, format: dateFormat, width } = TIME_SCALES[scale];

  const getTimelineDates = () => {
    switch (scale) {
      case 'day':
        return eachDayOfInterval({ start: startDate, end: endDate });
      case 'week':
        return eachWeekOfInterval({ start: startDate, end: endDate });
      case 'month':
        return eachMonthOfInterval({ start: startDate, end: endDate });
      default:
        return [];
    }
  };

  const dates = getTimelineDates();

  return (
    <div 
      className="sticky top-0 z-10 bg-white border-b"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="flex">
        {dates.map((date, index) => (
          <div
            key={index}
            className="flex-none border-r text-center py-2 text-sm text-gray-600"
            style={{ width }}
          >
            {format(date, dateFormat)}
          </div>
        ))}
      </div>
    </div>
  );
};