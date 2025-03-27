import React from 'react';
import { Image, Download } from 'lucide-react';
import { DownloadButton } from './DownloadButton';
import { downloadProductCSV } from '../../utils/csvExport';

interface ImageSectionProps {
  product: any;
  images: string[];
}

export function ImageSection({ product, images }: ImageSectionProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle download logic here
    console.warn('Download functionality to be implemented');
  };

  return (
    <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden group">
      {images.length > 0 ? (
        <>
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <DownloadButton onClick={() => downloadProductCSV(product)} />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <Image className="w-12 h-12 text-gray-400" />
        </div>
      )}
      
      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   bg-white/90 hover:bg-white p-2 rounded-full shadow-lg
                   transition-all duration-200 opacity-0 group-hover:opacity-100
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
        title="Download product data"
      >
        <Download className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}