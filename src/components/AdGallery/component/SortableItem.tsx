import { Facebook, Video } from 'lucide-react';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
import type { AdCreative } from '../../../types';
import VideoActions from './VideoActions';
import VideoPlayer from './VideoPlayer';
import Rating from './Rating';

interface Props {
  ad: AdCreative;
  onRatingChange?: (id: string, rating: number) => void;
  setShowAdProductModal: (status: any) => void;
  // to resolve build issue please check this
  showAdProductModal?: string;
  productDataType: boolean;
  // added to remove build error
  ads: any;
  setAds: any;
}

export function SortableItem({
  ad,
  onRatingChange,
  setShowAdProductModal,
  showAdProductModal,
  productDataType,
  ads,
  setAds,
}: Props) {
  //   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
  //     id: ad.id,
  //   });

  //   const style = {
  //     transform: CSS.Transform.toString(transform),
  //     transition,
  //   };

  return (
    <div
      // ref={setNodeRef}
      // style={{ ...style, height: 'fit-content' }}
      // {...attributes}
      // {...listeners}
      className={`group relative bg-white rounded-xl overflow-hidden transform transition-all duration-300 border-2 
    border-transparent hover:border-[#5D1C83] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15),_0_-3px_15px_-3px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.2),_0_-5px_20px_-5px_rgba(0,0,0,0.1)]`}
    >
      {ad.platform === 'direct' ? (
        <div className="aspect-[9/16] relative">
          <img
            src={ad.url}
            alt="Média"
            loading="lazy"
            className="w-full h-full object-contain bg-gray-100"
            onError={e => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              img.parentElement?.classList.add('error');
            }}
          />
          <div className="error absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
            <p>Contenu non disponible</p>
          </div>
          <VideoActions
            setShowAdProductModal={setShowAdProductModal}
            ad={ad}
            ads={ads}
            setAds={setAds}
              // we use this code previously but for now to remove error i comment it
            // onRatingChange={rating => onRatingChange?.(ad.id, rating)}
          />
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-50 rounded text-white text-xs">
            {ad.type === 'gif' ? 'GIF' : 'Image'}
          </div>
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
            <Rating value={ad.rating} onChange={rating => onRatingChange?.(ad.id, rating)} />
          </div>
        </div>
      ) : (
        <div className="aspect-[9/16] relative bg-gradient-to-br from-purple-50/30 via-transparent to-gray-100/20">
          <VideoPlayer
            src={ad.url}
            poster={ad.thumbnailUrl}
            onError={e => {
              const video = e.target as HTMLVideoElement;
              video.style.display = 'none';
              video.parentElement?.classList.add('error');
            }}
          />
          <div className="error absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
            <p>Contenu non disponible</p>
          </div>

          <VideoActions
            ad={ad}
            ads={ads}
            setAds={setAds}
                //same as above
            // onRatingChange={rating => onRatingChange?.(ad.id, rating)}
            setShowAdProductModal={setShowAdProductModal}
            productDataType={productDataType}
          />
          <div className="absolute bottom-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg">
            {ad.platform === 'tiktok' ? (
              <Video className="w-4 h-4 text-white" />
            ) : (
              <Facebook className="w-4 h-4 text-white" />
            )}
          </div>
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
            <Rating value={ad.rating} onChange={rating => onRatingChange?.(ad.id, rating)} />
          </div>
        </div>
      )}
    </div>
  );
}
