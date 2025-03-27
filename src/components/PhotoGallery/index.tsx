import { ImageGrid } from './components/ImageGrid';
import { ListView } from './components/ListView';
import { BatchActions } from './components/BatchActions';
import { ImagePreview } from './components/ImagePreview';
import { useImageLoader } from './hooks/useImageLoader';
import { useState } from 'react';
// import { ImageGrid } from './components/ImageGrid';
import { useImages } from './hooks/useImages';

export function PhotoGallery() {
  // to resolve build issue please check this
  // const { images, loading } = useImageLoader();
  const { images }: any = useImages();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleToggleSelect = (url: string) => {
    setSelectedImages(prev =>
      prev.includes(url)
        ? prev.filter(i => i !== url)
        : [...prev, url]
    );
  };

  const handleSelectAll = () => {
    setSelectedImages(images.map(img => img.url));
  };

  const handleClearSelection = () => {
    setSelectedImages([]);
  };
// to resolve build issue please check this 
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-64">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
  //     </div>
  //   );
  // }

  return (
    <div className="bg-white rounded-lg shadow">
      <BatchActions
        selectedImages={selectedImages}
        allImages={images}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
      />

      <div className="p-4">
        {viewMode === 'grid' ? (
            <ImageGrid 
            // to resolve build issue please check this
            // images={images}
            // selectedImages={selectedImages}
          />
        ) : (
      <ImageGrid />
        )}
    </div>
  </div>
  );
}