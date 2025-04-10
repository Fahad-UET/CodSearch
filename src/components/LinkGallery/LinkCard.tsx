import React, { useState } from 'react';
import { ExternalLink, Copy, Check, Trash2, Star, Download, AlertCircle } from 'lucide-react';
import { Link } from '../../types';
import { updateProduct as updateProductService } from '../../services/firebase';
import { useProductStore } from '../../store';
import VideoPlayer from '../AdGallery/component/VideoPlayer';
import Rating from '../AdGallery/component/Rating';
import VideoActions from '../AdGallery/component/VideoActions';
import { getCredits, updateCredits } from '@/services/firebase/credits';

interface LinkCardProps {
  link: Link;
  icon: React.ReactNode;
  onEdit: (id: string, updates: Partial<Link>) => void;
  onEditDownload: (id: string, updates: Partial<Link>) => void;
  onDelete: (id: string) => void;
  domain: string;
  onDownload: () => string;
  hasDownloadUrl: boolean;
  videos: any;
  productId: string;
  isMedia?: boolean;
  CreditAlert?: (show: boolean, message: string, type: 'error' | 'success') => void;
}

export function LinkCard({
  link,
  icon,
  onEdit,
  onEditDownload,
  onDelete,
  domain,
  onDownload,
  hasDownloadUrl,
  videos,
  productId,
  isMedia,
  CreditAlert,
}: LinkCardProps) {
  const updateProduct = useProductStore(state => state.updateProduct);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(link.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const handleRating = (rating: number) => {
    onEdit(link.id, { rating });
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    getCredits(user?.uid, 'videoDownload').then(credits => {
      if (!credits) {
        CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
        return;
      }
    });
    try {
      const updatedLinks = videos.map(item =>
        item.id === link.id ? { ...item, downloaded: true } : item
      );
      const updatedService = await updateProductService(productId, {
        videoLinks: updatedLinks,
      });

      if (!updatedService) {
        throw new Error('Error updating product');
      }

      updateProduct(productId, { videoLinks: updatedLinks });
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // onEditDownload(link.id, {
      //   downloaded: true,
      //   downloadedAt: new Date(),
      // });

      const service = onDownload();
      const result = await updateCredits(user?.uid, 'videoDownload');
      setPackage(userPackage.plan, result.toString());
      // Open download page
      window.open(service, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenLink = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`group relative ${
        isMedia ? 'aspect-[9/16]' : 'aspect-square'
      } bg-white rounded-xl overflow-hidden border border-purple-100 hover:shadow-lg transition-all`}
    >
      {/* Download Status Badge */}
      {link.downloaded && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full z-10">
          Downloaded
          {link.downloadedAt && (
            <span className="ml-1 text-green-600">
              {new Date(link.downloadedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      )}

      {/* Preview Area */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-50 to-white cursor-pointer ${
          isMedia ? '' : 'p-6'
        }`}
        onClick={isMedia ? () => {} : handleOpenLink}
      >
        <div className="flex flex-col items-center justify-center h-full text-center ">
          {!isMedia && (
            <>
              <div className="mb-4 text-gray-400">{icon}</div>
              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{link.title}</h4>
              <p className="text-sm text-purple-600 font-medium mb-2">{domain}</p>
            </>
          )}

          {isMedia && (
            <div className="aspect-[9/16] relative bg-gradient-to-br from-purple-50/30 via-transparent to-gray-100/20">
              <VideoPlayer
                src={link?.url}
                poster={link?.thumbnailUrl}
                onError={e => {
                  const video = e.target as HTMLVideoElement;
                  video.style.display = 'none';
                  video.parentElement?.classList.add('error');
                }}
              />
              {/* <div className="error absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                <p>Contenu non disponible</p>
              </div> */}
              {/* <VideoActions ad={ad} /> */}
              {/* <div className="absolute bottom-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg">
                {ad.platform === '' ? (
                  <Video classtiktokName="w-4 h-4 text-white" />
                ) : (
                  <Facebook className="w-4 h-4 text-white" />
                )} */}
              {/* </div> */}
              {/* <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                <Rating value={link.rating} onChange={() => {}} />
              </div> */}
            </div>
          )}

          {link.rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} className="fill-yellow-500" />
              <span className="text-sm font-medium">{link.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-20">
          <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Delete Video?</h3>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hover Overlay */}
      {!isMedia && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
          {/* Rating Stars */}
          <div className="absolute top-4 left-4 right-4 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={`${link.id}-star-${star}`}
                onClick={() => handleRating(star)}
                className="p-1"
              >
                <Star
                  size={20}
                  className={`${
                    (link.rating || 0) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            {/* <button
              onClick={handleOpenLink}
              className="p-2 text-white hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
              title="Open link"
            >
              <ExternalLink size={18} />
            </button> */}
            {/* <button
              onClick={handleCopy}
              className="p-2 text-white hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
              title="Copy link"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button> */}
            {hasDownloadUrl && (
              <button
                onClick={handleDownload}
                className={`p-2 text-black hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors ${
                  link.downloaded ? 'text-green-400' : ''
                }`}
                title={link.downloaded ? 'Already downloaded' : 'Download content'}
              >
                <Download size={18} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
              title="Delete video"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
      {isMedia && <VideoActions ad={link} isMedia={isMedia} />}

      {isMedia && (
        <>
          {/* Rating Stars */}
          {/* <div className="absolute top-4 left-4 right-4 flex justify-center gap-1 opacity-0 group-hover:opacity-100">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={`${link.id}-star-${star}`}
                onClick={() => handleRating(star)}
                className="p-1"
              >
                <Star
                  size={20}
                  className={`${
                    (link.rating || 0) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
          </div> */}

          {/* Action Buttons */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100">
            {/* <button
              onClick={handleOpenLink}
              className="p-2 text-white hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
              title="Open link"
            >
              <ExternalLink size={18} />
            </button> */}
            {/* <button
              onClick={handleCopy}
              className="p-2 text-white hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
              title="Copy link"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button> */}
            {hasDownloadUrl && (
              <button
                onClick={handleDownload}
                className={`p-2 text-black-400 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors ${
                  link.downloaded ? 'text-green-400' : ''
                }`}
                title={link.downloaded ? 'Already downloaded' : 'Download content'}
              >
                <Download size={18} />
              </button>
            )}
            <button
              onClick={handleDelete}
              className="p-2 text-red-400 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
              title="Delete video"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
