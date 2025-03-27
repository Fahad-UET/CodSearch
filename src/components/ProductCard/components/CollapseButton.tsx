import React from 'react';
import { ArrowRight } from 'lucide-react';

interface CollapseButtonProps {
  isCollapsed: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export function CollapseButton({ isCollapsed, onClick }: CollapseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute -bottom-8 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full shadow-lg z-20 hover:shadow-xl transition-all"
    >
      <ArrowRight
        size={16}
        className={`text-gray-600 transform transition-transform duration-300 ${
          isCollapsed ? 'rotate-90' : '-rotate-90'
        }`}
      />
    </button>
  );
}