import { Image, Check } from 'lucide-react';

interface ListViewProps {
  images: Array<{ url: string; name: string; size?: number }>;
  selectedImages: string[];
  onToggleSelect: (url: string) => void;
}

export function ListView({ images, selectedImages, onToggleSelect }: ListViewProps) {
  return (
    <div className="divide-y">
      {images.map((image, index) => (
        <div
          key={image.url}
          className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => onToggleSelect(image.url)}
        >
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
            {image.url ? (
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Image className="text-gray-400" size={24} />
              </div>
            )}
          </div>
          
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {image.name || `Image ${index + 1}`}
            </p>
            {image.size && (
              <p className="text-sm text-gray-500">
                {(image.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          <div className="ml-4">
            {selectedImages.includes(image.url) ? (
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            ) : (
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}