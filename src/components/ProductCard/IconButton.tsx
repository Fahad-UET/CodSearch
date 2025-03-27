import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export function IconButton({ icon: Icon, label, onClick, className = '', disabled = false }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${className}`}
      title={label}
    >
      <Icon size={20} />
      <span className="text-xs font-medium whitespace-nowrap">{label}</span>
    </button>
  );
}