import React, { useState } from 'react';
import { X, Plus, AlertCircle, ArrowRight, Link as LinkIcon, Package2 } from 'lucide-react';
import { useProductStore } from '../store';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { SubscriptionPlans } from './SubscriptionPlans';
import { createPortal } from 'react-dom';
import { createProduct } from '../services/firebase/products';
import { countries } from '../utils/countries';

interface CreateProductModalProps {
  onClose: () => void;
  listId: string;
  boardId: string;
}

export function CreateProductModal({ onClose, listId, boardId }: CreateProductModalProps) {
  const { user } = useProductStore();
  const addProduct = useProductStore(state => state.addProduct);
  const products = useProductStore(state => state.getAllProducts());
  const { tiers, currentSubscription } = useSubscriptionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    descriptions: [''],
    images: [''],
    videoLinks: [''],
    voiceRecordings: [''],
    purchasePrice: 0,
    salePrice: 0,
    weight: 0,
    competitorPrices: {
      aliexpress: undefined,
      alibaba: undefined,
      amazon: undefined,
      noon: undefined,
      other: [],
    },
  });

  // Get current tier and check limits
  const currentTier = tiers.find(tier => tier.id === currentSubscription?.tierId);
  const productCount = products.length;
  const remainingProducts = currentTier ? currentTier.productLimit - productCount : 0;
  const canAddProduct = remainingProducts > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canAddProduct) {
      setShowUpgradeModal(true);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const userId = user?.uid;
    const productId = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const newProduct = await createProduct({
        userId,
        boardId,
        productId,
        title: formData.title,
        status: listId,
        images: formData.images.filter(Boolean),
        videoLinks: formData.videoLinks.filter(Boolean),
        voiceRecordings: formData.voiceRecordings.filter(Boolean),
        descriptions: formData.descriptions.filter(Boolean),
      });
      addProduct(newProduct);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl w-[80%] max-w-2xl shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-purple-100">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package2 size={24} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Add New Product</h2>
                  <p className="text-sm text-gray-500">Enter product details below</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Enter product title"
              />
            </div>

            {/* Target Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Country
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                name="country"
              >
                <option value="">Select a country...</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <div className="relative">
                <input
                  type="url"
                  className="w-full pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="Enter image URL"
                />
                <LinkIcon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => onClose()}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <Plus size={16} />
                Create Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}