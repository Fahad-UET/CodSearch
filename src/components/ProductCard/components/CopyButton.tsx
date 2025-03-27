import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { CopyOptionsModal } from '../../CardCopy/CopyOptionsModal';
import { Product } from '../../../types';
import { createProduct } from '../../../services/firebase/products';
import { useCardRelationshipStore } from '../../../store/cardRelationshipStore';

interface CopyButtonProps {
  product: Product;
  className?: string;
}

export function CopyButton({ product, className = '' }: CopyButtonProps) {
  const [showCopyModal, setShowCopyModal] = useState(false);
  const { addRelationship } = useCardRelationshipStore();

  const handleCopy = async (options: any, makeChild: boolean) => {
    try {
      const copyData = {
        ...product,
        title: `${product.title} (Copy)`,
        id: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Create new product
      const newProduct = await createProduct({
        ...copyData,
        boardId: product.boardId,
        status: product.status
      });

      // If making child card, create relationship
      if (makeChild) {
        addRelationship({
          productId: newProduct.id, syncStatus: 'synced', inheritedFields: Object.keys(options).filter(key => options[key]),
          id: '',
          parentId: '',
          childIds: [],
          createdAt: undefined,
          updatedAt: undefined
        });
      }

      setShowCopyModal(false);
    } catch (error) {
      console.error('Failed to copy product:', error);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowCopyModal(true);
        }}
        className={`p-1.5 bg-white/90 text-gray-600 hover:text-gray-900 rounded-lg shadow-sm backdrop-blur-sm ${className}`}
        title="Copy product"
      >
        <Copy size={16} />
      </button>

      {showCopyModal && (
        <CopyOptionsModal
          onConfirm={handleCopy}
          onClose={() => setShowCopyModal(false)}
        />
      )}
    </>
  );
}