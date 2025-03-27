import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  onClick: () => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg 
                 transition-all duration-200 hover:scale-110 group"
      title="Download CSV"
    >
      <Download 
        className="w-6 h-6 text-gray-700 group-hover:text-blue-600" 
      />
    </button>
  );
};