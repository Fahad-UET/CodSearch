import React, { useState, useRef } from 'react';
import { Image } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

export const CardImage = ({ image, onSelect }: {image: any, onSelect?: any}) => {
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(image);
  };

  return (
    <div 
      className="relative group"
      onClick={handleImageClick}
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      <img
        src={image.url}
        alt={image.alt || 'Product'}
        className="w-full h-48 object-cover rounded-t-lg"
        draggable={false}
      />
      {image.tcpp && (
        <div className="absolute bottom-2 right-2 flex items-center gap-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          <Image size={12} />
          {/* <Tooltip content="Total cost per product">
            <span>TCPP: ${tcpp}</span>
          </Tooltip> */}
        </div>
      )}
    </div>
  );
};