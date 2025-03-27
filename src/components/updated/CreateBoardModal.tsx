import React, { useState } from 'react';
import { Divide, X } from 'lucide-react';

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (name: string) => void;
  isEdit?: boolean;
  isDel?: boolean;
  editName?: string;
  setEditName?: any;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({
  isOpen,
  onClose,
  onCreateBoard,
  isEdit = false,
  isDel = false,
  editName = '',
  setEditName,
}) => {
  const [boardName, setBoardName] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit ? !editName.trim() : !boardName.trim()) {
      setError('Board name is required');
      return;
    }

    onCreateBoard(boardName.trim());
    setBoardName('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl w-full max-w-md 
        border border-white/10 shadow-xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white/90">
            {isEdit ? `Edit Board` : isDel ? `Delete Board` : `Create New Board`}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/90 transition-colors duration-200
              hover:bg-white/10 rounded-full p-2"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            {!isDel && (
              <>
                {' '}
                <label htmlFor="boardName" className="block text-sm font-medium text-white/60 mb-2">
                  Board Name
                </label>
                <input
                  type="text"
                  id="boardName"
                  value={isEdit ? editName : boardName}
                  onChange={e => {
                    isEdit ? setEditName(e.target.value) : setBoardName(e.target.value);
                    setError('');
                  }}
                  placeholder={!isEdit ? `Enter board name` : `Edit Board name`}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 
              text-white/90 placeholder:text-white/30 focus:outline-none 
              focus:border-purple-500/50 transition-colors duration-300"
                  autoFocus
                />
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              </>
            )}
            {isDel && <p className="text-red-400">The Board and its content will be deleted</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white/60 hover:text-white/90 transition-colors duration-200
                hover:bg-white/10 rounded-lg"
            >
              Cancel
            </button>
            {isDel ? (
              <button
                type="button"
                onClick={() => {
                  onCreateBoard(editName);
                  onClose();
                }}
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300
                rounded-lg transition-colors duration-300 border border-purple-500/30 
                hover:border-purple-500/50"
              >
                Delete Board
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300
                rounded-lg transition-colors duration-300 border border-purple-500/30 
                hover:border-purple-500/50"
              >
                {isEdit ? `Edit Board` : isDel ? `Delete Board` : `Create Board`}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
