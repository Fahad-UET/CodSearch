import React from 'react';
import {
  // Competitor Analysis
  ShoppingBag,
  ShoppingCart,
  Store,
  Globe,
  BarChart2,
  // Ad Creatives
  Image,
  Video,
  FileText,
  Mic,
  Layout,
  // Ads & Prices
  DollarSign,
  Wallet,
  TestTube,
  Calculator,
  LineChart,
  // Info & Data
  StickyNote,
  Target,
  BrainCircuit,
  HardDrive,
  Database,
  MessageCircleQuestion,
} from 'lucide-react';

interface IconButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  length?: number;
}

const IconButton = ({ icon: Icon, label, onClick, length }: IconButtonProps) => (
  <button
    onClick={onClick}
    className="group relative flex flex-col items-center justify-center w-[60px] h-[60px] rounded-xl 
    bg-white/90 shadow-[0_4px_10px_rgba(79,70,229,0.1)] border border-purple-100/50
    hover:shadow-[0_12px_24px_rgba(79,70,229,0.2)] hover:border-purple-200
    hover:bg-white active:transform active:scale-95 transition-all duration-300
    hover:-translate-y-1 hover:z-10 "
  >
    <div className="flex flex-col items-center gap-1.5 transform transition-transform duration-300">
      <Icon
        size={22}
        className="text-purple-600/90 transition-all duration-300 group-hover:text-purple-700 group-hover:scale-110"
      />
      <span className="text-[10px] font-medium text-purple-700/80 group-hover:text-purple-800">
        {label}
      </span>
    </div>
    {length > 0 && (
      <span className="bg-blue absolute -top-2 -right-2 bg-blue-700 text-white rounded-full px-1 text-xs">
        {length}
      </span>
    )}
  </button>
);

interface ActionButtonsProps {
  onNotesClick: () => void;
  onPriceClick: () => void;
  onRatingClick: () => void;
  onSwotClick: () => void;
  onGalleryClick: () => void;
  onAdTestingClick: () => void;
  onPageCapturesClick: () => void;
  onAdCopyClick: () => void;
  onVoiceOverClick: () => void;
  onAliExpressClick: () => void;
  onAlibabaClick: () => void;
  onSevenGalleryClick: () => void;
  onAmazonClick: () => void;
  onOtherSitesClick: () => void;
  onFilesClick: () => void;
  onStatsClick: () => void;
  onPhotoClick: () => void;
  onVideoClick: () => void;
  onBrainCut: () => void;
  product: any;
  setTabOnly: any;
  onQuestionaireClick: () => void;
}

export function ActionButtons({
  onNotesClick,
  onPriceClick,
  onRatingClick,
  onSwotClick,
  onGalleryClick,
  onAdTestingClick,
  onPageCapturesClick,
  onAdCopyClick,
  onVoiceOverClick,
  onAliExpressClick,
  onAlibabaClick,
  onAmazonClick,
  onOtherSitesClick,
  onFilesClick,
  onStatsClick,
  product,
  setTabOnly,
  onSevenGalleryClick,
  onPhotoClick,
  onVideoClick,
  onBrainCut,
  onQuestionaireClick,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 mx-auto bg-white py-6 rounded-2xl">
      {/* Main Actions */}
      <div className="flex gap-4">
        <button
          onClick={onGalleryClick}
          className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-file-text w-8 h-8"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
            <path d="M10 9H8"></path>
            <path d="M16 13H8"></path>
            <path d="M16 17H8"></path>
          </svg>

          <span className="text-xs font-medium mt-1">All Data Creatives</span>
        </button>
        <button
          onClick={() => {
            setTabOnly({ status: false, tab: '' });
            onPriceClick();
          }}
          className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transform hover:-translate-y-0.5 transition-all shadow-lg hover:shadow-xl"
        >
          <DollarSign size={32} className="mb-2" />
          <span className="text-xs font-medium">All Price & Analytics</span>
        </button>
      </div>

      {/* Competitor Analysis */}
      <div className="relative py-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-purple-100/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]">
        <h4
          className="absolute -top-2.5 left-4 text-xs font-medium text-purple-800 bg-white px-2 py-0.5 rounded-md 
          shadow-sm border border-purple-100/50"
        >
          Competitor Analysis
        </h4>
        <div className="grid grid-cols-5 gap-2 pt-2">
          <IconButton
            icon={ShoppingBag}
            label="AliExpress"
            onClick={onAliExpressClick}
            length={product?.aliExpress?.length}
          />
          <IconButton
            icon={ShoppingCart}
            label="Alibaba"
            onClick={onAlibabaClick}
            length={product?.aliBabaLink?.length}
          />
          <IconButton
            icon={Store}
            label="1688"
            onClick={onSevenGalleryClick}
            length={product?.oneSix?.length}
          />
          <IconButton
            icon={ShoppingBag}
            label="Amazon"
            onClick={onAmazonClick}
            length={product?.amazon?.length}
          />
          <IconButton
            icon={Globe}
            label="Others"
            onClick={onOtherSitesClick}
            length={product?.otherSite?.length}
          />
        </div>
      </div>

      {/* Ad Creatives */}
      <div className="relative py-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-purple-100/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]">
        <h4
          className="absolute -top-2.5 left-4 text-xs font-medium text-purple-800 bg-white px-2 py-0.5 rounded-md 
          shadow-sm border border-purple-100/50"
        >
          Ad Creatives
        </h4>
        <div className="grid grid-cols-5 gap-2 pt-2">
          <IconButton
            icon={Image}
            label="Photos"
            onClick={onPhotoClick}
            length={product?.images?.length}
          />
          <IconButton
            icon={Video}
            label="Videos"
            onClick={onVideoClick}
            length={product?.videoLinks?.length}
          />
          <IconButton
            icon={FileText}
            label="Ad Copy"
            onClick={onAdCopyClick}
            length={product?.pageCaptures?.length}
          />
          <IconButton
            icon={Mic}
            label="Voice"
            onClick={onVoiceOverClick}
            length={product?.voiceRecordings?.length}
          />
          <IconButton
            icon={Layout}
            label="Landing"
            onClick={onPageCapturesClick}
            length={product?.pageCaptures?.length}
          />
        </div>
      </div>

      {/* Ads & Prices */}
      <div className="relative py-4 rounded-xl bg-white/40 backdrop-blur-sm border-2 border-purple-100/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]">
        <h4
          className="absolute -top-2.5 left-4 text-xs font-medium text-purple-800 bg-white px-2 py-0.5 rounded-md 
          shadow-sm border border-purple-100/50"
        >
          Ads & Prices
        </h4>
        <div className="grid grid-cols-5 gap-2 pt-2">
          {product.category === 'PRODUCT_SELLER' && (
            <IconButton
              icon={DollarSign}
              label="Sale Price"
              onClick={() => {
                onPriceClick();
                setTabOnly({ status: true, tab: 'salesPrice' });
              }}
            />
          )}
          {product.category === 'PRODUCT_AFFILIATE' && (
            <IconButton
              icon={DollarSign}
              label="ROI Simulator"
              onClick={() => {
                onPriceClick();
                setTabOnly({ status: true, tab: 'ROISimulator' });
              }}
            />
          )}
          {product.category === 'PRODUCT_DROP' && (
            <IconButton
              icon={DollarSign}
              label="Selling Price Simulator"
              onClick={() => {
                onPriceClick();
                setTabOnly({ status: true, tab: 'SellingPriceSimulator' });
              }}
            />
          )}
          {product.category === 'PRODUCT_SELLER' && (
            <IconButton
              icon={Wallet}
              label={'Sourcing Price'}
              onClick={() => {
                onPriceClick();
                setTabOnly({ status: true, tab: 'salesPrice' });
              }}
            />
          )}
          {product.category === 'PRODUCT_AFFILIATE' && (
            <IconButton
              icon={Wallet}
              label={'Comission'}
              onClick={() => {
                onPriceClick();
                setTabOnly({ status: true, tab: 'ROISimulator' });
              }}
            />
          )}
          {product.category === 'PRODUCT_DROP' && (
            <IconButton
              icon={Wallet}
              label={'Purchase price'}
              onClick={() => {
                onPriceClick();
                setTabOnly({ status: true, tab: 'SellingPriceSimulator' });
              }}
            />
          )}
          <IconButton
            icon={TestTube}
            label="Ad Test"
            onClick={() => {
              onAdTestingClick();
              setTabOnly({ status: true, tab: 'calculations' });
            }}
          />
          <IconButton
            icon={Calculator}
            label="Break-even"
            onClick={() => {
              onStatsClick();
              setTabOnly({ status: true, tab: 'break-even' });
            }}
          />
          <IconButton
            icon={LineChart}
            label="Analysis"
            onClick={() => {
              onStatsClick();
              setTabOnly({ status: true, tab: 'analysis' });
            }}
          />
        </div>
      </div>

      {/* Info & Data */}
      <div className="relative py-4 rounded-xl bg-white/40 backdrop-blur-sm border border-purple-100/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)]">
        <h4
          className="absolute -top-2.5 left-4 text-xs font-medium text-purple-800 bg-white px-2 py-0.5 rounded-md 
          shadow-sm border border-purple-100/50"
        >
          Info & Data
        </h4>
        <div className="grid grid-cols-5 gap-2 pt-2">
          <IconButton
            icon={StickyNote}
            label="Notes"
            onClick={onNotesClick}
            length={product?.notes?.length}
          />
          <IconButton icon={Target} label="SWOT" onClick={onSwotClick} />
          <IconButton icon={BrainCircuit} label="AIDA" onClick={onBrainCut} />
          <IconButton icon={HardDrive} label="Drive" onClick={onFilesClick} />
          <IconButton
            icon={MessageCircleQuestion}
            label="Questionnaire"
            onClick={onQuestionaireClick}
          />
        </div>
      </div>
    </div>
  );
}
