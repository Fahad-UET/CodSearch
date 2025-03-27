import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { GanttChartProps, Task } from './types';

export const GanttChart: React.FC<GanttChartProps> = ({ tasks, onTaskUpdate, onTaskSelect }) => {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [tasks]);

  const timelineStart = useMemo(() => {
    return tasks.length > 0
      ? new Date(Math.min(...tasks.map(task => task.startDate.getTime())))
      : new Date();
  }, [tasks]);

  const timelineEnd = useMemo(() => {
    return tasks.length > 0
      ? new Date(Math.max(...tasks.map(task => task.endDate.getTime())))
      : new Date();
  }, [tasks]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="grid grid-cols-[200px_1fr] border-b border-gray-200">
          <div className="p-4 font-medium text-gray-700 bg-gray-50">Task</div>
          <div className="p-4 font-medium text-gray-700 bg-gray-50">Timeline</div>
        </div>
        
        {sortedTasks.map(task => (
          <div
            key={task.id}
            className="grid grid-cols-[200px_1fr] border-b border-gray-200 hover:bg-gray-50"
            onClick={() => onTaskSelect?.(task.id)}
          >
            <div className="p-4">
              <div className="font-medium text-gray-900">{task.title}</div>
              <div className="text-sm text-gray-500">
                {format(task.startDate, 'MMM d')} - {format(task.endDate, 'MMM d')}
              </div>
            </div>
            <div className="p-4 relative">
              <div className="h-6 bg-blue-100 rounded-full relative">
                <div
                  className="absolute h-full bg-blue-500 rounded-full"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};