import React, { useState, useRef } from 'react';
import { Image } from 'lucide-react';
import { DownloadButton } from './DownloadButton';

interface ImageSectionProps {
  product: any;
  images: string[];
}

export function ImageSection({ product, images }: ImageSectionProps) {
  return (
    <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden group">
      {images.length > 0 ? (
        <img
          src={images[0]}
          alt={`Product ${product.title}`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Image className="w-12 h-12 text-gray-400" />
        </div>
      )}
      <DownloadButton product={product} />
    </div>
  );
}