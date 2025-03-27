import React from 'react';
import { QUICK_ACTIONS } from '../constants';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

export function QuickActions({ onQuickAction }: QuickActionsProps) {
  return (
    <div className="mt-4 grid grid-cols-4 gap-3">
      {QUICK_ACTIONS.map((action, index) => (
        <button
          key={index}
          onClick={() => onQuickAction(action)}
          className="p-4 text-sm font-medium bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all transform hover:scale-105 active:scale-95 shadow-sm"
        >
          {action}
        </button>
      ))}
    </div>
  );
}