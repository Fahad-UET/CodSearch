import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product, Task } from '../types';
import { PieChart, Package, TestTube, Brush, Laptop, ListOrdered } from 'lucide-react';
import { getFlagUrl, COUNTRIES, NORTH_AFRICA_COUNTRIES } from '@/services/codNetwork';

import { ImageOverlayButtons } from './ProductCard/components/ImageOverlayButtons';
import {
  GripVertical,
  Edit,
  Trash2,
  ImageOff,
  FileText,
  StickyNote,
  Star,
  ArrowRight,
  Package2,
  ShoppingBag,
  ExternalLink,
  ShoppingCart,
  MoreVertical,
  Target,
} from 'lucide-react';
import { EditProductModal } from './EditProductModal';
import { PhotoGallery } from './PhotoGallery';
import { VideoGallery } from './VideoGallery';
import { VoiceOverTab } from './VoiceOverTab';
import { PageCapturesGallery } from './PageCapturesGallery';
import { LinkGallery } from './LinkGallery';
import { ShareModal } from './ShareModal';
import { ProductDetailsModal } from './ProductDetailsModal';
import { ProductNotes } from './ProductNotes';
import { PriceManager } from './PriceManager';
import { RatingQuestionnaire } from './RatingQuestionnaire';
import { AdCopy } from './AdCopy';
import { CrashTestModal } from './CrashTest/CrashTestModal';
import { useProductStore } from '../store';
import { useRatingStore } from '../store/ratingStore';
import { createPortal } from 'react-dom';
import { GallerySection } from './ProductCard/GallerySection';
import { PriceSection } from './ProductCard/PriceSection';
import { ActionButtons } from './ProductCard/ActionButtons';
import { TaskList } from './ProductCard/TaskList';
import { BoardSelectionMenu } from './BoardSelectionMenu';
import { ProfitDisplay } from './ProductCard/ProfitDisplay';
import {
  deleteProduct as deleteProductService,
  updateProduct as updateProductService,
} from '../services/firebase';
import { useLanguageStore } from '../store/languageStore';

const CATEGORY_CONFIG = {
  PRODUCT_SELLER: {
    icon: Package2,
    color: 'bg-purple-500',
    textColor: 'text-purple-700',
    lightColor: 'bg-purple-50',
    label: 'Seller',
  },
  PRODUCT_DROP: {
    icon: ShoppingBag,
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    lightColor: 'bg-blue-50',
    label: 'Drop',
  },
  PRODUCT_AFFILIATE: {
    icon: ExternalLink,
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    lightColor: 'bg-orange-50',
    label: 'Affiliate',
  },
};

interface ProductCardProps {
  product: Product;
  // makes this optional bcz if ts issue
  listIndex?: number;
  verticalIndex?: number;
  role?: string;
}

export function ProductCard({ product, listIndex, verticalIndex = 0, role }: ProductCardProps) {
  const [metrics, setMetrics] = useState({
    availableStock: 100,
    sellingPrice: 53,
    purchasePrice: 8,
    baseCPL: 5,
    baseConfirmationRate: 50,
    baseDeliveryRate: 45,
    deliveryServiceCosts: 0, // Removed from UI but kept for calculations
    monthlyFixedCosts: 0, // Removed from UI but kept for calculations
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const [showLinkGallery, setShowLinkGallery] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [galleryTabOnly, setGalleryTabOnly] = useState({
    status: false,
    tab: '',
  });
  const [showPriceManager, setShowPriceManager] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showCrashTest, setShowCrashTest] = useState(false);
  const [crashTab, setCrashTab] = useState({ status: false, tab: '' });
  const [showPageCaptures, setShowPageCaptures] = useState(false);
  const [showAdCopy, setShowAdCopy] = useState(false);
  const [showVoiceOver, setShowVoiceOver] = useState(false);
  const [showBoardMenu, setShowBoardMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [tabOnly, setTabOnly] = useState({
    status: false,
    tab: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const { t, language } = useLanguageStore();

  const { updateProduct, deleteProduct } = useProductStore();
  const { getProductRatingAnswers, updateProductRatingAnswers } = useRatingStore();
  const shouldDisableDrag = useMemo(() => {
    return (
      showEditModal ||
      showPhotoGallery ||
      showVideoGallery ||
      showLinkGallery ||
      showShareModal ||
      showDetailsModal ||
      galleryTabOnly.status ||
      showPriceManager ||
      showNotes ||
      showRating ||
      showCrashTest ||
      crashTab.status ||
      showPageCaptures ||
      showAdCopy ||
      showVoiceOver ||
      showBoardMenu ||
      showDeleteConfirm ||
      tabOnly.status ||
      showDropdown
    );
  }, [
    showEditModal,
    showPhotoGallery,
    showVideoGallery,
    showLinkGallery,
    showShareModal,
    showDetailsModal,
    galleryTabOnly.status,
    showPriceManager,
    showNotes,
    showRating,
    showCrashTest,
    crashTab.status,
    showPageCaptures,
    showAdCopy,
    showVoiceOver,
    showBoardMenu,
    showDeleteConfirm,
    isFocused,
    tabOnly.status,
    showDropdown,
  ]);
  // Returns true if any of the states are true

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
    data: {
      type: 'product',
    },
  });

  const activeListeners = useMemo(() => {
    const activeListeners = shouldDisableDrag ? undefined : listeners;
    return activeListeners;
  }, [shouldDisableDrag]);

  const advertisingCosts = product?.price?.advertisement?.totalAdvertisementCost;
  const stockCosts = product?.price?.companyServicesFee?.totalProductCost;
  const callCenterCosts = product?.price?.companyServicesFee?.totalCallCenterFees;
  const deliveryCosts = product?.price?.companyServicesFee?.shippingCost;
  const returnCosts = product?.price?.companyServicesFee?.totalReturnCost;
  const codFees = product?.price?.companyServicesFee?.totalCodFees;
  const totalReturnCost = product?.price?.companyServicesFee?.totalReturnCost;
  const totalProductCost = product?.price?.companyServicesFee?.totalProductCost;

  const shippingCost = Math.round(product?.price?.companyServicesFee?.shippingCost || 0);
  const stock = product?.price?.stock || 1; // Avoid division by zero

  const costPerStock = stock > 0 ? (totalReturnCost + shippingCost) / stock : 0;
  const calculatedValues = useMemo(() => {
    if (!product?.price?.stock || product?.price?.stock <= 0) return 0;

    const stock = product.price.stock;

    const monthlyCharges = product.price.monthlyProductCharges
      ? Number((product.price.monthlyProductCharges / stock).toFixed(2))
      : 0;

    const advertising = advertisingCosts ? Number((advertisingCosts / stock).toFixed(2)) : 0;

    const cod = codFees ? Number((codFees / stock).toFixed(2)) : 0;

    const callCenter = callCenterCosts ? Number((callCenterCosts / stock).toFixed(2)) : 0;

    const delivery = deliveryCosts ? Number((deliveryCosts / stock).toFixed(2)) : 0;

    return monthlyCharges + advertising + cod + callCenter + delivery;
  }, [product, advertisingCosts, codFees, callCenterCosts, deliveryCosts]);
  const totalCompletedTasks = product?.tasks?.filter(task => task.completed).length;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const categoryConfig = product.category
    ? CATEGORY_CONFIG[product.category]
    : CATEGORY_CONFIG.PRODUCT_SELLER;

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleDelete = async () => {
    try {
      if (showDeleteConfirm) {
        await deleteProduct(product.id);
        await deleteProductService(product.id);
      } else {
        setShowDeleteConfirm(true);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleRatingSubmit = async (answers: Record<string, number>) => {
    const rating = updateProductRatingAnswers(product.id, answers);
    await updateProduct(product.id, { rating });
    setShowRating(false);
  };

  const rating = useRatingStore(state => state.ratings[product.id]?.rating || 0);
  const notesCount = product.notes?.length || 0;

  const sourcePrice =
    product?.category === 'PRODUCT_SELLER'
      ? Number(product?.price?.sourcingPrice || 0).toFixed(0)
      : product.category === 'PRODUCT_AFFILIATE'
      ? Number(product?.price?.comission || 0).toFixed(0)
      : product.category === 'PRODUCT_DROP'
      ? Number(product?.price?.purchasePrice || 0).toFixed(0)
      : null;

  const title =
    product?.category === 'PRODUCT_SELLER'
      ? 'Sourcing Price'
      : product?.category === 'PRODUCT_AFFILIATE'
      ? 'Commission'
      : product?.category === 'PRODUCT_DROP'
      ? 'Purchase Price'
      : 'Unknown';
  const flag =
    product?.category === 'ECOM_LOCAL'
      ? NORTH_AFRICA_COUNTRIES[product?.country]?.flag
      : COUNTRIES[product?.country]?.flag || 'https://flagcdn.com/w320/sa.png';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-xl overflow-hidden transform-gpu transition-all duration-200 ease-out group ${
        language === 'ar' ? 'text-right' : 'text-left'
      } ${
        product.category === 'PRODUCT_SELLER'
          ? 'bg-gradient-to-br from-purple-50/80 via-white to-purple-100/50 border-4 border-purple-500/30 shadow-[0_10px_30px_-10px_rgba(168,85,247,0.4)] hover:shadow-[0_20px_50px_-12px_rgba(168,85,247,0.5)]'
          : product.category === 'PRODUCT_DROP'
          ? 'bg-gradient-to-br from-blue-50/80 via-white to-blue-100/50 border-4 border-blue-500/30 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.4)] hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.5)]'
          : product.category === 'PRODUCT_AFFILIATE'
          ? 'bg-gradient-to-br from-orange-50/80 via-white to-orange-100/50 border-4 border-orange-500/30 shadow-[0_10px_30px_-10px_rgba(249,115,22,0.4)] hover:shadow-[0_20px_50px_-12px_rgba(249,115,22,0.5)]'
          : 'bg-gradient-to-br from-gray-50/80 via-white to-gray-100/50 border-4 border-gray-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)]'
      } ${
        isFocused
          ? 'ring-4 ring-opacity-50 ' +
            (product?.category === 'PRODUCT_SELLER'
              ? 'ring-purple-200 shadow-[0_20px_40px_-12px_rgba(168,85,247,0.25),0_15px_25px_-7px_rgba(168,85,247,0.15)]'
              : product?.category === 'PRODUCT_DROP'
              ? 'ring-blue-200 shadow-[0_20px_40px_-12px_rgba(59,130,246,0.25),0_15px_25px_-7px_rgba(59,130,246,0.15)]'
              : product?.category === 'PRODUCT_AFFILIATE'
              ? 'ring-orange-200 shadow-[0_20px_40px_-12px_rgba(249,115,22,0.25),0_15px_25px_-7px_rgba(249,115,22,0.15)]'
              : product?.category === 'ECOM_LOCAL'
              ? 'ring-orange-200 shadow-[0_20px_40px_-12px_rgba(249,115,22,0.25),0_15px_25px_-7px_rgba(249,115,22,0.15)]'
              : 'ring-gray-200')
          : ''
      } ${categoryConfig?.lightColor}`}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      role="article"
      aria-label={`${t('productName')}: ${product.title}`}
      {...attributes}
      {...activeListeners}
    >
      {/* Category Badge */}
      {product.purchasePrice > 0 && product.salePrice > 0 && (
        <ProfitDisplay purchasePrice={product.purchasePrice} salePrice={product.salePrice} />
      )}
      {/* <div
        className={`absolute top-2 left-2 z-20 px-2 py-1 rounded-lg bg-white shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.08)] transform-gpu hover:scale-105 transition-all ${
          product.category === 'PRODUCT_SELLER'
            ? 'text-purple-700'
            : product.category === 'PRODUCT_DROP'
            ? 'text-blue-700'
            : product.category === 'PRODUCT_AFFILIATE'
            ? 'text-orange-700'
            : 'text-gray-700'
        } text-xs font-medium flex items-center gap-1.5`}
      >
        <categoryConfig.icon size={14} />
        {t(product.category?.toLowerCase().replace('product_', '') || 'productSeller')}
        <span className="mx-2 text-gray-700 truncate max-w-[150px]">{product.title}</span>
      </div> */}

      {/* Top Action Bar */}
      <div className="absolute z-50 left-0 top-1 right-0 px-2 pt-[6px] justify-between items-center gap-1 transform-gpu  flex transition-all duration-200 ease-out invisible group-hover:visible">
        <div className="flex items-center bg-white/90 rounded-full px-2 py-1 shadow-sm">
          <span className="bg-purple-100 text-purple-600 p-1 rounded-full mr-2">
            <img src={flag} alt="US" className="w-5 h-4 rounded-sm object-cover" />
          </span>
          <span className="text-xs font-medium text-gray-900">
            {' '}
            {t(product.category?.toLowerCase().replace('product_', '') || 'productSeller')}
          </span>
          <span className="mx-1 text-gray-300">|</span>
          <div className="flex items-center space-x-1">
            {product?.productType === 'Cosmetic' && <Brush className="w-5 h-4 text-[#ec8cbc]" />}
            {product?.productType === 'Gadget' && <Laptop className="w-5 h-4 text-[#ec8cbc]" />}
            <span className="text-xs text-gray-600 pr-2">{product.title}</span>
          </div>
        </div>
        <div className="relative z-[90000]">
          {/* GripVertical Button */}
          <button
            className="p-1 bg-white/90 text-gray-600 hover:text-gray-900 rounded-2xl shadow-sm backdrop-blur-sm z-50"
            onClick={e => {
              e.stopPropagation();
              setShowDropdown(prev => !prev); // Toggle dropdown visibility
            }}
            title="Show Menu"
          >
            <MoreVertical size={15} />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-[70000]">
              <button
                onClick={() => {
                  setShowDropdown(false); // Close dropdown
                  setShowBoardMenu(true); // Trigger Move to Board functionality
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <ArrowRight size={16} />
                Move to Board
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowDropdown(false); // Close dropdown
                  setShowEditModal(true); // Trigger Edit functionality
                }}
                className={`w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 ${
                  role === 'editor' ? 'hidden' : ''
                }`}
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleDelete(); // Trigger Delete functionality

                  setShowDropdown(false); // Close dropdown
                }}
                className={`w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${
                  role === 'owner' ? '' : 'hidden'
                }`}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {/* SWOT IIA */}
      <div className="absolute left-3 top-14  gap-1.5 z-30 flex transition-all duration-200 ease-out invisible group-hover:visible">
        {/* SWOT Section */}
        <div className="bg-white/90 rounded-lg px-2 py-0.5 shadow-sm group relative min-w-[60px] text-center">
          <div className="text-xs text-purple-600 font-bold">
            {product?.metrics?.swotScore || 0}
          </div>
          <div className="text-[10px] font-medium text-gray-600">SWOT</div>
          <div className="absolute -right-1 -top-1 invisible group-hover:visible transition-opacity duration-200 flex gap-1">
            <button className="p-1 rounded-full bg-white shadow-lg hover:bg-purple-600 hover:text-white transition-colors">
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
                className="lucide lucide-help-circle w-3 h-3"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* AIDA Section */}
        <div className="bg-white/90 rounded-lg px-2 py-0.5 shadow-sm group relative min-w-[60px] text-center">
          <div className="text-xs text-indigo-600 font-bold">
            {product?.metrics?.aidaScore || 0}
          </div>
          <div className="text-[10px] font-medium text-gray-600">AIDA</div>
          <div className="absolute -right-1 -top-1 transition-all duration-200 ease-out invisible group-hover:visible  flex gap-1">
            <button className="p-1 rounded-full bg-white shadow-lg hover:bg-indigo-600 hover:text-white transition-colors">
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
                className="lucide lucide-help-circle w-3 h-3"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Custom Section */}
        <div className="bg-white/90 rounded-lg px-2 py-0.5 shadow-sm group relative min-w-[60px] text-center">
          <div className="text-xs text-emerald-600 font-bold">0</div>
          <div className="text-[10px] font-medium text-gray-600">Custom</div>
          <div className="absolute -right-1 -top-1 transition-all duration-200 ease-out invisible group-hover:visible flex gap-1">
            <button className="p-1 rounded-full bg-white shadow-lg hover:bg-emerald-600 hover:text-white transition-colors">
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
                className="lucide lucide-help-circle w-3 h-3"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-[230px]">
        {/* Collapse Toggle Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full shadow-lg z-20 hover:shadow-xl  invisible group-hover:visible"
        >
          <ArrowRight
            size={16}
            className={`text-gray-600 transform transition-transform duration-300 ${
              isCollapsed ? '-rotate-90' : 'rotate-90'
            }`}
          />
        </button>
        <button className="text-base capitalize text-white font-medium absolute -bottom-8 left-0  p-2 bg-[#1c1c20] shadow-lg z-20 hover:shadow-xl   visible group-hover:invisible w-full text-start flex justify-between items-center">
          <span> {product?.title} </span>
          <div className="flex gap-4 items-center">
            <img src={flag} alt="US" className="w-8 h-5 rounded-sm object-cover" />
            <div className="bg-white/90 p-1.5 rounded-full">
              {product?.productType === 'Gadget' ? (
                <Laptop className="w-4 h-4 text-blue-500" />
              ) : (
                <Brush className="w-4 h-4 text-pink-500" />
              )}
            </div>
          </div>
        </button>
        {/* Collapse Toggle Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full shadow-lg z-20 hover:shadow-xl transition-all duration-200 ease-out invisible group-hover:visible"
        >
          <ArrowRight
            size={16}
            className={`text-gray-600 transform transition-transform duration-300 ${
              isCollapsed ? 'rotate-90' : '-rotate-90'
            }`}
          />
        </button>

        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-6 h-6 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10 invisible  group-hover:visible"></div>
        <div className="absolute  inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.2)_50%,transparent_100%)] z-10 invisible  group-hover:visible"></div>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex transition-all duration-200 ease-out invisible group-hover:visible flex-col gap-2  z-[20000] ">
          <button
            onClick={() => {
              setShowPriceManager(true);
            }}
            className="bg-emerald-600/90 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 flex justify-center"
          >
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
              className="lucide lucide-dollar-sign w-5 h-5"
            >
              <line x1="12" x2="12" y1="2" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </button>

          <button
            onClick={() => setShowDetailsModal(true)}
            className="bg-purple-600/90 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 flex justify-center"
          >
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
              className="lucide lucide-file-text w-5 h-5"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
              <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              <path d="M10 9H8"></path>
              <path d="M16 13H8"></path>
              <path d="M16 17H8"></path>
            </svg>
          </button>

          <button
            onClick={() => {
              setShowPriceManager(true);
              setTabOnly({ status: true, tab: 'calculations' });
            }}
            className="bg-blue-600/90 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200"
          >
            <TestTube />
          </button>
        </div>
        {/* bottom card  */}
        <div className="absolute bottom-3 left-0 right-0 z-[1000] transition-all duration-200 ease-out invisible group-hover:visible">
          <div className="flex flex-col gap-1.5">
            {/* l=row first*/}
            <div className="flex gap-1">
              <div className="flex items-center gap-1 bg-red-600 px-2 py-1 rounded-lg w-max">
                <ListOrdered className="w-3 h-3 text-white" />
                <span className="text-xs font-medium text-white">{`Task ${totalCompletedTasks}/${product?.tasks?.length}`}</span>
              </div>
              <div className="flex items-center gap-1 bg-purple-500/90 px-2 py-1 rounded-lg w-fit relative group/item">
                <span className="text-white font-medium text-sm">SP</span>

                <span className="text-xs font-medium text-white">{`${
                  product?.price?.salePriceCountry || 0
                } / ${Math.round(product?.price?.salePrice) || 0} $`}</span>
                <div className="bg-black absolute -bottom-[22px] left-0 text-xs text-white w-max p-1 rounded-lg invisible group-hover/item:visible z-50">
                  <span>Selling Price</span>
                </div>
              </div>
            </div>
            {/*secound  */}
            <div className="flex items-center justify-start gap-1.5">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-emerald-600 px-2 py-1 rounded-lg relative group/item">
                  <span className="text-white font-medium text-sm">PPD</span>
                  <span className="text-xs font-medium text-white">
                    $ {product?.price?.profitPerProduct?.toFixed(2)}
                  </span>
                  <div className="bg-black absolute -bottom-[22px] left-0 text-xs text-white w-max p-1 rounded-lg invisible group-hover/item:visible z-50">
                    <span>Profit Per Delivered</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-green-500/90 px-2 py-1 rounded-lg relative group/item">
                  <span className="text-white font-medium text-sm">ROI</span>
                  <span className="text-xs font-medium text-white">
                    {product?.price?.roiPercentage} %
                  </span>
                  <div className="bg-black absolute -bottom-[22px] left-0 text-xs text-white w-max p-1 rounded-lg invisible group-hover/item:visible z-50">
                    <span>Return on Investment</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-blue-500/90 px-2 py-1 rounded-lg relative group/item">
                  <span className="text-white font-medium text-sm">PM</span>
                  <span className="text-xs font-medium text-white">
                    {product?.price?.profitMargin} %
                  </span>
                  <div className="bg-black absolute -bottom-[22px] left-0 text-xs text-white w-max p-1 rounded-lg invisible group-hover/item:visible z-50">
                    <span>Profit Margin</span>
                  </div>
                </div>
              </div>
            </div>

            {/* third row  */}
            <div className="flex items-center justify-start gap-1.5">
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg relative group/item">
                {/* <span className="text-white font-medium text-sm">PPD</span> */}
                <span className="text-xs font-medium text-red-400">
                  CPD $ ${(advertisingCosts / metrics.availableStock || 0).toFixed(2)}
                </span>
                <div className="bg-black absolute -bottom-[22px] left-0 text-xs text-white w-max p-1 rounded-lg invisible group-hover/item:visible">
                  <span>Cost Per Delivered</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg relative group/item">
                {/* <span className="text-white font-medium text-sm">ROI</span> */}
                <span className="text-xs font-medium text-red-400">
                  CPL ${product?.price?.cpl || 0}
                </span>
                <div className="bg-black absolute -bottom-[22px] left-0 text-xs text-white w-max p-1 rounded-lg invisible group-hover/item:visible">
                  <span>Cost Per Lead</span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-lg relative group/item">
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
                  className="lucide lucide-circle-dollar-sign w-3 h-3 text-red-400"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                  <path d="M12 18V6"></path>
                </svg>
                <span className="text-xs font-medium text-red-400">
                  TCPD ${calculatedValues.toFixed(2) || 0}
                </span>
                <div className="bg-black absolute -bottom-[22px] left-0 text-xs text-white w-max p-1 rounded-lg invisible group-hover/item:visible">
                  <span>Total Cost Per Delivered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {(product?.thumbnail || product?.images?.length > 0) && !imageError ? (
          <img
            src={product?.thumbnail?.image || product?.images?.[0]?.url}
            alt="product image"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <ImageOff size={24} />
            <span className="text-xs mt-1">
              {language === 'ar' ? t('noImageAr') : t('noImage')}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        className={`p-4 space-y-3 bg-white transform-gpu transition-all duration-200 ease-out shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] origin-top ${
          isCollapsed ? 'h-0 p-0 opacity-0 overflow-hidden scale-y-0' : 'scale-y-100'
        }`}
      >
        {/* <div>
          <h3 className="font-medium text-gray-900 text-base line-clamp-1 text-center mt-5">
            {product.title}
          </h3>
        </div> */}

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between border-t border-gray-100/50 pt-2">
          <ActionButtons
              // added this props as ActionButtons recive this if there is any issue then implement this
            onFilesClick={() => {console.log('onfilesClick')}}
            product={product}
              // comment this code bcz ActionButtons doesn't take these props
            // rating={rating}
            // notesCount={notesCount}
            onNotesClick={() => setShowNotes(true)}
            onPriceClick={() => setShowPriceManager(true)}
            onRatingClick={() => setShowRating(true)}
            onGalleryClick={() => {
              setShowDetailsModal(true);
            }}
            onPhotoClick={() => {
              setShowDetailsModal(true);
              setGalleryTabOnly({ status: true, tab: 'photos' });
            }}
            onVideoClick={() => {
              setShowDetailsModal(true);
              setGalleryTabOnly({ status: true, tab: 'videos' });
            }}
            onAdTestingClick={() => setShowPriceManager(true)}
            onPageCapturesClick={() => setShowPageCaptures(true)}
            onAdCopyClick={() => setShowAdCopy(true)}
            onVoiceOverClick={() => setShowVoiceOver(true)}
            onStatsClick={() => setShowPriceManager(true)}
            onAliExpressClick={() => {
              setShowDetailsModal(true);
              setGalleryTabOnly({ status: true, tab: 'aliexpress' });
            }}
            onAlibabaClick={() => {
              setShowDetailsModal(true);
              setGalleryTabOnly({ status: true, tab: 'alibaba' });
            }}
            onAmazonClick={() => {
              setShowDetailsModal(true);
              setGalleryTabOnly({ status: true, tab: 'amazon' });
            }}
            onOtherSitesClick={() => {
              setShowDetailsModal(true);
              setGalleryTabOnly({ status: true, tab: 'other' });
            }}
            onSevenGalleryClick={() => {
              setShowDetailsModal(true);
              setGalleryTabOnly({ status: true, tab: '1688' });
            }}
            setTabOnly={setTabOnly}
            onSwotClick={() => {
              setCrashTab({ status: true, tab: 'swot' });
            }}
            onQuestionaireClick={() => {
              setCrashTab({ status: true, tab: 'questionaire' });
            }}
            onBrainCut={() => setCrashTab({ status: true, tab: 'aida' })}
            // className="bg-gradient-to-r from-pink-50 to-rose-50 p-2 rounded-lg shadow-sm"
          />
        </div>
        {/* Tasks Section */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <TaskList
            tasks={product.tasks || []}
            onAddTask={async text => {
              const newTask: Task = {
                id: `task-${Date.now()}`,
                text,
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              };

              const updatedTasks = [...(product.tasks || []), newTask];
              await updateProductService(product.id, { tasks: updatedTasks });
              updateProduct(product.id, { tasks: updatedTasks });
            }}
            onToggleTask={async taskId => {
              const updatedTasks = (product.tasks || []).map(task =>
                task.id === taskId
                  ? { ...task, completed: !task.completed, updatedAt: new Date() }
                  : task
              );
              await updateProductService(product.id, { tasks: updatedTasks });
              updateProduct(product.id, { tasks: updatedTasks });
            }}
            onDeleteTask={async taskId => {
              const updatedTasks = (product.tasks || []).filter(task => task.id !== taskId);
              await updateProductService(product.id, { tasks: updatedTasks });
              updateProduct(product.id, { tasks: updatedTasks });
            }}
          />
        </div>
      </div>

      {/* Modals */}
      {showEditModal &&
        createPortal(
          <EditProductModal product={product} onClose={() => setShowEditModal(false)} />,
          document.body
        )}

      {showPhotoGallery &&
        createPortal(
          <PhotoGallery
            images={product.images || []}
            product={product}
            onClose={() => setShowPhotoGallery(false)}
          />,
          document.body
        )}

      {showVideoGallery &&
        createPortal(
          <VideoGallery
            videos={product.videoLinks || []}
            product={product}
            onClose={() => setShowVideoGallery(false)}
          />,
          document.body
        )}

      {showLinkGallery &&
        createPortal(
          <LinkGallery
            productId={''}
            links={product.links || []}
            onAddLink={() => {}}
            onEditLink={() => {}}
            onDeleteLink={() => {}}
            onClose={() => setShowLinkGallery(false)}
            onEditDownload={() => {}}
          />,
          document.body
        )}

      {showShareModal &&
        createPortal(
          <ShareModal product={product} onClose={() => setShowShareModal(false)} />,
          document.body
        )}

      {(showDetailsModal || galleryTabOnly.status) &&
        createPortal(
          <ProductDetailsModal
            galleryTabOnly={galleryTabOnly}
            product={product}
            onClose={() => {
              setShowDetailsModal(false);
              setGalleryTabOnly({ status: false, tab: '' });
            }}
          />,
          document.body
        )}

      {showPriceManager &&
        createPortal(
          <PriceManager
            product={product}
            setTabOnly={setTabOnly}
            productId={product.id}
            purchasePrice={product.purchasePrice}
            salePrice={product.salePrice}
            competitorPrices={product.competitorPrices}
            onUpdatePrices={async updates => {
              await updateProduct(product.id, updates);
              setShowPriceManager(false);
            }}
            onClose={() => setShowPriceManager(false)}
            tabOnly={tabOnly}
          />,
          document.body
        )}

      {showNotes &&
        createPortal(
          <ProductNotes
            productId={product.id}
            notes={product.notes || []}
            onAddNote={async note => {
              try {
                const formatDate = (date: Date) => {
                  const day = date.getDate();
                  const month = date.getMonth() + 1;
                  const year = date.getFullYear();
                  const hours = date.getHours();
                  const minutes = date.getMinutes();
                  const seconds = date.getSeconds();
                  const ampm = hours >= 12 ? 'PM' : 'AM';
                  const formattedHours = hours % 12 || 12;
                  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

                  return `${month}/${day}/${year}, ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
                };

                const now = new Date();
                const newNote = {
                  ...note,
                  id: `note-${Date.now()}`,
                  created: formatDate(now),
                  updatedAt: formatDate(now),
                };

                await updateProductService(product.id, {
                  notes: [...(product.notes || []), newNote],
                });
                updateProduct(product.id, {
                  notes: [...(product.notes || []), newNote],
                });
              } catch (err) {
                console.error(err);
              }
            }}
            onDeleteNote={async noteId => {
              const updatedNotes = (product.notes || []).filter(note => note.id !== noteId);
              await updateProductService(product.id, {
                notes: updatedNotes,
              });
              await updateProduct(product.id, {
                notes: updatedNotes,
              });
            }}
            onClose={() => setShowNotes(false)}
          />,
          document.body
        )}

      {showRating &&
        createPortal(
          <RatingQuestionnaire
            productId={product.id}
            initialAnswers={getProductRatingAnswers(product.id)}
            onClose={() => setShowRating(false)}
            onSubmit={handleRatingSubmit}
          />,
          document.body
        )}

      {(showCrashTest || crashTab.status) &&
        createPortal(
          <CrashTestModal
            product={product}
            onClose={() => {
              setShowCrashTest(false);
              setCrashTab({ status: false, tab: '' });
            }}
            crashTab={crashTab}
          />,
          document.body
        )}

      {showPageCaptures &&
        createPortal(
          <PageCapturesGallery
            product={product}
            captures={product.pageCaptures || []}
            onAddCapture={async capture => {
              const pageCaptures = [...(product.pageCaptures || []), capture];
              await updateProductService(product.id, { pageCaptures });
              updateProduct(product.id, { pageCaptures });
            }}
            onEditCapture={async (id, updates) => {
              const pageCaptures =
                product.pageCaptures?.map(capture =>
                  capture.id === id ? { ...capture, ...updates } : capture
                ) || [];
              await updateProductService(product.id, { pageCaptures });
              updateProduct(product.id, { pageCaptures });
            }}
            onDeleteCapture={async id => {
              const pageCaptures = product.pageCaptures?.filter(capture => capture.id !== id) || [];
              await updateProductService(product.id, { pageCaptures });
              updateProduct(product.id, { pageCaptures });
            }}
            onClose={() => setShowPageCaptures(false)}
          />,
          document.body
        )}

      {showBoardMenu &&
        createPortal(
          <BoardSelectionMenu productId={product.id} onClose={() => setShowBoardMenu(false)} />,
          document.body
        )}

      {showAdCopy &&
        createPortal(
          <AdCopy activeTabParen={product.id} product={product} />,
          document.body
        )}

      {showVoiceOver &&
        createPortal(
          <VoiceOverTab
            text={product.adCopy?.[0]?.description || ''}
            onClose={() => setShowVoiceOver(false)}
            savedTexts={product.adCopy}
          />,
          document.body
        )}
    </div>
  );
}
