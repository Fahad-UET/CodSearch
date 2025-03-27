import { Eye, Check } from 'lucide-react';

interface ImageCardProps {
  image: {
    url: string;
    alt?: string;
  };
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
}

export function ImageCard({ image, selected, onSelect, onView }: ImageCardProps) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md group">
      <img
        src={image.url}
        alt={image.alt || 'Product image'}
        className="w-full h-48 object-cover"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={onView}
            className="p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onSelect}
            className={`p-1.5 rounded-full transition-colors ${
              selected
                ? 'bg-primary-500 text-white'
                : 'bg-white/90 hover:bg-white text-gray-800'
            }`}
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}