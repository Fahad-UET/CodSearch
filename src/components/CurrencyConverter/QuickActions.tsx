import React from 'react';
import { CircleDollarSign, Calculator, StickyNote, Key } from 'lucide-react';

interface QuickActionsProps {
  onOpenConverter: () => void;
  onOpenCalculator: () => void;
  onOpenNotes: () => void;
  onOpenTokenModal: () => void;
}

export function QuickActions({
  onOpenConverter,
  onOpenCalculator,
  onOpenNotes,
  onOpenTokenModal
}: QuickActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onOpenConverter}
        className="p-2 text-white hover:text-purple-200 hover:bg-purple-800 rounded-lg transition-colors"
        title="Currency Converter"
      >
        <CircleDollarSign size={22} />
      </button>

      <button
        onClick={onOpenCalculator}
        className="p-2 text-white hover:text-purple-200 hover:bg-purple-800 rounded-lg transition-colors"
        title="Open Calculator"
      >
        <Calculator size={22} />
      </button>

      <button
        onClick={onOpenNotes}
        className="p-2 text-white hover:text-purple-200 hover:bg-purple-800 rounded-lg transition-colors"
        title="Open Notes"
      >
        <StickyNote size={22} />
      </button>

      <button
        onClick={onOpenTokenModal}
        className="p-2 text-white hover:text-purple-200 hover:bg-purple-800 rounded-lg transition-colors"
        title="API Token Settings"
      >
        <Key size={22} />
      </button>
    </div>
  );
}