import React, { useState, useRef } from 'react';
import {
  Plus,
  Video,
} from 'lucide-react';
import { DownloadSettings } from './LinkGallery/DownloadSettings';
import { updateProduct as updateProductService } from '../services/firebase';
import { useProductStore } from '../store';
import { AdCopy } from './AdCopy';
import { saveAs } from 'file-saver';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {DownloadService} from '@/components/LinkGallery'
import { formatDate } from '@/utils/dateFormat';

interface VideoGalleryProps {
  videos: any;
  product: any;
  onClose: () => void;
  embedded?: boolean;
}

// ... rest of the imports and interfaces remain the same ...

export function VideoGallery({
  videos = [],
  product,
  onClose,
  embedded = false,
}: VideoGalleryProps) {
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [videoLinks, setVideoLinks] = useState(videos);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [downloadServices] = useLocalStorage<DownloadService[]>('downloadServices', []);
  const updateProduct = useProductStore(state => state.updateProduct);
  const [showAdCopy, setShowAdCopy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleAddVideo = async () => {
    if (!newVideoUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      const now = new Date();
      const newUrl = newVideoUrl.trim();
      const updatedLinks = [
        ...videoLinks,
        {
          id: `link-${Date.now()}`,
          url: newUrl,
          type: 'video',
          createdAt: formatDate(now),
          updatedAt: formatDate(now),
        },
      ];

      const updatedProduct = await updateProductService(product.id, { videoLinks: updatedLinks });
      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }

      updateProduct(product.id, { videoLinks: updatedLinks });
      setVideoLinks(updatedLinks);
      setNewVideoUrl('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add video');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file');
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError('Video file size must be less than 100MB');
      return;
    }

    setVideoFile(file);
    setError(null);
  };

  const mainContent = (
    <div className="p-6 space-y-6">
      {/* Add New Video */}
      <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
        <div className="flex flex-col gap-4">
          {/* File Upload */}
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Upload Video
            </button>
            {videoFile && (
              <div className="flex-1 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg">
                {videoFile.name}
              </div>
            )}
          </div>

          {/* URL Input */}
          <div className="flex gap-2">
            <input
              type="url"
              value={newVideoUrl}
              onChange={e => setNewVideoUrl(e.target.value)}
              placeholder="Enter video URL"
              className="flex-1 rounded-lg border-purple-200 bg-white focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            />
            <button
              onClick={handleAddVideo}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Video URL
            </button>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videoLinks.map((video, index) => (
          <div
            key={`${video.id}-${index}`}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Video Preview */}
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <Video size={32} className="text-gray-400" />
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{video.title || video.url}</h3>
              <p className="text-sm text-gray-500 mt-1">Added {video.createdAt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ad Copy Modal */}
      {/* // to resolve build issue please check this */}
      {/* {showAdCopy && <AdCopy onClose={() => setShowAdCopy(false)} />} */}

      {/* Download Settings Modal */}
      {showSettings && (
        <DownloadSettings
          services={downloadServices}
          onSave={services => {
            localStorage.setItem('downloadServices', JSON.stringify(services));
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );

  return mainContent;

  // ... rest of the component remains the same ...
}
