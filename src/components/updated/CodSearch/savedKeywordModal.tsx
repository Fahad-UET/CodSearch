import React, { useState } from 'react';
import { X, FolderOpen, Search, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { KeywordFolder } from '../CodSearch/keywords';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (keyword: string) => void;
}

export default function SavedKeywordsModal({ isOpen, onClose, onSelect }: Props) {
  const [folders, setFolders] = useState<KeywordFolder[]>(() => {
    const saved = localStorage.getItem('keyword_folders');
    return saved ? JSON.parse(saved) : [];
  });
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

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

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    if (confirm('Are you sure you want to delete this folder and all its keywords?')) {
      setFolders(prev => {
        const updated = prev.filter(folder => folder.id !== folderId);
        localStorage.setItem('keyword_folders', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleDeleteKeyword = (folderId: string, keywordId: string) => {
    setFolders(prev => {
      const updated = prev.map(folder => {
        if (folder.id === folderId) {
          return {
            ...folder,
            keywords: folder.keywords.filter(keyword => keyword.id !== keywordId),
          };
        }
        return folder;
      });
      localStorage.setItem('keyword_folders', JSON.stringify(updated));
      return updated;
    });
  };

  const handleEditFolder = (folder: KeywordFolder) => {
    setEditingFolder(folder.id);
    setEditName(folder.name);
    setEditDescription(folder.description || '');
  };

  const saveEditedFolder = () => {
    if (!editingFolder || !editName.trim()) return;

    setFolders(prev => {
      const updated = prev.map(folder => {
        if (folder.id === editingFolder) {
          return {
            ...folder,
            name: editName.trim(),
            description: editDescription.trim() || undefined,
          };
        }
        return folder;
      });
      localStorage.setItem('keyword_folders', JSON.stringify(updated));
      return updated;
    });

    setEditingFolder(null);
    setEditName('');
    setEditDescription('');
  };

  const filteredFolders = folders
    .map(folder => ({
      ...folder,
      keywords: folder.keywords.filter(
        keyword =>
          keyword.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (keyword.notes && keyword.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    }))
    .filter(
      folder =>
        folder.keywords.length > 0 ||
        folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (folder.description && folder.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-6 h-6 text-[#5D1C83]" />
            <h2 className="text-xl font-semibold text-gray-900">Saved Keywords</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search keywords..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
            />
          </div>
        </div>

        {/* Folders List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {folders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No saved keywords yet. Save some keywords to get started!
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No keywords match your search.</div>
          ) : (
            filteredFolders.map(folder => (
              <div
                key={folder.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
              >
                {/* Folder Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50">
                  {editingFolder === folder.id ? (
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                        placeholder="Folder name..."
                      />
                      <input
                        type="text"
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
                        placeholder="Description (optional)..."
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={saveEditedFolder}
                          disabled={!editName.trim()}
                          className="px-3 py-1.5 bg-[#5D1C83] text-white rounded-lg hover:bg-[#4D0C73] disabled:opacity-50 text-sm"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingFolder(null)}
                          className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center gap-2">
                          {folder.name}
                          <span className="text-sm text-gray-500">({folder.keywords.length})</span>
                        </h3>
                        {folder.description && (
                          <p className="text-sm text-gray-500 mt-1">{folder.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditFolder(folder)}
                          className="p-1.5 text-gray-400 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFolder(folder.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleFolder(folder.id)}
                          className="p-1.5 text-gray-400 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-colors"
                        >
                          {expandedFolders.has(folder.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Keywords List */}
                {expandedFolders.has(folder.id) && (
                  <div className="divide-y divide-gray-100">
                    {folder.keywords.map(keyword => (
                      <div
                        key={keyword.id}
                        className="p-4 hover:bg-gray-50 flex items-center justify-between group"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{keyword.text}</div>
                          {keyword.notes && (
                            <p className="text-sm text-gray-500 mt-1">{keyword.notes}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                              {new Date(keyword.createdAt).toLocaleDateString()}
                            </span>
                            <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-600 rounded-full">
                              {keyword.language.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onSelect(keyword.text)}
                            className="px-3 py-1.5 text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-colors text-sm"
                          >
                            Use Keyword
                          </button>
                          <button
                            onClick={() => handleDeleteKeyword(folder.id, keyword.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
