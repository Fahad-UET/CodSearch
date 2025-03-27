import React from 'react';
import { Copy, MoreVertical, Trash2, Edit, Link2 } from 'lucide-react';

interface CardMenuProps {
  onDuplicate: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export const CardMenu: React.FC<CardMenuProps> = ({
  onDuplicate,
  onEdit,
  onDelete,
  onShare
}) => {
  return (
    <div className="absolute top-2 right-2 flex items-center gap-2">
      <button
        onClick={onDuplicate}
        className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 group relative"
        aria-label="Dupliquer ce produit"
      >
        <Copy className="w-4 h-4 text-gray-600" />
        <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Dupliquer ce produit
        </span>
      </button>
      
      <div className="relative group">
        <button className="p-1.5 rounded-full hover:bg-gray-100">
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>
        
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <div className="py-1">
            <button
              onClick={onEdit}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
            <button
              onClick={onShare}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              Partager
            </button>
            <button
              onClick={onDelete}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};