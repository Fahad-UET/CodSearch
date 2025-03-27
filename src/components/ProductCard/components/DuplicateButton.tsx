import React from 'react';
import { Copy } from 'lucide-react';

interface DuplicateButtonProps {
  onDuplicate: () => void;
  className?: string;
}

export const DuplicateButton: React.FC<DuplicateButtonProps> = ({ 
  onDuplicate,
  className = ''
}) => {
  return (
    <button
      onClick={onDuplicate}
      className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 group relative ${className}`}
      aria-label="Dupliquer ce produit"
    >
      <Copy className="w-4 h-4 text-gray-600" />
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Dupliquer ce produit
      </span>
    </button>
  );
};