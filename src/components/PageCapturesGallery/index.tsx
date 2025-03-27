import React, { useState } from 'react';
import {
  X,
  Plus,
  Download,
  Loader2,
  AlertCircle,
  Link as LinkIcon,
  Copy,
  Check,
  Image,
  FileText,
  ExternalLink,
} from 'lucide-react';
// import { PageCapture } from '../../types';
import { scrapeImagesFromUrl, downloadImages, ScrapedImage } from '../../services/scraper';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import { useProductStore } from '@/store';
import CreditsInformation from '../credits/CreditsInformation';

interface PageCapturesGalleryProps {
  // to resolve build issue please check this
  // captures: PageCapture[];
  // onAddCapture: (capture: Omit<PageCapture, 'id' | 'createdAt' | 'updatedAt'>) => void;
  // onEditCapture: (id: string, updates: Partial<PageCapture>) => void;
  captures: any[];
  // captures: PageCapture[];
  onAddCapture: (capture: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditCapture: (id: string, updates: Partial<any>) => void;
  onDeleteCapture: (id: string) => void;
  onClose: () => void;
  embedded?: boolean;
  product: any;
}

export function PageCapturesGallery({
  captures,
  onAddCapture,
  onDeleteCapture,
  onClose,
  product,
  embedded = false,
}: PageCapturesGalleryProps) {
  const { user } = useProductStore();
  const [newCaptureUrl, setNewCaptureUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrapedImages, setScrapedImages] = useState<ScrapedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [failedDownloads, setFailedDownloads] = useState<string[]>([]);
  const [scrapingUrl, setScrapingUrl] = useState<string | null>(null);
  const [scrappedUrl, setScrappedUrl] = useState<string | null>(null);
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

  const handleAddCapture = async () => {
    if (!newCaptureUrl.trim()) {
      setError('Please enter a URL');
      return;
    }
    const credits = await getCredits(user?.uid, 'addLandingPage');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    try {
      const url = new URL(newCaptureUrl.trim());

      const id = `capture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      onAddCapture({
        id,
        url: newCaptureUrl.trim(),
        title: newCaptureUrl.trim(),
        category: 'page',
        rating: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const result = await updateCredits(user?.uid, 'addLandingPage');
      setPackage(userPackage.plan, result.toString());
      setNewCaptureUrl('');
      setError(null);
    } catch (error) {
      setError('Invalid URL format');
    }
  };

  function getDomainCoreName(url) {
    try {
      const hostname = new URL(url).hostname; // Get the hostname
      const parts = hostname.split('.'); // Split the hostname by dots
      // Return the second-to-last part (e.g., "alibaba" for "alibaba.com")
      return parts.length > 1 ? parts[parts.length - 2] : null;
    } catch (e) {
      console.error('Invalid URL:', e.message);
      return null;
    }
  }

  const handleScrapeImages = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setScrapedImages([]);
    setSelectedImages(new Set());
    setScrapingUrl(url);
    const domainName = getDomainCoreName(url);
    setScrappedUrl(domainName);
    const credits = await getCredits(user?.uid, 'scraping');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    try {
      const images = await scrapeImagesFromUrl(url.trim());
      setScrapedImages(images);
      const result = await updateCredits(user?.uid, 'scraping');
      setPackage(userPackage.plan, result.toString());
      if (url === newCaptureUrl) {
        setNewCaptureUrl('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scrape images');
    } finally {
      setIsLoading(false);
      setScrapingUrl(null);
    }
  };

  const handleScrapeText = async (url: string) => {
    // Text scraping functionality to be implemented
  };

  const toggleImageSelection = (imageUrl: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageUrl)) {
      newSelection.delete(imageUrl);
    } else {
      newSelection.add(imageUrl);
    }
    setSelectedImages(newSelection);
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleDownloadImages = async (selectedOnly: boolean) => {
    const imagesToDownload = selectedOnly
      ? scrapedImages.filter(img => selectedImages.has(img.url))
      : scrapedImages;

    if (imagesToDownload.length === 0) {
      setError('No images selected for download');
      return;
    }

    setIsLoading(true);
    setError(null);
    setFailedDownloads([]);

    try {
      const zipBlob = await downloadImages(imagesToDownload);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${product.title}_${scrappedUrl}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to download images');
    } finally {
      setIsLoading(false);
    }
  };

  const mainContent = (
    <div className="p-6 space-y-6">
      {/* URL Input */}
      <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
        <div className="flex gap-2">
          <input
            type="url"
            value={newCaptureUrl}
            onChange={e => setNewCaptureUrl(e.target.value)}
            placeholder="Enter URL to scrape"
            className="flex-1 rounded-lg border-purple-200 bg-white focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
          <button
            onClick={handleAddCapture}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add URL
          </button>
          <button
            onClick={() => handleScrapeImages(newCaptureUrl)}
            disabled={isLoading || !newCaptureUrl.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Image size={20} />}
            Scrape Images
          </button>
        </div>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Captures List */}
      {captures.length > 0 && (
        <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Pages</h3>
          <div className="space-y-2">
            {captures.map(capture => (
              <div
                key={capture.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-purple-200 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {capture.imageUrl ? (
                    <img
                      src={capture.imageUrl}
                      alt={capture.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                      <FileText size={24} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{capture.title}</h4>
                    <p className="text-sm text-gray-500 truncate">{capture.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(capture.url)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === capture.url ? (
                      <Check size={20} className="text-green-500" />
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleScrapeImages(capture.url)}
                    disabled={isLoading && scrapingUrl === capture.url}
                    className={`p-2 text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors ${
                      isLoading && scrapingUrl === capture.url ? 'opacity-50' : ''
                    }`}
                    title="Scrape images from this URL"
                  >
                    {isLoading && scrapingUrl === capture.url ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Image size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => onDeleteCapture(capture.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete page"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scraped Images */}
      {scrapedImages.length > 0 && (
        <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Scraped Images ({scrapedImages.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownloadImages(true)}
                disabled={isLoading || selectedImages.size === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
                Download Selected ({selectedImages.size})
              </button>
              <button
                onClick={() => handleDownloadImages(false)}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
                Download All
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {scrapedImages.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  selectedImages.has(image.url)
                    ? 'border-purple-500 shadow-lg scale-95'
                    : 'border-transparent hover:border-purple-200'
                }`}
                onClick={() => toggleImageSelection(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Scraped image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 bg-purple-500 transition-opacity ${
                    selectedImages.has(image.url) ? 'opacity-20' : 'opacity-0 hover:opacity-10'
                  }`}
                />
                <div
                  className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 transition-colors ${
                    selectedImages.has(image.url)
                      ? 'bg-purple-500 border-white'
                      : 'bg-white/80 border-gray-400'
                  }`}
                >
                  {selectedImages.has(image.url) && (
                    <Check className="w-full h-full p-1 text-white" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return mainContent;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full max-w-7xl h-[90vh] mx-4 bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <div className="flex justify-between items-center p-6 border-b border-purple-100">
          <h2 className="text-xl font-semibold text-gray-900">Page Captures</h2>
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
