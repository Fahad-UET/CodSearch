import React from 'react';
import { TimerMode } from '../types';

interface ModeSelectorProps {
  mode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex justify-center gap-2 bg-gradient-to-br from-purple-500/40 to-pink-500/40 p-2 rounded-xl">
      <button
        onClick={() => onModeChange('work')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          mode === 'work'
            ? 'bg-purple-500 text-white'
            : ' bg-gradient-to-br hover:from-purple-500/40 hoverto-pink-500/40 text-white'
        }`}
      >
        Work
      </button>
      <button
        onClick={() => onModeChange('shortBreak')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          mode === 'shortBreak'
            ? 'bg-purple-500 text-white'
            : ' bg-gradient-to-br hover:from-purple-500/40 hoverto-pink-500/40 text-white'
        }`}
      >
        Short Break
      </button>
      <button
        onClick={() => onModeChange('longBreak')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          mode === 'longBreak'
            ? 'bg-purple-500 text-white'
            : ' bg-gradient-to-br hover:from-purple-500/40 hoverto-pink-500/40 text-white'
        }`}
      >
        Long Break
      </button>
    </div>
  );
}
