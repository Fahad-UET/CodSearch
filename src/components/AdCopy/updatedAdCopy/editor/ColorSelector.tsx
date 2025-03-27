import React, { useState } from 'react';
import { Palette } from 'lucide-react';

const COLORS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Rouge', value: '#FF0000' },
  { name: 'Bleu', value: '#0000FF' },
  { name: 'Vert', value: '#008000' },
  { name: 'Jaune', value: '#FFD700' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Violet', value: '#800080' },
  { name: 'Rose', value: '#FF69B4' },
  { name: 'Gris', value: '#808080' },
  { name: 'Marron', value: '#8B4513' },
];

interface Props {
  onSelect: (color: string) => void;
}

export default function ColorSelector({ onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSelect = (color: (typeof COLORS)[0]) => {
    setSelectedColor(color);
    onSelect(color.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 hover:border-[#5D1C83]/30 text-gray-700 hover:text-[#5D1C83] transition-all relative z-50"
      >
        <Palette className="w-4 h-4" />
        <div
          className="w-4 h-4 rounded-full border border-gray-200"
          style={{ backgroundColor: selectedColor.value }}
        />
      </button>

      {isOpen && (
        <div className="fixed top-auto left-auto mt-1 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-200 p-2 z-[9999]">
          <div className="grid grid-cols-5 gap-1">
            {COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => handleSelect(color)}
                className="w-8 h-8 rounded-lg border border-gray-200 hover:scale-110 transition-transform"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
