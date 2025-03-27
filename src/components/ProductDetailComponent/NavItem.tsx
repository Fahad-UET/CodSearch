import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  count: string;
  isActive?: boolean;
  value: string;
  handleActiveTab: (value: string) => void;
}

export default function NavItem({
  icon,
  label,
  count,
  isActive = false,
  value,
  handleActiveTab,
}: NavItemProps) {
  return (
    <button
      className={`flex items-center space-x-2.5 px-4 py-2 transition-all duration-200 flex-1 justify-center ${
        isActive
          ? 'text-indigo-600 bg-white shadow-sm'
          : 'text-white/90 hover:text-white hover:bg-white/10'
      }`}
      onClick={() => handleActiveTab(value)}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`px-2 text-sm rounded-full ${
          isActive ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
