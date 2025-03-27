import React from 'react';
import { Download, Link2, ExternalLink, Trash2 } from 'lucide-react';
import type { AdCreative } from '../../../types';
import FavoriteButton from './favorites/FavoriteButton';
import { deleteVideoUrl } from '@/services/firebase';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import { useProductStore } from '@/store';

interface Props {
  ad: AdCreative;
  isMedia?: boolean;
  // to resolve build issue please check this optional
  setShowAdProductModal?: (args: { status: boolean; url: string; id: string }) => void;
  productDataType?: boolean;
  // : (rating: number) => void;
  ads?: string;
  setAds?: (arg: any) => void;
}

export default function VideoActions({
  ad,
  isMedia,
  setShowAdProductModal,
  productDataType,
  ads,
  setAds,
}: Props) {
  const [copying, setCopying] = React.useState(false);
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [notification, setNotification] = React.useState<{
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

  const handleDownload = async () => {
    const credits = await getCredits(user?.uid, 'videoDownload');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    try {
      const response = await fetch(ad.url);
      const blob = await response.blob();
      const result = await updateCredits(user?.uid, 'videoDownload');
      setPackage(userPackage.plan, result.toString());
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${ad.id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleCopyLink = async () => {
    if (copying) return;
    const credits = await getCredits(user?.uid, 'videoDownload');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    const urlToCopy = ad.url;
    setCopying(true);
    navigator.clipboard
      .writeText(urlToCopy)
      .then(async () => {
        const button = document.querySelector(`[data-ad-id="${ad.id}"].copy-button`);
        if (button) {
          button.classList.add('bg-green-600');
          setTimeout(() => {
            button.classList.remove('bg-green-600');
            setCopying(false);
          }, 1000);
        }
        const result = await updateCredits(user?.uid, 'videoDownload');
        setPackage(userPackage.plan, result.toString());
      })
      .catch(error => {
        console.error('Copy error:', error);
        setCopying(false);
      });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVideoUrl(id);

      setAds(prev => prev.filter(ad => ad.id !== id));
    } catch (error) {
      console.error('Error deleting the video:', error);
    }
  };

  return (
    <div
      className={`absolute inset-x-0 top-0 p-2 flex ${
        isMedia ? 'justify-end' : 'justify-between'
      } opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0 z-50`}
    >
      <div>
        {!isMedia && !productDataType && (
          <button
            onClick={() => {
              setShowAdProductModal({ status: true, url: ad.url, id: ad.id });
            }}
            className={`flex items-center gap-2 px-2 py-2 rounded-md transition-all text-white bg-[#5D1C83] shadow-lg`}
          >
            <span className="font-medium text-xs">Create Product</span>
          </button>
        )}
      </div>

      <div
        className={`flex ${
          isMedia && !productDataType ? 'justify-center' : 'justify-center'
        } items-center gap-1.5 bg-black/25 backdrop-blur-md p-2 rounded-xl shadow-xl`}
      >
        <button
          onClick={handleDownload}
          className="p-3 bg-[#5D1C83] hover:bg-[#6D2C93] text-white rounded-lg transform hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg hover:ring-2 hover:ring-purple-300/50"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>

        {!isMedia && (
          <>
            <button
              onClick={handleCopyLink}
              className="p-1.5 bg-[#5D1C83] hover:bg-[#6D2C93] text-white rounded-lg transform hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg hover:ring-2 hover:ring-purple-300/50 copy-button"
              data-ad-id={ad.id}
              title="Copy Link"
            >
              <Link2 className="w-4 h-4" />
            </button>

            <button
              className="p-1.5 bg-[#5D1C83] hover:bg-[#6D2C93] text-white rounded-lg transform hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg hover:ring-2 hover:ring-purple-300/50"
              title="Open in new tab"
              onClick={async () => {
                const result = await updateCredits(user?.uid, 'videoDownload');
                setPackage(userPackage.plan, result.toString());
                window.open(ad.url, '_blank', 'noopener,noreferrer');
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <FavoriteButton ad={ad} />

            <button
              onClick={() => handleDelete(ad.id)}
              className="p-1.5 bg-[#5D1C83] hover:bg-[#6D2C93] text-white rounded-lg transform hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg hover:ring-2 hover:ring-purple-300/50 copy-button"
              data-ad-id={ad.id}
              title="Copy Link"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
