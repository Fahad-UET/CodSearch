import { useState } from 'react';
import { Plus, Settings, Share2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import CreateListModal from './favorites/CreateListModal';
import VideoThumbnail from '../component/VideoThumbnail';
import { useFavoritesStore } from '../../../store/FavouriteStore';

export default function FavoritesManager() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedLists, setExpandedLists] = useState<string[]>([]);
  const { lists, deleteList } = useFavoritesStore();

  const handleCreateList = () => {
    setIsCreateModalOpen(false);
  };

  const toggleListExpansion = (listId: string) => {
    setExpandedLists(prev =>
      prev.includes(listId) ? prev.filter(id => id !== listId) : [...prev, listId]
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Mes Listes</h2>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93] transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Liste
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Vous n'avez pas encore créé de liste</p>
          <p className="text-sm mt-2">
            Créez votre première liste pour commencer à organiser vos vidéos préférées
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map(list => (
            <div key={list.id} className="bg-gray-50 rounded-lg overflow-hidden transition-colors">
              <div className="flex items-center justify-between p-4 hover:bg-gray-100">
                <button
                  onClick={() => toggleListExpansion(list.id)}
                  className="flex items-center gap-2 flex-grow text-left"
                >
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {list.name}
                      {expandedLists.includes(list.id) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </h3>
                    {list.description && (
                      <p className="text-sm text-gray-600 mt-1">{list.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">
                        {list.items.length} vidéo{list.items.length !== 1 ? 's' : ''}
                      </span>
                      {list.isPublic && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      /* TODO: Implement share */
                    }}
                    className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors"
                    title="Partager"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      /* TODO: Implement edit */
                    }}
                    className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors"
                    title="Paramètres"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteList(list.id);
                    }}
                    className="p-2 text-red-600 hover:bg-white rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {expandedLists.includes(list.id) && (
                <div className="p-4 bg-white border-t border-gray-100">
                  {list.items.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Aucune vidéo dans cette liste</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {list.items.map(item => (
                        <VideoThumbnail key={item.id} itemId={item.id} listId={list.id} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CreateListModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreateList}
      />
    </div>
  );
}
