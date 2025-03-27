import React from 'react';
import { Edit, Trash2, Copy } from 'lucide-react';

interface ImageOverlayButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const ImageOverlayButtons: React.FC<ImageOverlayButtonsProps> = ({
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const buttons = [
    { icon: <Edit size={16} />, onClick: onEdit, title: 'Edit' },
    { icon: <Trash2 size={16} />, onClick: onDelete, title: 'Delete' },
    { icon: <Copy size={16} />, onClick: onDuplicate, title: 'Duplicate' },
  ].filter(button => button.onClick); // Ne garde que les boutons avec des handlers

  return (
    <div 
      className="absolute top-2 right-2 flex gap-2 opacity-0 invisible 
                 group-hover:opacity-100 group-hover:visible 
                 transition-all duration-300 ease-out z-10"
    >
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={e => {
            e.stopPropagation();
            button.onClick?.();
          }}
          title={button.title}
          className="p-2 rounded-full bg-white shadow-lg 
                     text-gray-700 hover:text-gray-900
                     hover:scale-110 active:scale-95
                     transition-all duration-200
                     hover:bg-gray-100"
          aria-label={button.title}
        >
          {button.icon}
        </button>
      ))}
    </div>
  );
};