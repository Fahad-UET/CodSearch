import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { useProductStore } from '../store';
import { createBoard, getUserBoards, deleteBoard, updateBoard } from '../services/firebase';

interface BoardSelectorProps {
  onClose: () => void;
}

export function BoardSelector({ onClose }: BoardSelectorProps) {
  const [boards, setBoards] = useState<any[]>([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, setBoard } = useProductStore();

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userBoards = await getUserBoards(user?.uid, user.email);
      // change this line because getUserBoards also needs user.email
      // const userBoards = await getUserBoards(user.uid);
      setBoards(userBoards);
    } catch (err) {
      setError('Failed to load boards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newBoardName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const newBoard = await createBoard(user.uid, newBoardName.trim());
      setBoards([...boards, newBoard]);
      setNewBoardName('');
      setBoard(newBoard);
      onClose();
    } catch (err) {
      setError('Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteBoard(boardId);
      setBoards(boards.filter(b => b.id !== boardId));
    } catch (err) {
      setError('Failed to delete board');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBoard = async (boardId: string) => {
    if (!user || !editName.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await updateBoard(boardId, { name: editName.trim() });
      setBoards(boards.map(b => (b.id === boardId ? { ...b, name: editName.trim() } : b)));
      setEditingBoard(null);
    } catch (err) {
      setError('Failed to update board');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBoard = async (board: any) => {
    setBoard(board);
    localStorage.setItem('currentBoardId', board.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">My Boards</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Create New Board */}
          <form onSubmit={handleCreateBoard} className="flex gap-3">
            <input
              type="text"
              value={newBoardName}
              onChange={e => setNewBoardName(e.target.value)}
              placeholder="Enter board name"
              className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
            <button
              type="submit"
              disabled={isLoading || !newBoardName.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Plus size={20} />
              Create Board
            </button>
          </form>

          {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

          {/* Board List */}
          <div className="space-y-3">
            {boards.map(board => (
              <div
                key={board.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {editingBoard === board.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateBoard(board.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => setEditingBoard(null)}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleSelectBoard(board)}
                      className="flex-1 text-left font-medium text-gray-900 hover:text-purple-600"
                    >
                      {board.name}
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBoard(board.id);
                          setEditName(board.name);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteBoard(board.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {boards.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                No boards yet. Create your first board to get started!
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
