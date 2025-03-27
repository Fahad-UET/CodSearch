import React, { useState } from 'react';
import { Trash2, RotateCcw, X, AlertCircle, Trash, Clock } from 'lucide-react';
import { useRecycleBinStore } from '../../store/recycleBinStore';
import { format } from 'date-fns';

interface RecycleBinModalProps {
  onClose: () => void;
  onRestore: (item: any) => Promise<void>;
}

export function RecycleBinModal({ onClose, onRestore }: RecycleBinModalProps) {
  const { items, restoreItem, deleteItem, clearBin } = useRecycleBinStore();
  const [selectedType, setSelectedType] = useState<'all' | 'board' | 'list' | 'card'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredItems = items
    .filter(item => selectedType === 'all' || item.type === selectedType)
    .sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

  const handleRestore = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const item = restoreItem(id);
      if (item) {
        await onRestore(item);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore item');
    } finally {
      setIsLoading(false);
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'board':
        return '📋';
      case 'list':
        return '📝';
      case 'card':
        return '🗂️';
      default:
        return '📄';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Recycle Bin</h2>
              <p className="text-sm text-gray-500">
                Items are kept for 30 days before permanent deletion
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="p-4 mx-6 mt-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="p-6">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'board', label: 'Boards' },
              { id: 'list', label: 'Lists' },
              { id: 'card', label: 'Cards' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === tab.id
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getItemIcon(item.type)}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {item.data.name || item.data.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} />
                      Deleted {format(new Date(item.deletedAt), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRestore(item.id)}
                    disabled={isLoading}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Restore item"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete permanently"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Trash2 size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No items in the recycle bin</p>
              </div>
            )}
          </div>

          {filteredItems.length > 0 && (
            <div className="mt-6 pt-6 border-t flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {filteredItems.length} items in recycle bin
              </p>
              <button
                onClick={clearBin}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={20} />
                Empty Recycle Bin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}