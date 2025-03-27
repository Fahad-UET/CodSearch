import { Download, List, Grid } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface BatchActionsProps {
  selectedImages: string[];
  allImages: Array<{ url: string; name: string }>;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export function BatchActions({
  selectedImages,
  allImages,
  viewMode,
  onViewModeChange,
  onSelectAll,
  onClearSelection,
}: BatchActionsProps) {
  const downloadSelected = async () => {
    const zip = new JSZip();
    const images = selectedImages.length ? selectedImages : allImages.map(img => img.url);
    const failedDownloads: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      try {
        const response = await fetch(images[i]);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const filename = allImages[i].name || `image-${i + 1}.jpg`;
        zip.file(filename, blob);
      } catch (error) {
        console.error('Failed to download image:', error);
        failedDownloads.push(images[i]);
      }
    }
    
    if (failedDownloads.length === images.length) {
      alert('Failed to download any images. Please try again.');
      return;
    }

    if (failedDownloads.length > 0) {
      const message = `Failed to download ${failedDownloads.length} image(s). Proceeding with the successful downloads.`;
      alert(message);
    }

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'images.zip');
    } catch (error) {
      console.error('Failed to create zip file:', error);
      alert('Failed to create zip file. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
        </button>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onSelectAll}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Select All
          </button>
          {selectedImages.length > 0 && (
            <button
              onClick={onClearSelection}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <button
        onClick={downloadSelected}
        disabled={allImages.length === 0}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        <span>
          {selectedImages.length
            ? `Download Selected (${selectedImages.length})`
            : 'Download All'}
        </span>
      </button>
    </div>
  );
}