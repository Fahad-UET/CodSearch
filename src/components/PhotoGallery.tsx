import React, { useState } from 'react';
import { X, ImageOff, Star, Trash2, Plus, Search, Download, Check } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Product } from '../types';
import { useProductStore } from '../store';
import { updateProduct as updateProductService } from '../services/firebase';
import { updateCredits, getCredits } from '@/services/firebase/credits';
import Notification from './Notification';
import CreditsInformation from './credits/CreditsInformation';

interface PhotoGalleryProps {
    // add any type because it causes issues in ts
  // images: { url: string; [key: string]: any }[];
  images: { url: string; [key: string]: any }[] | any;
  product: Product;
  onClose: () => void;
  embedded?: boolean;
}

export function PhotoGallery({ images, product, onClose, embedded = false }: PhotoGalleryProps) {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedImages, setDownloadedImages] = useState<Set<string>>(new Set());
  const [selectThumnail, setSelectThumnail] = useState(null);
  const updateProduct = useProductStore(state => state.updateProduct);
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) return;
    const userId = user?.uid;
    const credits = await getCredits(userId, 'addImage');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    const updatedImages = [
      ...images,
      {
        url: newImageUrl.trim(),
        rating: 0,
        id: `${userId}_${Date.now()}`,
      },
    ];

    const updatedService = await updateProductService(product?.id, {
      images: updatedImages,
    });

    if (!updatedService) {
      throw new Error('Error updating product');
    }

    updateProduct(product.id, { images: updatedImages });
    const result = await updateCredits(userId, 'addImage');
    setPackage(userPackage.plan, result.toString());
    setNewImageUrl('');
  };

  const handleSelectThumbnail = async image => {
    try {
      const updatedProduct = await updateProductService(product.id, { thumbnail: image });
      updateProduct(product.id, { thumbnail: image });
    } catch (error) {
      console.log('Failed to update product:', error);
    }
  };

  const handleDeleteImage = async imageToDelete => {
    const updatedImages = images.filter(image => image.id !== imageToDelete.id);

    await updateProductService(product.id, { images: updatedImages });

    updateProduct(product.id, { images: updatedImages });

    if (selectedImage === imageToDelete.url) {
      setSelectedImage(null);
    }
  };

  const handleRateImage = async (imageToRate: { id: string }, rating: number) => {
    const updatedImages = images.map(image =>
      image.id === imageToRate.id ? { ...image, rating } : image
    );

    updateProduct(product.id, { images: updatedImages });

    await updateProductService(product.id, { images: updatedImages });
  };

  const handleDownloadImage = async (imageUrl: string) => {
    try {
      const userId = user?.uid;
      const credits = await getCredits(userId, 'imageDownload');
      if (!credits) {
        CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
        return;
      }
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = imageUrl.split('/').pop() || 'image.jpg';
      saveAs(blob, filename);
      setDownloadedImages(prev => new Set([...prev, imageUrl]));
      setTimeout(() => {
        setDownloadedImages(prev => {
          const next = new Set(prev);
          next.delete(imageUrl);
          return next;
        });
      }, 2000);
      const result = await updateCredits(userId, 'imageDownload');
      setPackage(userPackage.plan, result.toString());
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleDownloadAll = async () => {
    const credits = await getCredits(user?.uid, 'imageDownload', sortedImages.length);
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const imageFolder = zip.folder('images');

      if (!imageFolder) throw new Error('Failed to create zip folder');

      // Download all images in parallel
      const downloads = sortedImages.map(async (image, index) => {
        try {
          const response = await fetch(image.url);
          const blob = await response.blob();
          const extension = image.url.split('.').pop()?.split('?')[0] || 'jpg';
          const filename = `image-${index + 1}.${extension}`;
          imageFolder.file(filename, blob);
          return true;
        } catch (error) {
          console.error(`Failed to download ${image.url}:`, error);
          return false;
        }
      });

      await Promise.all(downloads);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `${product.title || 'images'}.zip`);
      const result = await updateCredits(user?.uid, 'imageDownload', sortedImages.length);
      setPackage(userPackage.plan, result.toString());
    } catch (error) {
      console.error('Failed to create zip file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch =
      image?.url?.toLowerCase().includes(searchTerm?.toLowerCase() || '') || false;
    const matchesRating = filterRating === null || (image.rating || 0) >= filterRating;
    return matchesSearch && matchesRating;
  });

  const sortedImages = [...filteredImages].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const content = (
    <div className="p-6 space-y-6 h-[70vh]">
      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-4 items-center flex-1">
          {/* <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div> */}
          <select
            value={filterRating || ''}
            onChange={e => setFilterRating(e.target.value ? Number(e.target.value) : null)}
            className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map(rating => (
              <option key={rating} value={rating}>
                {rating}+ Stars
              </option>
            ))}
          </select>
        </div>
        {sortedImages.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download size={20} />
                Download All
              </>
            )}
          </button>
        )}
      </div>

      {/* Add New Image */}
      <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={e => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 rounded-lg border-purple-200 bg-white focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
          <button
            onClick={handleAddImage}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Image
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedImages.length > 0 ? (
          sortedImages.map((image, index) => (
            <div
              key={image.id || `${image.url}-${index}`}
              className="group relative aspect-square bg-white rounded-xl overflow-hidden border border-purple-100 hover:shadow-lg transition-all"
            >
              {product?.thumbnail?.imageId === image?.id ? (
                <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-400/90 text-yellow-900 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1 z-50">
                  Selected
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleSelectThumbnail({ image: image.url, imageId: image.id });
                  }}
                  className="absolute top-2 right-2 px-2 py-1 bg-yellow-400/90 text-yellow-900 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1 z-50"
                >
                  Select
                </button>
              )}
              <img
                src={image.url}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover"
                onClick={() => setSelectedImage(image.url)}
              />

              {/* Rating Badge */}
              {image.rating > 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-yellow-400/90 text-yellow-900 rounded-full text-sm font-medium backdrop-blur-sm flex items-center gap-1">
                  <Star size={14} className="fill-yellow-900" />
                  {image.rating}
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
                {/* Rating Stars */}
                <div className="absolute top-4 left-4 right-4 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star, i) => (
                    <button key={i} onClick={() => handleRateImage(image, star)} className="p-1">
                      <Star
                        size={20}
                        className={`${
                          image.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleDownloadImage(image.url)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                    title="Download image"
                  >
                    {downloadedImages.has(image.url) ? (
                      <Check size={20} className="text-green-400" />
                    ) : (
                      <Download size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                    title="Delete image"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <Notification
                show={notification.show}
                type={notification.type}
                message={notification.message}
                setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-purple-300">
            <ImageOff size={48} className="mb-4" />
            <p className="text-lg">No images available</p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full max-w-7xl h-[90vh] mx-4 bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <div className="flex justify-between items-center p-6 border-b border-purple-100">
          <h2 className="text-xl font-semibold text-gray-900">Photo Gallery</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">{content}</div>
      </div>
    </div>
  );
}
