import React, { useEffect, useState } from 'react';
import {
  X,
  Image,
  Globe,
  FileText,
  ShoppingBag,
  ShoppingCart,
  Store,
  AlertCircle,
  Sparkles,
  Layout,
  Clock,
  Copy,
  Clipboard,
  Save,
  LucideSearch,
} from 'lucide-react';
import { format, isValid } from 'date-fns';
import { Product } from '../types';
import { PhotoGallery } from './PhotoGallery';
import { LinkGallery } from './LinkGallery';
import { PageCapturesGallery } from './PageCapturesGallery';
import { AliExpressGallery } from './AliExpressGallery';
import { AlibabaGallery } from './AlibabaGallery';
import { AmazonGallery } from './AmazonGallery';
import { OneSevenGallery } from './OneSevenGallery';
import { OtherSitesGallery } from './OtherSitesGallery';
import { useProductStore } from '../store';
import { updateProduct as updateProductService } from '../services/firebase';
import { AdCopy } from './AdCopy/index';
import { useMemo } from 'react';
import NavGroup from './ProductDetailComponent/ProductDetailNavbar';
import ShopDropdown from './ProductDetailComponent/ShopDropdown';
import AiText from './AIText/AdCopyAi';
import AiVoiceOver from './AIVoiceOver/AiVoiceOver';
import AdCopyTab from './AIText/AdCopyTab';
import { color } from 'framer-motion';
import CodSearch from './updated/CodSearch/CodSearch';
import GenerateKeywords from './updated/GenerateKeywords/GenerateKeywords';
import Modal from './AIText/ui/Modal';
import CreditsModal from './CreditsModal';

interface ProductDetailsModalProps {
  product: any;
  onClose: () => void;
    // to resolve build issue please check this
  // galleryTabOnly?: { tab: string };
  galleryTabOnly?: { tab: string, status?: any };
}

export function ProductDetailsModal({
  product,
  onClose,
  galleryTabOnly,
}: ProductDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<any>(galleryTabOnly?.tab || 'photos');
  const [adText, setAdText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabStatus, setTabStatus] = useState({
    status: false,
    tab: '',
  });
  const updateProduct = useProductStore(state => state.updateProduct);
  const [isSearch, setIsSearch] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  const handleSave = async () => {
    if (!adText.trim() || !product.id) return;

    setIsSaving(true);
    setError(null);

    try {
      const newAdCopy = {
        id: `ad-${Date.now()}`,
        description: adText.trim(),
        createdAt: new Date(),
        tags: [],
        rating: 0,
        number: (product.adCopy?.length || 0) + 1,
      };

      const updatedAdCopy = [...(product.adCopy || []), newAdCopy];

      await updateProductService(product.id, { adCopy: updatedAdCopy });
      updateProduct(product.id, { adCopy: updatedAdCopy });

      setAdText('');
      setActiveTab('history');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ad copy');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(adText);
    } catch (err) {
      setError('Failed to copy text');
    }
  };

  const handlePaste = async () => {};

  const handleUpdateProduct = async (updates: Partial<Product>) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedProduct = await updateProductService(product.id, updates);
      if (!updatedProduct) {
        throw new Error('Failed to update product');
      }

      updateProduct(product.id, updates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const totalVideoLinks = (product.videoLinks?.length || 0) + (product.links?.length || 0);

  const formatUpdateDate = (date: Date | string | undefined) => {
    if (!date) return 'Never';

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';

    return format(dateObj, 'MMM d, yyyy');
  };

  const tabs = [
    {
      id: 'adcopy',
      label: 'Text Creator',
      icon: <Sparkles size={20} />,
      count: product.adCopy?.length || 0,
    },
    {
      id: 'photos',
      label: 'Pictures',
      icon: <Image size={20} />,
      count: product.images?.length || 0,
    },
    { id: 'videos', label: 'Videos', icon: <Globe size={20} />, count: totalVideoLinks },

    {
      id: 'landingpages',
      label: 'Landing Pages',
      icon: <Layout size={20} />,
      count: product.pageCaptures?.length || 0,
    },
    {
      id: 'aliexpress',
      label: 'AliExpress',
      icon: <ShoppingBag size={20} />,
      count: product?.aliExpress?.length || 0,
      price: product.competitorPrices?.aliexpress,
    },
    {
      id: 'alibaba',
      label: 'Alibaba',
      icon: <ShoppingCart size={20} />,
      count: product.aliBabaLink?.length,
      price: product.competitorPrices?.alibaba,
    },
    {
      id: '1688',
      label: '1688.com',
      icon: <Store size={20} />,
      count: product?.oneSix?.length || 0,
      price: product.competitorPrices?.oneSeven,
    },
    {
      id: 'amazon',
      label: 'Amazon',
      icon: <ShoppingBag size={20} />,
      count: product.amazon?.length || 0,
      price: product.competitorPrices?.amazon,
    },
    {
      id: 'other',
      label: 'Other Sites',
      icon: <Globe size={20} />,
      count: product.otherSite?.length || 0,
    },
  ] as const;

  const filteredTabs = useMemo(() => {
    if (galleryTabOnly?.status) {
      return tabs.filter(tab => tab.id === galleryTabOnly.tab);
    }
    return tabs;
  }, [galleryTabOnly, tabs]);

  const handlesearch = () => {
    setIsSearch(true);
  };

  return (
    <>
      <div
        className={`fixed ${
          isSearch
            ? 'w-screen h-screen top-0 left-0 z-[200] overflow-y-scroll'
            : ' inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md z-[200] flex items-center justify-center'
        } `}
      >
        {isSearch ? (
          <GenerateKeywords
            onBack={() => setIsSearch(false)}
            setIsSearch={setIsSearch}
            isProduct={true}
            product={product}
          />
        ) : (
          <div className="relative w-full max-w-[98%] h-[90vh] mx-4 bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-2xl overflow-y-auto overflow-x-hidden shadow-2xl border border-white/20">
            {/* Compact Header */}
            <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-b border-purple-100">
              <div className="relative flex flex-1 items-center gap-6" style={{ zIndex: '100000000000000000000000000000 !important' }}>
                <div className="relative flex flex-1 items-center" style={{ zIndex: '100000000000000000000000000000 !important' }}>
                  <h2 className="text-lg font-semibold text-gray-900">{product.title}</h2>

                  <div className="flex flex-1 items-center justify-center">
                    <input
                      type="text"
                      className="absolute bg-gradient-to-r to-purple-700 from-pink-600  rounded-full bg-purple-800 border-0 focus:ring-0 focus:outline-0 py-2.5 px-2 w-[400px]"
                    />
                    <button
                      onClick={handlesearch}
                      className="rounded-full relative p-1 left-44 bg-white"
                    >
                      <LucideSearch className="text-purple-600 " />
                    </button>
                    {/* {isSearch && <CodSearch />} */}
                  </div>

                  <div className="relative" style={{ zIndex: '100000000000000000000000000000 !important' }}>
                    <p
                      className="flex items-center gap-1 text-purple-500 cursor-pointer"
                      onMouseEnter={() => setShowCredits(true)}
                      // onMouseLeave={() => setShowCredits(false)}
                    >
                      Credits needed
                    </p>
                    <CreditsModal
                      showCredits={showCredits}
                      setShowCredits={() => setShowCredits(false)}
                    />
                  </div>

                  {/* <div className="flex items-center gap-4 mt-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                    ${typeof product.salePrice === 'number' ? product.salePrice.toFixed(2) : '0.00'}
                  </span>
                  <span className="text-gray-500">
                    Purchase: $
                    {typeof product.purchasePrice === 'number'
                      ? product.purchasePrice.toFixed(2)
                      : '0.00'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock size={14} />
                  <span>Updated {formatUpdateDate(product.updatedAt)}</span>
                </div>
              </div> */}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 mx-6 mt-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
            {!galleryTabOnly?.status && (
              <nav
                className={`${
                  !showCredits ? 'sticky' : ''
                } top-0 z-[10] bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg bg-opacity-90`}
              >
                <div className="w-full px-4 py-2">
                  <div className="flex items-center justify-between divide-x divide-white/10">
                    <NavGroup activeTab={activeTab} setActiveTab={setActiveTab} product={product} />
                    <ShopDropdown
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      product={product}
                      showCredits={showCredits}
                    />
                  </div>
                </div>
              </nav>
            )}

            {/* Tabs */}
            {/* <div className="flex border-b border-purple-100 bg-white/50">
          {filteredTabs.map(({ id, label, icon, count, price }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as Tab)}
              className={`${
                galleryTabOnly?.status ? '' : 'flex-1'
              } px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  {icon}
                  <span>{label}</span>
                  {count > 0 && (
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                      {count}
                    </span>
                  )}
                </div>
                {price !== undefined && (
                  <span className="text-xs font-medium text-gray-600">${price.toFixed(2)}</span>
                )}
              </div>
            </button>
          ))}
        </div> */}

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'photos' && (
                <PhotoGallery
                  images={product.images || []}
                  product={product}
                  onClose={() => setActiveTab('videos')}
                  embedded
                />
              )}

              {activeTab === 'videos' && (
                <LinkGallery
                  links={product.videoLinks || []}
                  onAddLink={async link => {
                    const videoLinks = [...(product.videoLinks || []), link];
                    await handleUpdateProduct({ videoLinks });
                  }}
                  onEditLink={async (id, updates) => {
                    const videoLinks =
                      product.videoLinks?.map(link =>
                        link.id === id ? { ...link, ...updates } : link
                      ) || [];
                    await handleUpdateProduct({ videoLinks });
                  }}
                  onDeleteLink={async id => {
                    const videoLinks = product.videoLinks?.filter(link => link.id !== id) || [];
                    await handleUpdateProduct({ videoLinks });
                  }}
                  onClose={() => setActiveTab('photos')}
                  embedded
                  productId={product.id}
                      /// to resolve build issue please check this add this
                  onEditDownload={(id: any, updates: any) => {}}
                />
              )}

              {activeTab === 'landingpages' && (
                <PageCapturesGallery
                  product={product}
                  captures={product.pageCaptures || []}
                  onAddCapture={async capture => {
                    const pageCaptures = [...(product.pageCaptures || []), capture];
                    await handleUpdateProduct({ pageCaptures });
                  }}
                  onEditCapture={async (id, updates) => {
                    const pageCaptures =
                      product.pageCaptures?.map(capture =>
                        capture.id === id ? { ...capture, ...updates } : capture
                      ) || [];
                    await handleUpdateProduct({ pageCaptures });
                  }}
                  onDeleteCapture={async id => {
                    const pageCaptures =
                      product.pageCaptures?.filter(capture => capture.id !== id) || [];
                    await handleUpdateProduct({ pageCaptures });
                  }}
                  onClose={() => setActiveTab('photos')}
                  embedded
                />
              )}

              {activeTab === 'adcopy' && <AdCopy product={product} activeTabParen={activeTab} />}
              {activeTab === 'variables' && (
                <div className="px-4 py-6">
                  {' '}
                  <AdCopy product={product} activeTabParen={activeTab} />
                </div>
              )}

              {activeTab === 'templates' && (
                <div className="px-4 py-6">
                  <AdCopy product={product} activeTabParen={activeTab} />
                </div>
              )}

              {activeTab === 'editor' && (
                <div className="space-y-6">
                  <AdCopy product={product} activeTabParen={activeTab} />

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleCopy}
                      className="p-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Copy size={20} />
                      <span className="font-medium">Copy</span>
                    </button>
                    <button
                      onClick={handlePaste}
                      className="p-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Clipboard size={20} />
                      <span className="font-medium">Paste</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!adText.trim() || isSaving}
                      className="p-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save size={20} />
                      <span className="font-medium">Save</span>
                    </button>
                  </div>

                  {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg">{error}</div>}
                </div>
              )}

              {activeTab === 'aliexpress' && (
                <AliExpressGallery
                  product={product}
                  onUpdateProduct={handleUpdateProduct}
                  onClose={() => setActiveTab('photos')}
                  embedded
                />
              )}

              {activeTab === 'alibaba' && (
                <AlibabaGallery
                  product={product}
                  onUpdateProduct={handleUpdateProduct}
                  onClose={() => setActiveTab('photos')}
                  embedded
                />
              )}

              {activeTab === '1688' && (
                <OneSevenGallery
                  product={product}
                  onUpdateProduct={handleUpdateProduct}
                  onClose={() => setActiveTab('photos')}
                  embedded
                />
              )}

              {activeTab === 'amazon' && (
                <AmazonGallery
                  product={product}
                  onUpdateProduct={handleUpdateProduct}
                  onClose={() => setActiveTab('photos')}
                  embedded
                />
              )}

              {activeTab === 'other' && (
                <OtherSitesGallery
                  product={product}
                  onUpdateProduct={handleUpdateProduct}
                  onClose={() => setActiveTab('photos')}
                  embedded
                />
              )}

              {activeTab === 'aiText' && (
                <AdCopyTab product={product} activeTabParent={activeTab} />
              )}
              {(activeTab === 'voice-over-review' ||
                activeTab === 'ad-copy' ||
                activeTab === 'customer-review' ||
                activeTab === 'voice-over-creative' ||
                activeTab === 'landing-page') && (
                <AdCopyTab product={product} activeTabParent={activeTab} />
              )}
              {activeTab === 'creatives' && (
                <AiVoiceOver product={product} activeTabParent={activeTab} />
              )}
              {activeTab === 'customerReviews' && (
                <AiVoiceOver product={product} activeTabParent={activeTab} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
