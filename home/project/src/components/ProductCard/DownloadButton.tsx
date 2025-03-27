import React from 'react';
import { Download } from 'lucide-react';
import { exportProductToCSV } from '../../utils/csvExport';

interface DownloadButtonProps {
  product: any;
}

export function DownloadButton({ product }: DownloadButtonProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    exportProductToCSV(product);
  };

  return (
    <button
      onClick={handleDownload}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg
                 transition-all duration-200 opacity-0 group-hover:opacity-100"
      title="Download product data as CSV"
    >
      <Download className="w-5 h-5 text-gray-700" />
    </button>
  );
}