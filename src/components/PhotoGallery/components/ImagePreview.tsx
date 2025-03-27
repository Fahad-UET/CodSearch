import { X } from 'lucide-react';

interface ImagePreviewProps {
  image: {
    url: string;
    alt?: string;
  };
  onClose: () => void;
}

export function ImagePreview({ image, onClose }: ImagePreviewProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
      <img
        src={image.url}
        alt={image.alt || 'Preview'}
        className="max-w-full max-h-[90vh] object-contain"
      />
    </div>
  );
}