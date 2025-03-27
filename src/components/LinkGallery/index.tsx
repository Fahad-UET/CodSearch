import React, { useState, useEffect } from 'react';
import {
  Plus,
  Settings,
  Star,
  Download,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Video,
  MessageCircle,
  X,
} from 'lucide-react';
import { AdCreative, Link } from '../../types';
import { LinkCard } from './LinkCard';
import { DownloadSettings } from './DownloadSettings';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getUserVideosUrl, updateProduct as updateProductService } from '../../services/firebase';
import { useProductStore } from '../../store';
import { SortableItem } from '../AdGallery/component/SortableItem';
import Rating from '../AdGallery/component/Rating';
import VideoPlayer from '../AdGallery/component/VideoPlayer';
import VideoActions from '../AdGallery/component/VideoActions';
import Notification from '../Notification';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import CreditsInformation from '../credits/CreditsInformation';

interface LinkGalleryProps {
  links: Link[];
  onAddLink: (link: Omit<Link, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditLink: (id: string, updates: Partial<Link>) => void;
  onEditDownload: (id: string, updates: Partial<Link>) => void;
  onDeleteLink: (id: string) => void;
  onClose: () => void;
  embedded?: boolean;
  productId: string;
}

export interface DownloadService {
  category: string;
  url: string;
}

export function LinkGallery({
  links,
  onAddLink,
  onEditLink,
  onEditDownload,
  onDeleteLink,
  onClose,
  productId,
  embedded = false,
}: LinkGalleryProps) {
  const filteredLinks = links.filter(
    link => !link?.url?.includes('mp4') && !link?.url?.includes('video')
  );
  const filteredVideos = links.filter(
    link => link?.url?.includes('mp4') || link?.url?.includes('video')
  );

  const updateProduct = useProductStore(state => state.updateProduct);
  const { user } = useProductStore();
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDownloadStatus, setSelectedDownloadStatus] = useState<
    'all' | 'downloaded' | 'pending'
  >('all');
  const [error, setError] = useState<string | null>(null);
  const [downloadServices] = useLocalStorage<DownloadService[]>('downloadServices', []);
  const [showSettings, setShowSettings] = useState(false);
  const [activeUrlTab, setActiveUrlTab] = useState('video');
  const { userPackage, setPackage } = useProductStore();
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  // Calculate counts for each category
  const counts = links.reduce((acc, link) => {
    acc[link.category] = (acc[link.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCount = links.length;
  const downloadedCount = links.filter(link => link.downloaded).length;
  const pendingCount = totalCount - downloadedCount;

  const [ads, setAds] = useState<AdCreative[]>([]);

  const categories = [
    { id: 'all', label: 'All', icon: <Globe size={16} />, count: totalCount },
    { id: 'youtube', label: 'YT', icon: <Youtube size={16} />, count: counts['youtube'] || 0 },
    { id: 'shorts', label: 'Shorts', icon: <Video size={16} />, count: counts['shorts'] || 0 },
    {
      id: 'tiktok',
      label: 'TikTok',
      icon: <Video size={16} className="rotate-45" />,
      count: counts['tiktok'] || 0,
    },
    {
      id: 'snapchat',
      label: 'Snap',
      icon: <MessageCircle size={16} />,
      count: counts['snapchat'] || 0,
    },
    { id: 'facebook', label: 'FB', icon: <Facebook size={16} />, count: counts['facebook'] || 0 },
    {
      id: 'instagram',
      label: 'IG',
      icon: <Instagram size={16} />,
      count: counts['instagram'] || 0,
    },
    { id: 'other', label: 'Other', icon: <Globe size={16} />, count: counts['other'] || 0 },
  ];

  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) return;
    const credits = await getCredits(user?.uid, 'addVideo');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    try {
      const url = new URL(newLinkUrl);
      const domain = getDomainFromUrl(newLinkUrl);
      const id = `${domain}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const isYoutubeShorts = url.pathname.includes('/shorts/');
      const category = isYoutubeShorts
        ? 'shorts'
        : categories.some(c => c.id === domain)
        ? domain
        : 'other';

      onAddLink({
        id,
        url: newLinkUrl.trim(),
        title: newLinkUrl.trim(),
        category,
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const result = await updateCredits(user?.uid, 'addVideo');
      setPackage(userPackage.plan, result.toString());
      setNewLinkUrl('');
      setError(null);
    } catch (error) {
      setError('Invalid URL format');
    }
  };

  const mainContent = (
    <div className="p-6 space-y-6 h-[70vh]">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveUrlTab('video')}
          className={`w-[200px] rounded-xl font-medium text-[16px] text-white  ${
            activeUrlTab === 'video'
              ? ' border-2 border-[#121212] border-x-slate-950 text-white rounded-lg bg-black'
              : 'bg-white !text-black'
          } py-3 px-7`}
        >
          Videos
        </button>
        <button
          onClick={() => setActiveUrlTab('url')}
          className={`w-[200px] rounded-xl font-medium text-[16px] text-white bg-[#E54ADB]${
            activeUrlTab === 'url'
              ? ' border-2 border-[#121212] border-x-slate-950 text-white rounded-lg bg-black text white'
              : 'bg-white !text-black'
          } py-3 px-7`}
        >
          Video Link
        </button>
      </div>

      {/* Filters */}
      {activeUrlTab === 'url' && (
        <>
          <div className="bg-white/80 rounded-xl p-4 border border-purple-100 mb-5">
            <div className="flex gap-2">
              <input
                type="url"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                placeholder="Enter video URL"
                className="flex-1 rounded-lg border-purple-200 bg-white focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <button
                onClick={handleAddLink}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add Video
              </button>
              {links.length > 0 && (
                <>
                  {/* <button
                onClick={handleDownloadAll}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                title="Download all videos"
              >
                <Download size={20} />
                Download All
              </button> */}
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    title="Download Settings"
                  >
                    <Settings size={20} />
                    Settings
                  </button>
                </>
              )}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          {/* <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(category.id === selectedCategory ? null : category.id)
                  }
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs ${
                    category.id === selectedCategory
                      ? 'bg-purple-100 border-purple-200 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category.icon}
                  <span className="whitespace-nowrap">{category.label}</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedDownloadStatus('all')}
                className={`px-2 py-1 rounded-lg border text-xs ${
                  selectedDownloadStatus === 'all'
                    ? 'bg-purple-100 border-purple-200 text-purple-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Videos
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {totalCount}
                </span>
              </button>
              <button
                onClick={() => setSelectedDownloadStatus('downloaded')}
                className={`px-2 py-1 rounded-lg border text-xs ${
                  selectedDownloadStatus === 'downloaded'
                    ? 'bg-green-100 border-green-200 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Downloaded
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {downloadedCount}
                </span>
              </button>
              <button
                onClick={() => setSelectedDownloadStatus('pending')}
                className={`px-2 py-1 rounded-lg border text-xs ${
                  selectedDownloadStatus === 'pending'
                    ? 'bg-orange-100 border-orange-200 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pending
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {pendingCount}
                </span>
              </button>
            </div>
            
          </div> */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-1 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(category.id === selectedCategory ? null : category.id)
                  }
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs ${
                    category.id === selectedCategory
                      ? 'bg-purple-100 border-purple-200 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {category.icon}
                  <span className="whitespace-nowrap">{category.label}</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedDownloadStatus('all')}
                className={`px-2 py-1 rounded-lg border text-xs ${
                  selectedDownloadStatus === 'all'
                    ? 'bg-purple-100 border-purple-200 text-purple-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Videos
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {totalCount}
                </span>
              </button>
              <button
                onClick={() => setSelectedDownloadStatus('downloaded')}
                className={`px-2 py-1 rounded-lg border text-xs ${
                  selectedDownloadStatus === 'downloaded'
                    ? 'bg-green-100 border-green-200 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Downloaded
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {downloadedCount}
                </span>
              </button>
              <button
                onClick={() => setSelectedDownloadStatus('pending')}
                className={`px-2 py-1 rounded-lg border text-xs ${
                  selectedDownloadStatus === 'pending'
                    ? 'bg-orange-100 border-orange-200 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Pending
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                  {pendingCount}
                </span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredLinks
              .filter(link => {
                const matchesCategory =
                  !selectedCategory ||
                  selectedCategory === 'all' ||
                  link.category === selectedCategory;
                const matchesDownloadStatus =
                  selectedDownloadStatus === 'all' ||
                  (selectedDownloadStatus === 'downloaded' && link.downloaded) ||
                  (selectedDownloadStatus === 'pending' && !link.downloaded);
                return matchesCategory && matchesDownloadStatus;
              })
              .map(link => {
                const category = categories.find(c => c.id === link.category);
                return (
                  <LinkCard
                    key={`${link.id}-${link.url}`}
                    link={link}
                    icon={category?.icon || <Globe size={24} />}
                    onEdit={onEditLink}
                    onEditDownload={onEditDownload}
                    onDelete={onDeleteLink}
                    domain={category?.label || 'Other Site'}
                    onDownload={() => {
                      const service = downloadServices.find(
                        s => s.category === 'all' || s.category === link.category
                      );
                      return service
                        ? service.url.replace('{url}', encodeURIComponent(link.url))
                        : '';
                    }}
                    hasDownloadUrl={
                      !!downloadServices.find(
                        s => s.category === 'all' || s.category === link.category
                      )
                    }
                    productId={productId}
                    videos={links}
                    CreditAlert={CreditAlert}
                  />
                );
              })}
          </div>
        </>
      )}
      {activeUrlTab === 'video' && (
        <div>
          {/* Add New Link */}
          <div className="bg-white/80 rounded-xl p-4 border border-purple-100 mb-5">
            <div className="flex gap-2">
              <input
                type="url"
                value={newLinkUrl}
                onChange={e => setNewLinkUrl(e.target.value)}
                placeholder="Enter video URL"
                className="flex-1 rounded-lg border-purple-200 bg-white focus:border-purple-500 focus:ring focus:ring-purple-200"
              />
              <button
                onClick={handleAddLink}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                Add Video
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredVideos
              .filter(link => {
                const matchesCategory =
                  !selectedCategory ||
                  selectedCategory === 'all' ||
                  link.category === selectedCategory;
                const matchesDownloadStatus =
                  selectedDownloadStatus === 'all' ||
                  (selectedDownloadStatus === 'downloaded' && link.downloaded) ||
                  (selectedDownloadStatus === 'pending' && !link.downloaded);
                return matchesCategory && matchesDownloadStatus;
              })
              .map(link => {
                const category = categories.find(c => c.id === link.category);
                return (
                  <LinkCard
                    key={`${link.id}-${link.url}`}
                    link={link}
                    icon={category?.icon || <Globe size={24} />}
                    onEdit={onEditLink}
                    onEditDownload={onEditDownload}
                    onDelete={onDeleteLink}
                    domain={category?.label || 'Other Site'}
                    onDownload={() => {
                      const service = downloadServices.find(
                        s => s.category === 'all' || s.category === link.category
                      );
                      return service
                        ? service.url.replace('{url}', encodeURIComponent(link.url))
                        : '';
                    }}
                    hasDownloadUrl={
                      !!downloadServices.find(
                        s => s.category === 'all' || s.category === link.category
                      )
                    }
                    productId={productId}
                    videos={links}
                    isMedia
                    CreditAlert={CreditAlert}
                  />
                );
              })}
          </div>
        </div>
      )}

      {/* Links Grid */}

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
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
      />
    </div>
  );

  if (embedded) {
    return mainContent;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full max-w-7xl h-[90vh] mx-4 bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <div className="flex justify-between items-center p-6 border-b border-purple-100">
          <h2 className="text-xl font-semibold text-gray-900">Videos</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">{mainContent}</div>
      </div>
    </div>
  );
}

function getDomainFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace('www.', '');

    if (hostname === 'youtu.be' || hostname === 'youtube.com') {
      if (urlObj.pathname.includes('/shorts/')) {
        return 'shorts';
      }
      return 'youtube';
    }

    const domain = hostname.split('.')[0];
    return domain;
  } catch {
    return 'other';
  }
}
