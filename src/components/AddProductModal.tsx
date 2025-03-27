import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  AlertCircle,
  ArrowRight,
  Package2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useProductStore } from '../store';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { SubscriptionPlans } from './SubscriptionPlans';
import { createPortal } from 'react-dom';
import { createProduct } from '../services/firebase/products';
import { COUNTRIES, NORTH_AFRICA_COUNTRIES } from './../services/codNetwork/constants';
import { updateVideoUrl } from '@/services/firebase';
import { useShowStore } from '@/store/showStore';
import { getStoresByUserId } from '@/services/firebase/storeService';
import { createVariableDocument } from '@/services/firebase/variable';
import { DEFAULT_VARIABLES } from '@/data/defaultVariables';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import Notification from './Notification';
import CreditsInformation from './credits/CreditsInformation';
  // I make the listId and link optional here to remove ts errors for now in future check it properly it doesn't create any errors
interface AddProductModalProps {
  onClose: () => void;
  listId?: string;
  boardId: string;
  defaultCreation?: boolean;
  link?: any;
  setAds?: (status: any) => void;
}
type ProductCategory = 'PRODUCT_SELLER' | 'PRODUCT_DROP' | 'PRODUCT_AFFILIATE' | 'ECOM_LOCAL';
const PRODUCT_CATEGORIES = [
  {
    id: 'PRODUCT_SELLER' as ProductCategory,
    name: 'Product Seller',
    description: 'For products you sell directly',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag w-6 h-6 text-purple-500"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
    color: 'font-semibold text-gray-900 mb-1',
    lightColor: 'bg-orange-50',
    bg: 'bg-purple-50 border hover:ring-2 hover:ring-purple-500/5',
    textColor: 'font-semibold text-gray-900 mb-1',
  },
  {
    id: 'PRODUCT_DROP' as ProductCategory,
    name: 'Product Drop',
    description: 'For dropshipping products',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package w-6 h-6 text-blue-500"><path d="m7.5 4.27 9 5.15"></path><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>`,
    color: 'font-semibold text-gray-900 mb-1',
    lightColor: 'bg-blue-50',
    bg: 'bg-blue-50 border hover:ring-2 hover:ring-blue-500/50',
    textColor: 'font-semibold text-gray-900 mb-1',
  },
  {
    id: 'PRODUCT_AFFILIATE' as ProductCategory,
    name: 'Product Affiliate',
    description: 'For affiliate products',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link2 w-6 h-6 text-orange-500"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>`,
    color: 'font-semibold text-gray-900 mb-1',
    lightColor: 'bg-purple-50',
    bg: 'bg-orange-50 border hover:ring-2 hover:ring-orange-500/50',
    textColor: 'font-semibold text-gray-900 mb-1',
  },
  {
    id: 'ECOM_LOCAL' as ProductCategory,
    name: 'Product Local',
    description: 'For Ecom Local',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link2 w-6 h-6 text-orange-500"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>`,
    color: 'font-semibold text-gray-900 mb-1',
    lightColor: 'bg-purple-50',
    bg: 'bg-[#E9FAF4] border hover:ring-2 hover:bg-[#E9FAF4',
    textColor: 'font-semibold text-gray-900 mb-1',
  },
];

const productTypes = [
  { value: 'Cosmetic', label: 'Cosmetic' },
  { value: 'Gadget', label: 'Gadget' },
];

export function AddProductModal({
  onClose,
  listId,
  boardId,
  defaultCreation,
  link,
  setAds,
}: AddProductModalProps) {
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const addProduct = useProductStore(state => state.addProduct);
  const products = useProductStore(state => state.getAllProducts());
  const { tiers, currentSubscription } = useSubscriptionStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('PRODUCT_SELLER');
  const [countries, setCountries] = useState(COUNTRIES);
  const [store, setStore] = useState([]);
  const keys = Object.keys(countries);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    setCountries(selectedCategory === 'ECOM_LOCAL' ? NORTH_AFRICA_COUNTRIES : COUNTRIES);
  }, [selectedCategory]);
  React.useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const data = await getStoresByUserId(user.uid);
        setStore(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStoreDetails();
  }, []);
  const titleInputRef = useRef<HTMLInputElement>(null);
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
    store: store?.[0]?.id || '',
    competitorPrices: {
      aliexpress: undefined,
      alibaba: undefined,
      amazon: undefined,
      noon: undefined,
      other: [],
    },
    url: '',
    country: '',
    productType: 'Cosmetic',
  });
  useEffect(() => {
    setFormData(prevState => ({
      ...prevState,
      ['store']: store?.[0]?.id,
    }));
  }, [store]);

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Get current tier and check limits
  const currentTier = tiers.find(tier => tier.id === currentSubscription?.tierId);
  const productCount = products.length;
  const remainingProducts = currentTier ? currentTier.productLimit - productCount : 0;
  const canAddProduct = remainingProducts > 0;

  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canAddProduct) {
      setShowUpgradeModal(true);
      return;
    }

    const credits = await getCredits(user?.uid, 'addBoardProduct');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const userId = user?.uid;
    const productId = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const uniqueId = `text-${crypto.randomUUID()}`;
    const storeId = formData.store;

    const id = `capture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      if (defaultCreation) {
        const dataa = {
          order: products.length + 1,
          userId,
          boardId,
          productId,
          store: storeId || '',
          title: formData.title,
          status: listId,
          category: selectedCategory,
          images:
            link?.type && link?.type === 'images'
              ? [{ title: link.url, url: link.url, category: 'images' }]
              : [],
          videoLinks:
            link?.type && link?.type === 'video'
              ? [{ title: link.url, url: link.url, category: 'other' }]
              : [],
          pageCaptures:
            link?.type && link?.type === 'pageCaptures'
              ? [
                  {
                    id,
                    url: link?.url?.trim(),
                    title: link?.url?.trim(),
                    category: 'page',
                    rating: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ]
              : [],
          voiceRecordings: formData.voiceRecordings.filter(Boolean),
          descriptions: formData.descriptions.filter(Boolean),
          thumbnail: { image: formData.url, imageId: uniqueId },
          country: formData.country || (selectedCategory === 'ECOM_LOCAL' ? 'MAR' : 'KSA'),
          productType: formData.productType || 'Cosmetic',
        };
        const newProduct = await createProduct(dataa);
        addProduct(newProduct);
        const result = await updateCredits(user?.uid, 'addBoardProduct');
        setPackage(userPackage.plan, result.toString());
        setAds &&
          setAds(prev => prev.map(ad => (ad.id === link.id ? { ...ad, isMyProduct: true } : ad)));
        // const data = await updateVideoUrl(link.id, { isMyProduct: true });
        onClose();
      } else {
        const data2 = {
          order: products.length + 1,
          userId,
          boardId,
          productId,
          store: storeId || '',
          title: formData.title,
          status: listId,
          zone: 'normal',
          category: selectedCategory,
          images: formData.images.filter(Boolean),
          videoLinks: formData.videoLinks.filter(Boolean),
          voiceRecordings: formData.voiceRecordings.filter(Boolean),
          descriptions: formData.descriptions.filter(Boolean),
          thumbnail: { image: formData.url, imageId: uniqueId },
          country: formData.country || (selectedCategory === 'ECOM_LOCAL' ? 'MAR' : 'KSA'),
          productType: formData.productType || 'Cosmetic',
        };

        const newProduct = await createProduct(data2);

        await createVariableDocument(newProduct.id, [...DEFAULT_VARIABLES]);
        const result = await updateCredits(user?.uid, 'addBoardProduct');
        setPackage(userPackage.plan, result.toString());
        addProduct(newProduct);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-sm flex items-center justify-center z-[1000]">
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 p-6 -translate-y-1/2 w-[896px] h-[626px] rounded-3xl overflow-y-auto !bg-white">
          {/* title */}

          <div className="sticky top-0 z-[51] flex justify-between items-center border-b border-purple-100 bg-white/50 backdrop-blur-sm rounded-t-2xl">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-purple-600">Add New Product</h2>
              <p className="text-gray-600 mt-1">Select a category and enter product details</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          {error && <div className="p-4 mx-6 mt-6 bg-red-50 text-red-600 rounded-lg">{error}</div>}

          {!canAddProduct && (
            <div className="p-4 mx-6 mt-6 bg-yellow-50 text-yellow-800 rounded-lg flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Product Limit Reached</p>
                <p className="mt-1 text-sm">
                  You've reached the limit of {currentTier?.productLimit} products on your{' '}
                  {currentTier?.name} plan. Upgrade your plan to add more products.
                </p>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="mt-3 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                  Upgrade Plan
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className=" space-y-6 max-w-6xl mx-auto">
            {/* name input */}
            <div className="mb-8 mt-6">
              <div className="relative">
                <input
                  type="text"
                  required
                  ref={titleInputRef}
                  onKeyDown={e => {
                    if (e.key === ' ') {
                      // Stop event propagation to prevent card preview
                      e.stopPropagation();
                      e.preventDefault();
                      const cursorPosition = e.currentTarget.selectionStart;
                      const textBeforeCursor = formData.title.slice(0, cursorPosition);
                      const textAfterCursor = formData.title.slice(cursorPosition);
                      setFormData({ ...formData, title: textBeforeCursor + ' ' + textAfterCursor });
                      // Set cursor position after the space
                      setTimeout(() => {
                        if (titleInputRef.current) {
                          titleInputRef.current.selectionStart = cursorPosition + 1;
                          titleInputRef.current.selectionEnd = cursorPosition + 1;
                        }
                      }, 0);
                    }
                  }}
                  disabled={!canAddProduct}
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter your product name"
                  className="w-full px-6 py-4 text-2xl font-medium rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none placeholder:text-gray-400"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                  <span className="text-sm text-gray-400">Product Name</span>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-purple-600 mb-3">Product Category</label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {PRODUCT_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-xl border-2 transition-all  ${
                      selectedCategory === category.id
                        ? `${category.lightColor} ring-2 ring-purple-500 border-${
                            category.color.split(' ')[0]
                          } ${category.textColor}`
                        : 'border-gray-200 hover:   '
                    } ${category.bg}`}
                  >
                    <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: category.icon }} />
                    <h3 className="font-medium mt-2">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                  </button>
                ))}
              </div>
            </div>
            {/* image url */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Product Image URL Section */}
                <div>
                  <label className="block text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    Product Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={link?.type && link?.type === 'images' ? link.url : formData.url}
                    onChange={e => handleSelectChange(e, 'url')}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                  />
                </div>
                {/* Country Select */}
                <div>
                  <label className="block text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    Store <span className="text-red-500"></span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.store}
                      onChange={e => {
                        handleSelectChange(e, 'store');
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none appearance-none"
                    >
                      {store.map(option => (
                        <option value={option.id}>{option?.name}</option>
                      ))}
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-down w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </div>
                </div>
              </div>
              {/* Country and Product Type Section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Country Select */}
                <div>
                  <label className="block text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.country}
                      onChange={e => {
                        handleSelectChange(e, 'country');
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none appearance-none"
                    >
                      {keys.map(option => (
                        <option key={option} value={option}>
                          {countries?.[option]?.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-down w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </div>
                </div>

                {/* Product Type Select */}
                <div>
                  <label className="block text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.productType} // Bind productType to form state
                      onChange={e => handleSelectChange(e, 'productType')} // Update productType in form state
                      className="w-full px-4 py-2 rounded-xl border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none appearance-none"
                    >
                      {productTypes.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chevron-down w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <CreditsInformation creditType={'addBoardProduct'} />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-medium text-purple-700 bg-white rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-colors border border-purple-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !canAddProduct}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
        <Notification
          show={notification.show}
          type={notification.type}
          message={notification.message}
          setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      </div>

      {showUpgradeModal &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[10000]">
            <div className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 z-[101] flex justify-between items-center p-6 border-b bg-white">
                <h2 className="text-xl font-semibold">Upgrade Your Plan</h2>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>
              <SubscriptionPlans />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
