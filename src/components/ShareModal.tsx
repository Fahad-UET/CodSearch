import React, { useState } from 'react';
import { X, UserPlus, Shield, Eye, Check, AlertCircle } from 'lucide-react';
import { Product, BoardMember } from '../types';
import { useProductStore } from '../store';

interface ShareModalProps {
  product: Product;
  onClose: () => void;
}

export function ShareModal({ product, onClose }: ShareModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<BoardMember['role']>('viewer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { shareProduct, removeShare, updateMemberRole, user } = useProductStore();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await shareProduct(product.id, email.trim(), role);
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await removeShare(product.id, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: BoardMember['role']) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateMemberRole(product.id, userId, newRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  const isOwner = user?.uid === product.ownerId;
  const members = product.members || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Share "{product.title}"</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {isOwner && (
          <form onSubmit={handleShare} className="p-6 border-b">
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as BoardMember['role'])}
                className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                <UserPlus size={20} />
                Share
              </button>
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
          </form>
        )}

        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Members</h3>
          
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.uid}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{member.email}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    {member.role === 'owner' && <Shield size={14} className="text-purple-600" />}
                    {member.role === 'editor' && <Check size={14} className="text-green-600" />}
                    {member.role === 'viewer' && <Eye size={14} className="text-blue-600" />}
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </p>
                </div>

                {isOwner && member.role !== 'owner' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.uid, e.target.value as BoardMember['role'])}
                      className="text-sm rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                    </select>
                    <button
                      onClick={() => handleRemoveMember(member.uid)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No members yet. Share this product to collaborate with others.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}