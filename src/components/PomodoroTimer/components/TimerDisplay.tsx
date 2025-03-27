import React from 'react';
import { TimerMode } from '../types';

interface TimerDisplayProps {
  timeLeft: number;
  isRunning: boolean;
  mode: TimerMode;
  formatTime: (seconds: number) => string;
}

export function TimerDisplay({ timeLeft, isRunning, mode, formatTime }: TimerDisplayProps) {
  return (
    <div className="text-center">
      <div className="text-7xl font-bold  text-white -clip-text text-transparent mb-4 font-mono">
        {formatTime(timeLeft)}
      </div>
      <div className="text-lg font-medium text-white flex items-center justify-center gap-2">
        <div
          className={`w-3 h-3 rounded-full text-white ${
            isRunning ? 'bg-purple-500' : 'bg-gray-300'
          }`}
        />
        {mode === 'work' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
      </div>
    </div>
  );
}
