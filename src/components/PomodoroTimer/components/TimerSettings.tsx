import React from 'react';
import { X } from 'lucide-react';
import { TimerSettings as TimerSettingsType } from '../types';

interface TimerSettingsProps {
  settings: TimerSettingsType;
  onSettingsChange: (settings: TimerSettingsType) => void;
  onClose: () => void;
}

export function TimerSettings({ settings, onSettingsChange, onClose }: TimerSettingsProps) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Timer Settings</h3>
        <button onClick={onClose} className="text-white hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Work Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.workDuration}
            onChange={e =>
              onSettingsChange({
                ...settings,
                workDuration: parseInt(e.target.value),
              })
            }
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Short Break Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={settings.shortBreakDuration}
            onChange={e =>
              onSettingsChange({
                ...settings,
                shortBreakDuration: parseInt(e.target.value),
              })
            }
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Long Break Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.longBreakDuration}
            onChange={e =>
              onSettingsChange({
                ...settings,
                longBreakDuration: parseInt(e.target.value),
              })
            }
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>

        <div className="space-y-3 pt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.autoStartBreaks}
              onChange={e =>
                onSettingsChange({
                  ...settings,
                  autoStartBreaks: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-white">Auto-start breaks</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.autoStartPomodoros}
              onChange={e =>
                onSettingsChange({
                  ...settings,
                  autoStartPomodoros: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-white">Auto-start pomodoros</span>
          </label>
        </div>
      </div>
    </div>
  );
}
