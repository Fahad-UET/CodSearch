import React from 'react';
import { Task, TimelineConfig } from './types';
import { ROW_HEIGHT } from './constants';
import { calculateTaskPosition } from './utils';

interface TaskBarProps {
  task: Task;
  index: number;
  timelineConfig: TimelineConfig;
  onDragStart: (taskId: string, start: Date, end: Date) => void;
  onDrag: (taskId: string, newStart: Date, newEnd: Date) => void;
  onDragEnd: () => void;
  onClick: () => void;
}

const TaskBar: React.FC<TaskBarProps> = ({
  task,
  index,
  timelineConfig,
  onDragStart,
  onDrag,
  onDragEnd,
  onClick,
}) => {
  const { left, width } = calculateTaskPosition(task, timelineConfig);

  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${left}px`,
        top: index * ROW_HEIGHT,
        width: `${width}px`,
        height: ROW_HEIGHT - 8,
      }}
      onClick={onClick}
    >
      <div
        className="h-full rounded-md group-hover:ring-2 group-hover:ring-blue-500 relative"
        style={{ backgroundColor: task.fileType.color }}
      >
        <div className="absolute inset-0 flex items-center px-2">
          <span className="text-sm text-white truncate">{task.title}</span>
        </div>
        <div
          className="absolute top-0 right-0 bottom-0 bg-black bg-opacity-20"
          style={{ width: `${100 - task.progress}%` }}
        />
      </div>
    </div>
  );
};