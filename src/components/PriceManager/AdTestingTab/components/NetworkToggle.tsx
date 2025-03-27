import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface NetworkToggleProps {
  network: string;
  isActive: boolean;
  onToggle: () => void;
  colors: {
    bg: string;
    text: string;
    border: string;
    hover: string;
  };
}

export function NetworkToggle({ network, isActive, onToggle, colors }: NetworkToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? `${colors.bg} ${colors.text} transform hover:scale-105`
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {isActive ? (
        <ToggleRight size={20} />
      ) : (
        <ToggleLeft size={20} />
      )}
      <span className="font-medium">
        {network}
      </span>
    </button>
  );
}