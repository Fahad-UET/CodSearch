import { useState, useEffect, useMemo } from 'react';
import {
  Trash2,
  ExternalLink,
  Grid,
  List,
  Search,
  Copy,
  Check,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { getSavedImages } from '@/services/firebase/savedImages';
import { useProductStore } from '@/store';
import { AddProductModal } from '@/components/AddProductModal';
import { getUserBoards } from '@/services/firebase';

export default function MyLibrary({ onBack }: any) {
  const { user } = useProductStore();
  const [savedImages, setSavedImages] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdProductModal, setShowAdProductModal] = useState({
    status: false,
    url: '',
    type: 'images',
  });
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user]);

  const loadBoards = async () => {
    if (!user) return;
    try {
      const userBoards = await getUserBoards(user.uid, user.email);
      setBoards(userBoards);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Load saved images from localStorage
    const loadSavedImages = async () => {
      const [data]: any = await getSavedImages(user.uid);
      setSavedImages(
        data?.data?.map((img: any) => ({
          ...img,
          createdAt: new Date(img.createdAt),
        }))
      );
    };

    loadSavedImages();

    // Listen for storage changes
    window.addEventListener('storage', loadSavedImages);
    return () => window.removeEventListener('storage', loadSavedImages);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const newImages = savedImages?.filter(img => img.id !== id);
      localStorage.setItem('saved_images', JSON.stringify(newImages));
      setSavedImages(newImages);
    }
  };

  const handleCopyLink = async (url: string, id: string) => {
    try {
      // Ensure we have a valid URL to copy
      let urlToCopy = url;
      try {
        // Test if it's a valid URL
        new URL(url);
      } catch {
        // If not valid, try to extract from text content
        const urlMatch = url.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          urlToCopy = urlMatch[0];
        } else {
          throw new Error('Invalid URL');
        }
      }

      await navigator.clipboard.writeText(urlToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link: Invalid URL');
    }
  };

  const getDefaultBoard = useMemo(() => {
    const defaultBoard = boards?.filter(item => item.boardType === 'default');
    return defaultBoard;
  }, [boards]);

  const filteredImages = searchQuery
    ? savedImages?.filter(img => img.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()))
    : savedImages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1333] via-[#2d1854] to-[#341d66]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-[#2d1854]/50 p-6 rounded-2xl backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-white/80 hover:text-white flex items-center gap-2
                transition-colors duration-300 hover:bg-white/5 rounded-lg p-2"
            >
              <ArrowLeft size={20} />
            </button>
            <Search className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white/90">My Photos Library</h1>
            <span className="text-white/70 text-sm">
              {savedImages?.length} {savedImages?.length === 1 ? 'image' : 'images'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search saved images..."
                className="w-64 px-4 py-2 bg-[#1a1333]/50 text-white placeholder-white/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 backdrop-blur-md"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2 bg-[#1a1333]/50 rounded-xl p-1 backdrop-blur-md border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-white hover:bg-white/10'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-white hover:bg-white/10'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Images grid/list */}
        {savedImages?.length === 0 ? (
          <div className="text-center py-12 bg-[#2d1854]/30 backdrop-blur-md rounded-2xl border border-white/10">
            <p className="text-white/70">
              No saved images yet. Use the search page to find and save images.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'
                : 'space-y-4'
            }
          >
            {filteredImages?.map(image => (
              <div
                key={image.id}
                className={`group relative ${
                  viewMode === 'grid'
                    ? 'aspect-square rounded-2xl overflow-hidden'
                    : 'flex items-center gap-4 bg-[#2d1854]/30 rounded-2xl p-4 backdrop-blur-md border border-white/10'
                }`}
              >
                {/* Image */}
                <div
                  className={`${viewMode === 'grid' ? 'w-full h-full overflow-hidden' : 'w-48'}`}
                >
                  <a
                    href={image.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="w-full h-full object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                    />
                  </a>
                </div>

                {/* Actions overlay */}
                <div
                  className={`absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-4 ${
                    viewMode === 'list' ? 'hidden' : ''
                  }`}
                >
                  <button
                    onClick={() => {
                      setShowAdProductModal({
                        status: true,
                        url: image.url,
                        type: 'images',
                      });
                    }}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md transition-all text-white bg-emerald-500/80 hover:bg-emerald-600/80 shadow-lg`}
                  >
                    <Plus size={20} />
                  </button>
                  <a
                    href={image.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transform hover:scale-110 transition-all duration-200 backdrop-blur-sm hover:shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleCopyLink(image.url, image.id)}
                    className={`p-2 text-white rounded-lg transform hover:scale-110 transition-all duration-200 backdrop-blur-sm hover:shadow-lg ${
                      copiedId === image.id
                        ? 'bg-emerald-500/80 hover:bg-emerald-600/80'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {copiedId === image.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600/80 transform hover:scale-110 transition-all duration-200 backdrop-blur-sm hover:shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* List view info */}
                {viewMode === 'list' && (
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <a
                        href={image.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-white/80 transition-colors flex items-center gap-2"
                      >
                        {(() => {
                          try {
                            return new URL(image.originalUrl).hostname;
                          } catch {
                            return 'Unknown source';
                          }
                        })()}
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </a>
                      <p className="text-sm text-white/50">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(image.url, image.id)}
                        className={`p-2 rounded-lg transition-all ${
                          copiedId === image.id
                            ? 'text-emerald-500 bg-emerald-500/10'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {copiedId === image.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="p-2 text-white/70 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showAdProductModal?.status && (
        <AddProductModal
          onClose={() => {
            setShowAdProductModal({ status: false, url: '', type: 'images' });
          }}
          listId={getDefaultBoard?.[0]?.lists?.[0]?.id}
          boardId={getDefaultBoard?.[0]?.id}
          defaultCreation
          link={showAdProductModal}
        />
      )}
    </div>
  );
}
