import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconButtonProps {
  value: any;
  label: string;
  className?: string;
}

export function IconButtonCard({ value: value, label, className = '' }: IconButtonProps) {
  return (
    <button
      className={`group relative flex flex-col items-center justify-center w-[60px] p-1 rounded-xl 
    bg-white/90 shadow-[0_4px_10px_rgba(79,70,229,0.1)] border border-purple-100/50
    hover:shadow-[0_12px_24px_rgba(79,70,229,0.2)] hover:border-purple-200
    hover:bg-white active:transform active:scale-95 transition-all duration-300
    hover:-translate-y-1 hover:z-10 ${className}`}
    >
      <div className="flex flex-col items-center gap-0.5 transform transition-transform duration-300">
        <span className="text-[14px] font-semibold text-purple-700/80 group-hover:text-purple-800">
          {value}
        </span>
        <span className="text-[10px] font-medium text-purple-700/80 group-hover:text-purple-800">
          {label}
        </span>
      </div>
    </button>
  );
}
