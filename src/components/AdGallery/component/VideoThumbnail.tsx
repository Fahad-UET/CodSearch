import { X } from 'lucide-react';
import { useFavoritesStore } from '../../../store/FavouriteStore';

interface Props {
  itemId: string;
  listId: string;
}

export default function VideoThumbnail({ itemId, listId }: Props) {
  const { lists, removeFromList } = useFavoritesStore();

  const list = lists.find(l => l.id === listId);
  const item = list?.items.find(i => i.id === itemId);

  if (!list || !item) return null;

  return (
    <div className="relative group aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
      <video src={item.adId} className="w-full h-full object-cover" poster={item.thumbnailUrl} />

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200">
        <button
          onClick={() => removeFromList(listId, item.adId)}
          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200"
          title="Retirer de la liste"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
