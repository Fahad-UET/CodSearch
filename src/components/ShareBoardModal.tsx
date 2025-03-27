import React, { useState } from 'react';
import {
  X,
  Users,
  Shield,
  Eye,
  Check,
  AlertCircle,
  Settings,
  ChevronDown,
  List,
  LayoutGrid,
  ChevronRight,
} from 'lucide-react';
import { Board, BoardMember, SharePermissions, List as ListType, Product } from '../types';
import { useProductStore } from '../store';

interface ShareBoardModalProps {
  boardId: string;
  boardName: string;
  lists: ListType[];
  products: Product[];
  members?: BoardMember[];
  onClose: () => void;
  onShare: (email: { email: string }, permissions: SharePermissions) => Promise<void>;
  onUpdateRole?: (userId: string, role: string) => Promise<void>;
  onRemoveMember?: (userId: string) => Promise<void>;
}

interface ListSharingOption {
  listId: string;
  shareType: 'all' | 'selected' | 'empty';
  selectedCards: string[];
}

const getMemberKey = (member: BoardMember) => {
  const joinedAtString = member.joinedAt ? member.joinedAt.toString() : '';
  return `${member.email}-${member.role}-${joinedAtString}`;
};

export function ShareBoardModal({
  boardId,
  boardName,
  lists,
  products,
  members = [],
  onClose,
  onShare,
  onUpdateRole,
  onRemoveMember,
}: ShareBoardModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLists, setSelectedLists] = useState<ListSharingOption[]>([]);
  const [accessLevel, setAccessLevel] = useState<'editor' | 'admin'>('editor');
  const [expandedLists, setExpandedLists] = useState<Set<string>>(new Set());

  const { user } = useProductStore();
  const isOwner = members.find(m => m.email === user?.email)?.role === 'owner';

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // if (selectedLists.length === 0) {
    //   setError('Please select at least one list to share');
    //   return;
    // }

    setIsLoading(true);
    setError(null);

    try {
      // Build permissions object based on selected lists and cards
      // const permissions: SharePermissions = {
      //   type: 'lists',
      //   access: accessLevel,
      //   lists: selectedLists.map(l => l.listId),
      //   cards: selectedLists.reduce((acc, list) => {
      //     if (list.shareType === 'all') {
      //       return [...acc, ...products.filter(p => p.status === list.listId).map(p => p.id)];
      //     }
      //     if (list.shareType === 'selected') {
      //       return [...acc, ...list.selectedCards];
      //     }
      //     return acc;
      //   }, [] as string[])
      // };
      const permissions: SharePermissions = {
        type: 'lists',
        access: accessLevel,
        lists: lists.map(l => l.id),
        cards: products.map(p => p.id),
      };
      await onShare({ email: email.trim() }, permissions);
      setEmail('');
      setSelectedLists([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share board');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListSelection = (listId: string) => {
    setSelectedLists(prev => {
      const isSelected = prev.some(l => l.listId === listId);
      if (isSelected) {
        return prev.filter(l => l.listId !== listId);
      }
      return [...prev, { listId, shareType: 'all', selectedCards: [] }];
    });
  };

  const updateListSharingOption = (listId: string, shareType: 'all' | 'selected' | 'empty') => {
    setSelectedLists(prev =>
      prev.map(list =>
        list.listId === listId
          ? { ...list, shareType, selectedCards: shareType === 'empty' ? [] : list.selectedCards }
          : list
      )
    );
  };

  const toggleCardSelection = (listId: string, cardId: string) => {
    setSelectedLists(prev =>
      prev.map(list => {
        if (list.listId !== listId) return list;
        const hasCard = list.selectedCards.includes(cardId);
        return {
          ...list,
          selectedCards: hasCard
            ? list.selectedCards.filter(id => id !== cardId)
            : [...list.selectedCards, cardId],
        };
      })
    );
  };

  const toggleListExpansion = (listId: string) => {
    setExpandedLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(listId)) {
        newSet.delete(listId);
      } else {
        newSet.add(listId);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Share "{boardName}"</h2>
            <p className="text-sm text-gray-500 mt-1">Select lists and cards to share</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleShare} className="p-6 border-b">
          <div className="space-y-4">
            {/* Email Input */}
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <select
                value={accessLevel}
                onChange={e => setAccessLevel(e.target.value as 'editor' | 'admin')}
                className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Users size={20} />
                Share
              </button>
            </div>

            {/* Lists Selection */}
            {/* <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Select Lists to Share</h3>
              
              <div className="space-y-3">
                {lists.map(list => {
                  const listProducts = products.filter(p => p.status === list.id);
                  const selectedOption = selectedLists.find(l => l.listId === list.id);
                  const isExpanded = expandedLists.has(list.id);

                  return (
                    <div key={list.id} className="bg-white rounded-lg border border-gray-200">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={!!selectedOption}
                              onChange={() => toggleListSelection(list.id)}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="font-medium text-gray-900">{list.title}</span>
                            <span className="text-sm text-gray-500">
                              ({listProducts.length} cards)
                            </span>
                          </div>
                          {selectedOption && (
                            <button
                              type="button"
                              onClick={() => toggleListExpansion(list.id)}
                              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                              <ChevronRight
                                size={20}
                                className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                              />
                            </button>
                          )}
                        </div>

                        {selectedOption && isExpanded && (
                          <div className="mt-4 pl-8 space-y-4">
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => updateListSharingOption(list.id, 'all')}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                  selectedOption.shareType === 'all'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Share All Cards
                              </button>
                              <button
                                type="button"
                                onClick={() => updateListSharingOption(list.id, 'selected')}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                  selectedOption.shareType === 'selected'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Select Cards
                              </button>
                              <button
                                type="button"
                                onClick={() => updateListSharingOption(list.id, 'empty')}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                  selectedOption.shareType === 'empty'
                                    ? 'bg-gray-700 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                Empty List
                              </button>
                            </div>

                            {selectedOption.shareType === 'selected' && (
                              <div className="space-y-2">
                                {listProducts.map(product => (
                                  <label
                                    key={product.id}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedOption.selectedCards.includes(product.id)}
                                      onChange={() => toggleCardSelection(list.id, product.id)}
                                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700">{product.title}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div> */}

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </div>
        </form>

        {/* Members List */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Current Members</h3>

          <div className="space-y-3">
            {members.map(member => (
              <div
                key={getMemberKey(member)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{member.email}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {member.role === 'owner' && <Shield size={14} className="text-purple-600" />}
                    {member.role === 'admin' && <Check size={14} className="text-green-600" />}
                    {member.role === 'editor' && <Eye size={14} className="text-blue-600" />}
                    <span className="capitalize">{member.role}</span>
                    {member.permissions?.type !== 'board' && (
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                        {member.permissions?.type === 'lists'
                          ? `${member.permissions.lists.length} lists`
                          : `${member.permissions?.cards.length} cards`}
                      </span>
                    )}
                  </div>
                </div>

                {isOwner && member.role !== 'owner' && onRemoveMember && (
                  <div className="flex items-center gap-2">
                    {onUpdateRole && (
                      <select
                        value={member.role}
                        onChange={e => onUpdateRole(member.email, e.target.value)}
                        className="text-sm rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                      >
                        <option value="Admin">Admin</option>
                        <option value="editor">Editor</option>
                      </select>
                    )}
                    <button
                      onClick={() => onRemoveMember(member.email)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Remove member"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No members yet. Share this board to collaborate with others.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
