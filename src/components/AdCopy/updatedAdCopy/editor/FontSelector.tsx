import React, { useState } from 'react';
import { ChevronDown, Type } from 'lucide-react';

const FONTS = [
  { name: 'Arial', value: 'Arial' },
  { name: 'Times New Roman', value: 'Times New Roman' },
  { name: 'Helvetica', value: 'Helvetica' },
  { name: 'Courier New', value: 'Courier New' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Tahoma', value: 'Tahoma' },
  { name: 'Impact', value: 'Impact' },
];

interface Props {
  onSelect: (font: string) => void;
}

export default function FontSelector({ onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState(FONTS[0]);

  const handleSelect = (font: (typeof FONTS)[0]) => {
    setSelectedFont(font);
    onSelect(font.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 hover:border-[#5D1C83]/30 text-gray-700 hover:text-[#5D1C83] transition-all group relative z-50"
      >
        <Type className="w-4 h-4" />
        <span className="text-sm" style={{ fontFamily: selectedFont.value }}>
          {selectedFont.name}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#5D1C83]" />
      </button>

      {isOpen && (
        <div className="fixed top-auto left-auto mt-1 w-48 max-h-64 overflow-y-auto bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 py-1 z-[9999]">
          {FONTS.map(font => (
            <button
              key={font.value}
              onClick={() => handleSelect(font)}
              className="w-full px-4 py-2 text-sm text-left hover:bg-purple-50 hover:text-[#5D1C83] transition-colors"
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
