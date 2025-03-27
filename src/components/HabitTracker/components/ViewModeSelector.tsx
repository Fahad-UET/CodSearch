import React from 'react';
import { Calendar, CalendarDays, CalendarRange, CalendarClock } from 'lucide-react';
import { ViewMode, Language } from '../types';

interface ViewModeSelectorProps {
  selectedMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  language: Language;
}

const VIEW_MODES = [
  { id: 'day', label: { en: 'Day', ar: 'اليوم' }, icon: Calendar },
  { id: 'week', label: { en: 'Week', ar: 'الأسبوع' }, icon: CalendarDays },
  { id: 'month', label: { en: 'Month', ar: 'الشهر' }, icon: CalendarRange },
  { id: 'year', label: { en: 'Year', ar: 'السنة' }, icon: CalendarClock },
] as const;

export function ViewModeSelector({
  selectedMode,
  onViewModeChange,
  language,
}: ViewModeSelectorProps) {
  return (
    <div className="flex gap-2">
      {VIEW_MODES.map(mode => {
        const Icon = mode.icon;
        return (
          <div
            key={mode.id}
            onClick={() => onViewModeChange(mode.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              selectedMode === mode.id
                ? 'bg-purple-100 text-purple-700'
                : 'bg-white hover:bg-gray-50 text-'
            }`}
          >
            <Icon size={16} />
            <span>{mode.label[language]}</span>
          </div>
        );
      })}
    </div>
  );
}
