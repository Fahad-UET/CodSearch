import React, { useState } from 'react';
import { X, FolderPlus, Plus } from 'lucide-react';
import type { KeywordFolder } from '../CodSearch/keywords';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import { useProductStore } from '@/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  keyword: string | null;
  language: string;
}

export default function SaveKeywordModal({ isOpen, onClose, keyword, language }: Props) {
  const [folders, setFolders] = useState<KeywordFolder[]>(() => {
    const saved = localStorage.getItem('keyword_folders');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [notes, setNotes] = useState('');
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  // Load folders on mount and parse dates
  React.useEffect(() => {
    const loadFolders = () => {
      const saved = localStorage.getItem('keyword_folders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Convert date strings to Date objects
          const processed = parsed.map((folder: KeywordFolder) => ({
            ...folder,
            createdAt: new Date(folder.createdAt),
            keywords: folder.keywords.map(keyword => ({
              ...keyword,
              createdAt: new Date(keyword.createdAt),
            })),
          }));
          setFolders(processed);
        } catch (error) {
          console.error('Error loading saved keywords:', error);
          setFolders([]);
        }
      }
    };

    loadFolders();
    // Listen for storage changes
    window.addEventListener('storage', loadFolders);
    return () => window.removeEventListener('storage', loadFolders);
  }, []);
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: KeywordFolder = {
      id: crypto.randomUUID(),
      name: newFolderName.trim(),
      description: newFolderDescription.trim() || undefined,
      createdAt: new Date(),
      keywords: [],
    };

    setFolders(prev => {
      const updated = [...prev, newFolder];
      localStorage.setItem('keyword_folders', JSON.stringify(updated));
      return updated;
    });

    setSelectedFolder(newFolder.id);
    setShowNewFolder(false);
    setNewFolderName('');
    setNewFolderDescription('');
  };

  const handleSave = async () => {
    if (!keyword || !selectedFolder) return;
    const credits = await getCredits(user?.uid, 'saveKeyword');
    if (!credits) {
      return;
    }

    const folder = folders.find(f => f.id === selectedFolder);
    if (!folder) return;

    const newKeyword = {
      id: crypto.randomUUID(),
      text: keyword,
      folderId: selectedFolder,
      createdAt: new Date(),
      language,
      notes: notes.trim() || undefined,
    };

    const updatedFolders = folders.map(f => {
      if (f.id === selectedFolder) {
        return {
          ...f,
          keywords: [...f.keywords, newKeyword],
        };
      }
      return f;
    });
    const result = await updateCredits(user?.uid, 'saveKeyword');
    setPackage(userPackage.plan, result.toString());
    localStorage.setItem('keyword_folders', JSON.stringify(updatedFolders));
    setFolders(updatedFolders);
    onClose();
  };

  if (!isOpen || !keyword) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Save Keyword</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Keyword Preview */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-sm text-purple-600 font-medium mb-1">Keyword</div>
            <div className="text-gray-900">{keyword}</div>
          </div>

          {/* Folder Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Folder</label>
            {showNewFolder ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                />
                <textarea
                  value={newFolderDescription}
                  onChange={e => setNewFolderDescription(e.target.value)}
                  placeholder="Enter folder description (optional)..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] h-20 resize-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreateFolder}
                    disabled={!newFolderName.trim()}
                    className="flex-1 px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Create Folder
                  </button>
                  <button
                    onClick={() => setShowNewFolder(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <select
                  value={selectedFolder}
                  onChange={e => setSelectedFolder(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                >
                  <option value="">Select a folder...</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name} ({folder.keywords.length})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewFolder(true)}
                  className="flex items-center gap-2 px-4 py-2 text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-colors text-sm"
                >
                  <FolderPlus className="w-4 h-4" />
                  Create New Folder
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any notes about this keyword..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] h-24 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedFolder}
            className="px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Save Keyword
          </button>
        </div>
      </div>
    </div>
  );
}
