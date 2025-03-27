import React, { useState } from 'react';
import { ChevronDown, Type as FontSize } from 'lucide-react';

interface Props {
  isOpen: boolean;
  // to resolve build issue please check this
  // selectedSize: string;
  // handleSelect: (size: string) => void;
  selectedSize: { name: string; value: string; };
  handleSelect: (size: any) => void;
  setIsOpen: (size: boolean) => void;
}

export default function FontSizeSelector({ handleSelect, isOpen, setIsOpen, selectedSize }: Props) {
  // const [isOpen, setIsOpen] = useState(false);
  // const [selectedSize, setSelectedSize] = useState(SIZES[2]); // Normal by default

  // const handleSelect = (size: (typeof SIZES)[0]) => {
  //   setSelectedSize(size);
  //   onSelect(size.value);
  //   setIsOpen(false);
  // };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 hover:border-[#5D1C83]/30 text-gray-700 hover:text-[#5D1C83] transition-all group relative z-50"
      >
        <FontSize className="w-4 h-4" />
        {/* @ts-ignore */}
        <span className="text-sm min-w-[2rem]">{selectedSize.value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#5D1C83]" />
      </button>
    </div>
  );
}
