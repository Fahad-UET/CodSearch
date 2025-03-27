import { useState } from 'react';
import { Heart, FolderHeart } from 'lucide-react';
import type { AdCreative } from '../../../../types';
import type { FavoritesList } from '../../../../types';
import CreateListModal from './CreateListModal';
import { useFavoritesStore } from '../../../../store/FavouriteStore';

interface Props {
  ad: AdCreative;
}

export default function FavoriteButton({ ad }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLists, setShowLists] = useState(false);
  const { lists, addToList, removeFromList } = useFavoritesStore();

  const isInList = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    return list?.items.some(item => item.adId === ad.id) ?? false;
  };

  const toggleList = async (listId: string) => {
    if (isInList(listId)) {
      await removeFromList(listId, ad.id);
    } else {
      await addToList(listId, ad);
    }
  };

  const handleCreateList = async (list: FavoritesList) => {
    await addToList(list.id, ad);
    setIsModalOpen(false);
    setShowLists(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowLists(!showLists)}
          className={`p-1.5 ${
            lists.some(list => list.items.some(item => item.adId === ad.id))
              ? 'bg-[#5D1C83]'
              : 'bg-gray-600 hover:bg-[#5D1C83]'
          } text-white rounded-lg transform hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg hover:ring-2 hover:ring-purple-300/50`}
          title="Ajouter aux favoris"
        >
          <Heart className="w-4 h-4" />
        </button>

        {showLists && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-100">
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#5D1C83] hover:bg-purple-50 rounded-md"
              >
                <FolderHeart className="w-4 h-4" />
                Créer une nouvelle liste
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => toggleList(list.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <Heart
                      className={`w-4 h-4 ${
                        isInList(list.id) ? 'fill-[#5D1C83] text-[#5D1C83]' : 'text-gray-400'
                      }`}
                    />
                    {list.name}
                  </span>
                  {!list.isPublic && <span className="text-xs text-gray-400">Privée</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreateList}
      />
    </>
  );
}
