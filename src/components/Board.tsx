import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { BoardColumn } from './BoardColumn';
import { ProductCard } from './ProductCard';
import { Plus, Share2, ArrowLeft, GanttChart } from 'lucide-react';
import { useProductStore } from '../store';
import { Product, SharePermissions } from '../types';
import { ShareBoardModal } from './ShareBoardModal';
import { updateBoard, updateProduct } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export function Board() {
  const {
    products,
    lists,
    board,
    updateProductStatus,
    addList,
    reorderLists,
    setBoard,
    reorderProducts,
    updateBoardStore,
    user,
  } = useProductStore();

  const navigate = useNavigate();
  const [view, setView] = useState('board');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState('viewer');
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleCreateList = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoader(true);
      if (!newListTitle.trim()) return;

      const newList = {
        id: `list-${Date.now()}`,
        title: newListTitle.trim(),
        order: lists.length,
        canDelete: false,
      };
      const updatedList = [...lists, newList];
      const updatedListFromService = await updateBoard(board?.id, { lists: updatedList });
      if (!updatedListFromService) {
        throw new Error('Error while updating list');
      }

      addList(newList);
      setNewListTitle('');
      setShowNewListForm(false);
      setLoader(false);
    } catch (err) {
      console.error('Error while updating list');
      setLoader(false);
    } finally {
      setLoader(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedProduct = products.find(p => p.id === active.id);
    if (draggedProduct) {
      setActiveProduct(draggedProduct);
    }
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeContainer = findContainer(activeId.toString());
    const overContainer = findContainer(overId.toString());

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      const activeProduct = products.find(p => p.id === activeId);
      if (activeProduct) {
        const targetListProducts = products
          .filter(p => p.status === overContainer)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        const newOrder =
          targetListProducts.length > 0
            ? Math.max(...targetListProducts.map(p => p.order || 0)) + 1
            : 0;

        updateProductStatus(activeProduct.id, overContainer, newOrder);
        await updateProduct(activeProduct.id, { status: overContainer, order: newOrder })
          .then(updatedProduct => {
          })
          .catch(error => {
            console.error('Failed to update product:', error);
          });

        const [updatedProducts] = products.map(product =>
          product.id === activeProduct.id
            ? { ...product, status: overContainer, order: newOrder ?? product.order }
            : product
        );
        updateProduct(updatedProducts?.id, updatedProducts);
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    try {
      const { active, over } = event;
      const activeId = active.id;
      const activeProduct = products.find(p => p.id === activeId);

      if (!over) {
        setActiveProduct(null);
        return;
      }

      const activeContainer = findContainer(active.id.toString());
      const overContainer = findContainer(over.id.toString());

      if (activeContainer && overContainer) {
        if (active.data.current?.type === 'list' && over.data.current?.type === 'list') {
          const oldIndex = lists.findIndex(list => list.id === active.id);
          const newIndex = lists.findIndex(list => list.id === over.id);

          if (oldIndex !== newIndex) {
            const newLists = arrayMove(lists, oldIndex, newIndex);
            const updatedListFromService = updateBoard(board?.id, { lists: newLists });
            reorderLists(newLists);
            if (!updatedListFromService) {
              throw new Error('Error while updating lists');
            }
          }
        } else if (activeContainer === overContainer) {
          const activeIndex = products
            .filter(p => p.status === activeContainer)
            .findIndex(p => p.id === active.id);
          const overIndex = products
            .filter(p => p.status === overContainer)
            .findIndex(p => p.id === over.id);

          if (activeIndex !== overIndex) {
            const listProducts = products
              .filter(p => p.status === activeContainer)
              .sort((a, b) => (a.order || 0) - (b.order || 0));

            // const reorderedProducts = arrayMove(listProducts, activeIndex, overIndex);

            function customArrayMoveWithOrder(list, activeIndex, overIndex) {
              // Make a copy of the list to avoid mutating the original array
              const updatedList = [...list];

              // Remove the item at the activeIndex and store it
              const [movedItem] = updatedList.splice(activeIndex, 1);

              // Insert the moved item at the overIndex
              updatedList.splice(overIndex, 0, movedItem);

              // Update the `order` property of each item based on its new position
              updatedList.forEach((item, index) => {
                item.order = index + 1; // Set the order as index + 1
              });

              return updatedList;
            }

            const reorderedProducts = customArrayMoveWithOrder(
              listProducts,
              activeIndex,
              overIndex
            );
            const getUpdatedProduct = reorderedProducts?.find(product => product.id === activeId);
            await updateProduct(activeProduct.id, { order: getUpdatedProduct.order })
              .then(updatedProduct => {
              })
              .catch(error => {
                console.error('Failed to update product:', error);
              });
            // const updatedBoard = await updateBoard(board?.id, { products: reorderedProducts });
            const reorderedProduct = reorderProducts(activeContainer, reorderedProducts);
          }
        }
      }

      setActiveProduct(null);
    } catch (e) {
      console.error('Error while updating product status', e);
    }
  };

  const findContainer = (id: string | null) => {
    if (!id) return null;

    const list = lists.find(l => l.id === id);
    if (list) return id;

    const product = products.find(p => p.id === id);
    return product?.status || null;
  };

  const handleCloseBoard = () => {
    setBoard(null);
  };

  const handleShare = async (email: { email: string }, permissions: SharePermissions) => {
    if (!board) return;

    try {
      const updatedMembers = [
        ...(board.members || []),
        {
          email: email.email,
          role: permissions.access,
          permissions,
          joinedAt: new Date(),
        },
      ];

      const boardsMember = [...board?.boardMembers, email.email];

      const updatedBoard = {
        ...board,
        members: updatedMembers,
        boardMembers: boardsMember,
      };

      await updateBoard(board.id, { members: updatedMembers, boardMembers: boardsMember });
      updateBoardStore(updatedBoard);
    } catch (error) {
      console.error('Error sharing board:', error);
      throw error;
    }
  };
  useEffect(() => {
    if (board?.members && board.members?.length > 0) {
      const userRole = board.members.find((member: any) => member.email === user.email)?.role;
      setRole(userRole);
    }
  }, [board, board.id]);
  if (!board) return null;

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.code === 'Space') {
  //       event.preventDefault();
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyDown);

  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleCloseBoard}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white">{board.name}</h1>
          <button
            onClick={() => navigate('/gantt')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm text-sm font-medium"
          >
            <GanttChart className="w-4 h-4 mr-2" />
            Gantt View
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewListForm(true)}
            className={`px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 ${
              role === 'editor' ? 'hidden' : ''
            }`}
          >
            <Plus size={20} />
            New List
          </button>
          <button
            onClick={() => {
              setShowShareModal(true);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-2 cursor-pointer "
          >
            <Share2 size={20} />
            Share Board
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-500/10 text-red-500 rounded-lg">{error}</div>}

      {/* Lists Container */}
      <div className="flex gap-6 overflow-x-auto p-6 min-h-[calc(100vh-200px)]">
        <SortableContext
          items={lists.map(list => list.id)}
          strategy={horizontalListSortingStrategy}
        >
          {lists.map((list, index) => (
            <BoardColumn
              boardId={board.id}
              key={list.id}
              id={list.id}
              title={list.title}
              products={products.filter(p => p.status === list.id && p.boardId === board.id)}
              index={index}
              board={board}
              role={role}
            />
          ))}
        </SortableContext>
      </div>

      <DragOverlay>
        {activeProduct && <ProductCard product={activeProduct} listIndex={0} />}
      </DragOverlay>

      {/* New List Form Modal */}
      {showNewListForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">List Title</label>
                <input
                  type="text"
                  value={newListTitle}
                  onChange={e => setNewListTitle(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="Enter list title"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewListForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loader}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                >
                  {loader ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    'Create List'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showShareModal && (
        <ShareBoardModal
          boardId={board.id}
          boardName={board.name}
          lists={lists}
          products={products}
          members={board.members || []}
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
          onUpdateRole={async (email, role) => {
            const updatedMembers =
              board.members?.map(member =>
                member.email === email ? { ...member, role } : member
              ) || [];
            await updateBoard(board.id, { members: updatedMembers });
            updateBoardStore({ ...board, members: updatedMembers });
          }}
          onRemoveMember={async email => {
            const updatedMembers = board.members?.filter(member => member.email !== email) || [];
            await updateBoard(board.id, { members: updatedMembers });
            updateBoardStore({ ...board, members: updatedMembers });
          }}
        />
      )}
    </DndContext>
  );
}
