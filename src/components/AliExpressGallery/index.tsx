import React, { useState } from 'react';
import { X, Plus, Copy, ExternalLink, Trash2, Search } from 'lucide-react';
import { Product } from '../../types';
import { formatDate } from '../../utils/dateFormat';
import { updateProduct as updateProductService } from '../../services/firebase';
import { MarketplacePriceInput } from '../MarketplacePriceInput';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import { useProductStore } from '@/store';
import Notification from '../Notification';
import CreditsInformation from '../credits/CreditsInformation';

interface AliExpressGalleryProps {
  product: Product;
  onUpdateProduct: (updates: Partial<Product>) => void;
  onClose: () => void;
  embedded?: boolean;
}

export function AliExpressGallery({
  product,
  onUpdateProduct,
  onClose,
  embedded = false,
}: AliExpressGalleryProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
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

  const handleAddLink = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    const credits = await getCredits(user?.uid, 'addReferenceSite');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    try {
      const now = new Date();
      const newUrl = url.trim();
      const links = [
        ...(product.aliExpress || []),
        {
          id: `link-${Date.now()}`,
          url: newUrl,
          type: 'aliexpress',
          createdAt: formatDate(now),
          updatedAt: formatDate(now),
        },
      ];

      const updatedProduct = await updateProductService(product.id, { aliExpress: links });
      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }
      const result = await updateCredits(user?.uid, 'addReferenceSite');
      setPackage(userPackage.plan, result.toString());
      onUpdateProduct({ aliExpress: links });
      setUrl('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add link');
    }
  };

  const handleUpdatePrice = async (price: number) => {
    try {
      const competitorPrices = {
        ...(product.competitorPrices || {}),
        aliexpress: price,
      };
      await updateProductService(product.id, { competitorPrices });
      onUpdateProduct({ competitorPrices });
    } catch (error) {
      console.error('Failed to update price:', error);
      throw error;
    }
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

  const handleDeleteLink = async (linkId: string) => {
    try {
      const links = (product.aliExpress || []).filter(link => link.id !== linkId);
      const updatedProduct = await updateProductService(product.id, { aliExpress: links });
      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }
      onUpdateProduct({ aliExpress: links });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete link');
    }
  };

  const mainContent = (
    <div className="p-6 space-y-6 h-[70vh]">
      <div className="bg-white/80 rounded-xl p-4 border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <MarketplacePriceInput
            currentPrice={product.competitorPrices?.aliexpress || 0}
            onSave={handleUpdatePrice}
            marketplace="AliExpress"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Enter AliExpress URL"
              className="w-full pl-10 rounded-lg border-purple-200 bg-white focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleAddLink}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Link
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <X size={20} />
            {error}
          </div>
        )}
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 gap-4">
        {(product.aliExpress || [])
          .filter(link => link.type === 'aliexpress')
          .map(link => (
            <div
              key={link.id}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-200 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 truncate mr-4">
                  <p className="text-gray-900 truncate">{link.url}</p>
                  <p className="text-sm text-gray-500">Added {link.createdAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(link.url)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === link.url ? (
                      <span className="text-green-500">Copied!</span>
                    ) : (
                      <Copy size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => window.open(link.url, '_blank')}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Open link"
                  >
                    <ExternalLink size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete link"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}

        {(!product.aliExpress ||
          product.aliExpress.filter(link => link.type === 'aliexpress').length === 0) && (
          <div className="text-center py-12 text-gray-500">No AliExpress links added yet</div>
        )}
      </div>
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
          <h2 className="text-xl font-semibold text-gray-900">AliExpress Links</h2>
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
