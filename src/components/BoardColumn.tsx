import React, { useEffect, useState } from 'react';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import {
  GripHorizontal,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Maximize2,
} from 'lucide-react';
import { AddProductModal } from './AddProductModal';
import { useProductStore } from '../store';
import { createPortal } from 'react-dom';
import { FullscreenView } from './BoardColumn/FullscreenView';
import { CreateProductModal } from './CreateProductModal';

interface BoardColumnProps {
  id: string;
  title: string;
  products: Product[];
  index: number;
  boardId: string;
  board: any;
  role: string;
}

export function BoardColumn({
  id,
  title,
  products,
  index,
  boardId,
  board,
  role,
}: BoardColumnProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, updateList, deleteList, updateProduct } = useProductStore();
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id,
    data: {
      type: 'list',
      accepts: ['product'],
    },
  });

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: 'list',
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const handleUpdateTitle = async () => {
    // Allow spaces but prevent empty titles
    if (!editedTitle.trim()) {
      // comment this line line because setError doesn't exist
      // setError('List title cannot be empty');
      return;
    }

    if (editedTitle !== title) {
      await updateList(id, editedTitle);
    }
    setIsEditing(false);
  };

  const handleDeleteList = () => {
    setShowMenu(false);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    await deleteList(id);
    setShowDeleteDialog(false);
  };

  // Sort products by order
  const sortedProducts = [...products].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Create unique IDs for the sortable context
  const sortableIds = products.map(product => product.id);

  useEffect(() => {
    if (board.boardType === 'default') {
      setShowProductModal(true);
    }
  }, [board]);

  if (isFullscreen) {
    return createPortal(
      <FullscreenView
        title={title}
        products={products}
        onClose={() => setIsFullscreen(false)}
        onProductMove={async (productId, zone: 'priority' | 'normal' | 'backlog') => {
          await updateProduct(productId, { zone });
        }}
        listIndex={index}
      />,
      document.body
    );
  }
  return (
    <>
      {showAddModal && (
        <AddProductModal
          onClose={() => {
            setShowAddModal(false);
          }}
          listId={id}
          boardId={boardId}
          // comment this code as AddProductModal doesn't takes this props and not using it
          // products={products}
        />
      )}
      <div
        ref={setNodeRef}
        style={style}
        className="flex-shrink-0 w-96 board-column rounded-xl flex flex-col max-h-full"
      >
        <div className="p-4 border-b border-purple-100/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                className="cursor-grab active:cursor-grabbing text-primary-400 hover:text-primary-600"
                {...attributes}
                {...listeners}
              >
                <GripHorizontal size={20} />
              </button>
              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={e => setEditedTitle(e.target.value)}
                    className="w-full px-2 py-1 text-sm rounded border border-primary-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    placeholder="List title"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateTitle}
                      className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer z-50"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-primary-900">
                    {board.name === 'Workflow Manager' && title === 'To Test'
                      ? 'Qualify Product'
                      : title}
                  </h2>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="Fullscreen view"
              >
                <Maximize2 size={20} />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className={`p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors ${
                  role === 'editor' ? 'hidden' : ''
                }`}
                title="Add product to this list"
              >
                <Plus size={20} />
              </button>

              {board.boardType != 'default' && (
                <div className={`relative ${role === 'editor' ? 'hidden' : ''}`}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          setIsEditing(true);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit List
                      </button>
                      <button
                        onClick={handleDeleteList}
                        className={`w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${
                          role === 'owner' ? '' : 'hidden'
                        }`}
                      >
                        <Trash2 size={16} />
                        Delete List
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          ref={setDroppableRef}
          className={`flex-1 p-4 space-y-3 overflow-y-auto hide-scrollbar ${
            isOver && products.length === 0 ? 'bg-purple-50/50' : ''
          }`}
        >
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {sortedProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                listIndex={index}
                verticalIndex={idx}
                role={role}
              />
            ))}
          </SortableContext>

          {products.length === 0 && (
            <div
              className={`w-full h-full min-h-[200px] rounded-lg border-2 border-dashed ${
                isOver ? 'border-purple-400 bg-purple-50' : 'border-primary-200 bg-primary-50/50'
              } transition-colors flex items-center justify-center ${
                role === 'editor' ? 'hidden' : ''
              }`}
            >
              <button
                onClick={() => setShowAddModal(true)}
                className="text-primary-400 hover:text-primary-600 flex flex-col items-center gap-2"
              >
                <Plus size={24} />
                <span className="text-sm font-medium">Drop here or click to add</span>
              </button>
            </div>
          )}
        </div>

        {showDeleteDialog &&
          createPortal(
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-100 rounded-full">
                    <AlertCircle size={24} className="text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete List</h3>
                    <p className="text-gray-500 mb-6">
                      Are you sure you want to delete this list? All products in this list will be
                      moved to the first list. This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDeleteDialog(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Delete List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* {showProductModal && id === 'products' && products.length === 0 && (
          <CreateProductModal
            onClose={() => {
              setShowProductModal(false);
              setShowAddModal(true);
            }}
            listId={'products'}
            boardId={boardId}
          />
        )} */}
      </div>
    </>
  );
}
