import React from 'react';
import { Backpack, ArrowRight } from 'lucide-react';

interface SpecialKeysProps {
  onBackspace: () => void;
  onSpace: () => void;
  onEnter: () => void;
}

export function SpecialKeys({ onBackspace, onSpace, onEnter }: SpecialKeysProps) {
  return (
    <div className="flex justify-between mt-4 gap-3">
      <button
        onClick={onBackspace}
        className="px-6 py-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all transform hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center gap-2 flex-1"
      >
        {/* // to resolve build issue please check this */}
        {/* <Backspace size={20} /> */}
        <Backpack size={20} />
        <span className="font-medium">Backspace</span>
      </button>

      <button
        onClick={onSpace}
        className="px-6 py-4 bg-white text-gray-600 rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all transform hover:scale-105 active:scale-95 shadow-sm flex-grow-[3] font-medium border border-gray-100"
      >
        Space
      </button>

      <button
        onClick={onEnter}
        className="px-6 py-4 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all transform hover:scale-105 active:scale-95 shadow-sm flex items-center justify-center gap-2 flex-1"
      >
        <ArrowRight size={20} />
        <span className="font-medium">Enter</span>
      </button>
    </div>
  );
}