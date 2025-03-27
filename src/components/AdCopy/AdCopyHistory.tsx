import React from 'react';
import { Clock, Edit2, Trash2 } from 'lucide-react';
// to resolve build issue please check this
// import { AdCopyVariant } from './index';
import { AdCopyVariant } from '@/types';

interface AdCopyHistoryProps {
  variants: AdCopyVariant[];
  selectedVariant: AdCopyVariant | null;
  onSelect: (variant: AdCopyVariant) => void;
  onEdit: (variant: AdCopyVariant) => void;
  onDelete: (variantId: string) => void;
}

export function AdCopyHistory({ 
  variants, 
  selectedVariant, 
  onSelect,
  onEdit,
  onDelete
}: AdCopyHistoryProps) {
  return (
    <div className="bg-white rounded-xl border border-purple-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">History</h3>

      {variants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No ad copy variants generated yet
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map(variant => (
            <div
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={`w-full p-4 rounded-lg border-2 transition-all cursor-pointer group ${
                selectedVariant?.id === variant.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-100 hover:border-purple-200'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(variant);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Edit2 size={16} />
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(variant.id);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </div>
                </div>
              </div>

              <div className="text-left">
                <p className="font-medium text-gray-900 line-clamp-1">
                  {variant.headline}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {variant.description}
                </p>
              </div>

              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <Clock size={12} />
                <span>{variant.createdAt.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}