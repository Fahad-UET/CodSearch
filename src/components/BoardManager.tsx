import React, { useState, useEffect } from 'react';
import {
  Plus,
  Users,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  FolderOpen,
  LucideTrash,
  LucideEdit,
  LucideEdit2,
  LucideEdit3,
  LucideTrash2,
} from 'lucide-react';
import { useProductStore } from '../store';
import { createBoard, getUserBoards, deleteBoard, updateBoard } from '../services/firebase';
import { Board } from '../types';
import { useLanguageStore } from '../store/languageStore';
import BoardIcon from './updated/BoardIcon';
import CreateBoardModal from './updated/CreateBoardModal';
import { Tooltip } from './ui/Tooltip';

const parseDate = (date: string | number | undefined | null) => {
  if (!date) return new Date().toLocaleDateString();
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime())
    ? new Date().toLocaleDateString()
    : parsedDate.toLocaleDateString();
};

const BoardCard: React.FC<{
  board: Board;
  handleSelectBoard: any;
  handleIsEdit: any;
  setIsCreateModalOpen: any;
  handleIsDelete: any;
  setBoardId: any;
  setEditName: any;
}> = ({
  board,
  handleSelectBoard,
  handleIsEdit,
  setIsCreateModalOpen,
  handleIsDelete,
  setBoardId,
  setEditName,
}) => {
  const { user } = useProductStore();
  const [role, setRole] = useState('editor');
  const [ownerEmail, setOwnerEmail] = useState('');
  useEffect(() => {
    if (board?.members && board.members?.length > 0) {
      const userRole = board.members.find((member: any) => member?.email === user?.email)?.role;
      setRole(userRole);
      const ownerMail = board.members.find((member: any) => member.role === 'owner')?.email;
      setOwnerEmail(ownerMail);
    }
  }, [board, board.id]);
  return (
    <div
      className="group relative bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8 rounded-2xl 
    transition-all duration-300 hover:shadow-[0_0_40px_rgba(167,139,250,0.2)]
    backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20
    hover:scale-[1.02]
    border border-white/10 hover:border-purple-500/30 cursor-pointer"
      onClick={() => handleSelectBoard(board)}
    >
      {/* Icons container - initially hidden */}

      <div className="absolute right-3 top-3 flex justify-end gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {board?.boardType != 'default' && (
          <>
            <LucideEdit
              className={`hover:scale-[1.2] cursor-pointer ${role === 'editor' ? 'hidden' : ''}`}
              color="grey"
              onClick={e => {
                handleIsEdit(e);
                setBoardId(board.id);
                setIsCreateModalOpen(true);
                setEditName(board.name);
              }}
            />
            <LucideTrash2
              className={`hover:scale-[1.2] cursor-pointer ${role === 'owner' ? '' : 'hidden'}`}
              color="grey"
              onClick={e => {
                setBoardId(board?.id);
                handleIsDelete(e);
                setIsCreateModalOpen(true);
              }}
            />
          </>
        )}
      </div>
      <div className="">
        {board.name === 'Workflow Manager' && role !== 'owner' && (
          <div className="absolute right-3 top-3 gap-3 flex justify-center items-center font-bold text-white text-xl capitalize rounded-full w-12 h-12 border border-white/10 hover:border-purple-500/30 text-center">
            {ownerEmail?.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <div
          className="text-white/90 transform transition-transform duration-700 
        group-hover:text-white bg-gradient-to-br from-white/10 to-white/5 p-4 rounded-xl
        group-hover:bg-gradient-to-br group-hover:from-purple-500/20 group-hover:to-pink-500/20
        border border-white/10 group-hover:border-purple-500/30"
        >
          <BoardIcon size={32} />
        </div>
        <h3
          className="text-white/90 font-medium text-lg sm:text-xl text-center tracking-wide
        transform transition-all duration-500 group-hover:text-white"
        >
          {board.name}
        </h3>
        <div className="text-white/40 text-sm">{parseDate(board.createdAt)}</div>
      </div>
    </div>
  );
};

export function BoardManager() {
  const { setProducts } = useProductStore();
  const [boards, setBoards] = useState<Board[]>([]);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [boardId, setBoardId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { user, setBoard } = useProductStore();
  const { t, language } = useLanguageStore();
  const [isDel, setIsDel] = useState(false);
  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user]);

  const loadBoards = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const userBoards = await getUserBoards(user?.uid, user?.email);
      setBoards(userBoards);
    } catch (err) {
      setError('Failed to load boards');
    } finally {
      setIsLoading(false);
    }
  };
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const handleCreateBoard = async (name: any) => {
    if (!user?.uid || !name) {
      setError('Please enter a board name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newBoard = await createBoard(user.uid, name);
      if (newBoard) {
        setBoards(prev => [...prev, newBoard]);
      }
      setNewBoardName('');
    } catch (err) {
      console.error('Failed to create board:', err);
      setError(err instanceof Error ? err.message : 'Failed to create board');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIsDelete = (e: React.FormEvent) => {
    e.stopPropagation();
    setIsDel(true);
  };

  const handleIsEdit = (e: React.FormEvent) => {
    e.stopPropagation();
    setIsEdit(true);
  };

  const handleDeleteBoard = async () => {
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

  const handleUpdateBoard = async () => {
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

  const handleSelectBoard = (selectedBoard: Board) => {
    if (setBoard) {
      setProducts(selectedBoard.products || []);
      setBoard(selectedBoard);
    }
  };
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      {/* <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {t('myBoards')}
        </h1>
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">{error}</div>} */}

      {/* Create Board Form */}
      {/* <form onSubmit={handleCreateBoard} className="flex gap-3">
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
      </form> */}

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map(board => (
          <BoardCard
            key={board.id}
            board={board}
            handleSelectBoard={handleSelectBoard}
            handleIsEdit={handleIsEdit}
            handleIsDelete={handleIsDelete}
            setIsCreateModalOpen={setIsCreateModalOpen}
            setBoardId={setBoardId}
            setEditName={setEditName}
          />
        ))}
        <div
          onClick={() => {
            setIsCreateModalOpen(true);
          }}
          className="group relative bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8 rounded-2xl 
              transition-all duration-300 hover:shadow-[0_0_40px_rgba(167,139,250,0.2)]
              backdrop-blur-xl hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-pink-500/20
              hover:scale-[1.02] border border-dashed border-white/20 hover:border-purple-500/30 
              cursor-pointer flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="text-white/60 transform transition-transform duration-300 
                group-hover:text-white group-hover:scale-110"
            >
              <Plus size={32} />
            </div>
            <h3
              className="text-white/60 font-medium text-lg sm:text-xl text-center tracking-wide
                transform transition-all duration-300 group-hover:text-white"
            >
              New Board
            </h3>
          </div>
        </div>
      </div>
      <CreateBoardModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsEdit(false);
          setIsDel(false);
          setEditName('');
          setBoard('');
          setIsCreateModalOpen(false);
        }}
        onCreateBoard={isEdit ? handleUpdateBoard : isDel ? handleDeleteBoard : handleCreateBoard}
        isEdit={isEdit}
        isDel={isDel}
        editName={editName}
        setEditName={setEditName}
      />
    </div>
  );
}

{
  /* <div
key={board.id}
className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 overflow-hidden hover:bg-white/10 transition-colors"
>
{editingBoard === board.id ? (
  <div className="p-4">
    <input
      type="text"
      value={editName}
      onChange={e => setEditName(e.target.value)}
      className="w-full rounded-lg border-gray-300 mb-2"
      autoFocus
    />
    <div className="flex justify-end gap-2">
      <button
        onClick={() => handleUpdateBoard(board.id)}
        className="p-2 text-green-400 hover:text-green-500"
      >
        <Check size={20} />
      </button>
      <button
        onClick={() => setEditingBoard(null)}
        className="p-2 text-gray-400 hover:text-gray-500"
      >
        <AlertCircle size={20} />
      </button>
    </div>
  </div>
) : (
  <div className="p-4">
    <div className="flex justify-between items-start">
      <button
        onClick={() => handleSelectBoard(board)}
        className="text-lg font-medium text-white hover:text-purple-300"
      >
        {board.name}
      </button>

      <div className="flex items-center gap-2">
        <button
          className="p-2 text-blue-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
          onClick={() => handleSelectBoard(board)}
        >
          <FolderOpen color="white" size={20} />
        </button>
        {board.boardType != 'default' && (
          <button
            onClick={() => {
              setEditingBoard(board.id);
              setEditName(board.name);
            }}
            className="p-2 text-blue-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
          >
            <Edit2 size={20} />
          </button>
        )}
        {board.boardType != 'default' && (
          <button
            onClick={() => handleDeleteBoard(board.id)}
            className="p-2 text-red-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  </div>
)}
</div> */
}
