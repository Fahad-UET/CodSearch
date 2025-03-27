import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface NavDropdownProps {
  icon: React.ReactNode;
  label: string;
  count: string | number;
  items: Array<{ label: string; count: string; value: string }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isActive?: boolean;
  adCopy?: boolean;
  aiText?: boolean;
  aiVoiceOver?: boolean;
}

export default function NavDropdown({
  icon,
  label,
  count,
  items,
  isActive = false,
  activeTab,
  setActiveTab,
  adCopy,
  aiText,
  aiVoiceOver,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => {
          adCopy && setActiveTab('adcopy');
          aiText && setActiveTab('aiText');
          aiVoiceOver && setActiveTab('customerReviews');
        }}
        className={`flex items-center space-x-2.5 px-4 py-2 transition-all duration-200 flex-1 justify-center ${
          isActive
            ? 'text-indigo-600 bg-white shadow-sm'
            : 'text-white/90 hover:text-white hover:bg-white/10'
        }`}
      >
        <span className="w-5 h-5">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
        <span
          className={`px-2 text-sm rounded-full ${
            isActive ? 'bg-indigo-600 text-white' : 'bg-white/10 text-white'
          }`}
        >
          {count}
        </span>
        {items?.length > 1 && (
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </button>

      {isOpen && items?.length > 1 && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-md shadow-lg py-1 border border-white/10">
          {items.map(item => (
            <button
              onClick={() => {
                setActiveTab(item.value);
                setIsOpen(false);
              }}
              key={item.label}
              className={`flex items-center justify-between w-full px-3 py-1.5 ${
                activeTab !== item.value
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'bg-white text-black'
              } `}
            >
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-sm bg-white/10 text-white px-2 rounded-full">{item.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
