import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useProductStore } from '../store';
import {
  createBoard,
  getUserBoards,
  deleteBoard,
  updateBoard,
  updateProduct,
} from '../services/firebase';
import { Board } from '../types';

interface BoardSelectionMenuProps {
  productId: string;
  onClose: () => void;
}

export function BoardSelectionMenu({ productId, onClose }: BoardSelectionMenuProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>('');
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    user,
    board: currentBoard,
    updateProductStatus,
    updateProduct: updateProductStore,
  } = useProductStore();
  const currentProduct = useProductStore(state => state.products.find(p => p.id === productId));
  const currentList = currentBoard?.lists?.find(l => l.id === currentProduct?.status);

  useEffect(() => {
    const loadBoards = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const userBoards = await getUserBoards(user.uid, user.email);
        // Include default Workflow Manager board
        const defaultBoard = userBoards.find((b: any) => b?.boardType === 'default');
        const otherBoards = userBoards.filter((b: any) => b?.boardType !== 'default');

        // Put default board first in the list
        setBoards(defaultBoard ? [defaultBoard, ...otherBoards] : otherBoards);

        // If there's a current board, pre-select it
        // if (currentBoard) {
        //   setSelectedBoardId(currentBoard.id);
        // }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load boards');
      } finally {
        setIsLoading(false);
      }
    };

    loadBoards();
  }, [user, currentBoard]);

  const handleMove = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!selectedBoardId || !selectedListId) {
      setError('Please select both a board and a list');
      return;
    }

    setIsLoading(true);
    try {
      // Update product's board and list
      const updates = {
        boardId: selectedBoardId,
        status: selectedListId,
        updatedAt: new Date(),
      };

      // Update in Firebase
      await updateProduct(productId, updates);

      // Update in store
      await updateProductStore(productId, updates);

      // Update status in store
      await updateProductStatus(productId, selectedListId);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move product');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedBoard = boards.find(b => b.id === selectedBoardId);

  if (isLoading && boards.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading boards...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show all boards except current one
  const availableBoards = boards.filter(b => b.id !== currentProduct?.id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Move Product</h2>
          <div className="text-sm text-gray-500">
            Current Location: {currentBoard?.name} / {currentList?.title}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <X size={20} />
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Board Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Board</label>
            <select
              value={selectedBoardId}
              onChange={e => {
                setSelectedBoardId(e.target.value);
                setSelectedListId(''); // Reset list selection when board changes
              }}
              className="w-full h-10 pl-3 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
            >
              <option value="" className="text-gray-500">
                Choose a board...
              </option>
              {availableBoards.map(board => (
                <option key={board.id} value={board.id} className="text-gray-900">
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          {/* List Selection */}
          {selectedBoard && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select List</label>
              <select
                value={selectedListId}
                onChange={e => setSelectedListId(e.target.value)}
                className="w-full h-10 pl-3 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              >
                <option value="" className="text-gray-500">
                  Choose a list...
                </option>
                {selectedBoard.lists?.map(list => (
                  <option key={list.id} value={list.id} className="text-gray-900">
                    {list.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMove}
              disabled={!selectedBoardId || !selectedListId || isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              Move Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
