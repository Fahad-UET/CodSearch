import { useState } from 'react';
import { Download } from 'lucide-react';
import { ImageCard } from './ImageCard';
import { ImagePreview } from './ImagePreview';
import { useImages } from '../hooks/useImages';

export function ImageGrid() {
  const { images } = useImages();
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  // to resolve build issue please check this
  // const [previewImage, setPreviewImage] = useState<Image | null>(null);
  const [previewImage, setPreviewImage] = useState<any | null>(null);

  const handleSelect = (image: any) => {
    setSelectedImages(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(image.url)) {
        newSelection.delete(image.url);
      } else {
        newSelection.add(image.url);
      }
      return newSelection;
    });
  };

  const handleDownloadSelection = async () => {
    if (selectedImages.size === 0) return;

    try {
      const response = await fetch('/api/download-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: Array.from(selectedImages),
        }),
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected-images.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadSelection}
          disabled={selectedImages.size === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            selectedImages.size > 0
              ? 'bg-primary-500 text-white hover:bg-primary-600'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Download className="w-4 h-4" />
          Download Selection ({selectedImages.size})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ImageCard
            key={index}
            image={image}
            selected={selectedImages.has(image.url)}
            onSelect={() => handleSelect(image)}
            onView={() => setPreviewImage(image)}
          />
        ))}
      </div>

      {previewImage && (
        <ImagePreview
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}