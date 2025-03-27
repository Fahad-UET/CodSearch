import { useState, useCallback, useEffect, useMemo } from 'react';
import { FolderHeart } from 'lucide-react';
import { AdCreative, AdFormData } from '../../types';
import AdForm from './component/AdForm';
import FavoritesManager from './component/favorites/FavouriteManager';
import { extractCreative } from './component/services/videoExtractor';
import { ArrowLeft } from 'lucide-react';
import AdGalleryComp from './component/AdGalleryComp';
import { createVideoUrl, getUserBoards, getUserVideosUrl } from '../../services/firebase';
import { useProductStore } from '../../store';
import { AddProductModal } from '../AddProductModal';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import Notification from '@/components/Notification';

interface AddGalleryView {
  onBack: () => void;
}

const AdGalleryView = ({ onBack }: AddGalleryView) => {
  const [ads, setAds] = useState<any[]>([]);
  const { userPackage, setPackage } = useProductStore();
  const [error, setError] = useState<string | null>(null);
  const [showAdProductModal, setShowAdProductModal] = useState({
    status: false,
    url: null,
    type: 'video',
  });
  const [productDataType, setProductDataType] = useState(false);
  const { user, products } = useProductStore();
  const [boardData, setBoardData] = useState({
    defaultBoard: null,
    defaultBoardFirstList: null,
  });

  const handleRatingChange = useCallback((id: string, rating: number) => {
    setAds(prevAds => prevAds.map(ad => (ad.id === id ? { ...ad, rating } : ad)));
  }, []);
  const [showFavorites, setShowFavorites] = useState(false);
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

  const handleSubmit = async (data: AdFormData) => {
    const credits = await getCredits(user?.uid, 'addVideo');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    setError(null);
    try {
      const creative = await extractCreative(data);
      const uniqueId = `text-${crypto.randomUUID()}`;

      const { type, url, platform, rating } = creative;
      const dataToBeSubmit = {
        type,
        url,
        platform,
        rating,
        productDataType: false,
        dateCreated: Date.now(),
      };
      const dataSub = await createVideoUrl(user.uid, dataToBeSubmit);
      const result = await updateCredits(user?.uid, 'addVideo');
      setPackage(userPackage.plan, result.toString());
      setAds(prev => [dataSub, ...prev]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inattendue';
      setError(message);
      console.error('Error:', error);
    }
  };

  const handleReorder = useCallback((sourceIndex: number, destinationIndex: number) => {
    setAds(prevAds => {
      const newAds = [...prevAds];
      const [removed] = newAds.splice(sourceIndex, 1);
      newAds.splice(destinationIndex, 0, removed);
      return newAds;
    });
  }, []);

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchUserVideos = async () => {
      if (user?.uid) {
        try {
          const data = await getUserVideosUrl(user.uid);
          setAds(data);
        } catch (error) {
          console.error('Error fetching user videos:', error);
        }
      }
    };

    fetchUserVideos();
  }, [user?.uid]);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const userBoards = await getUserBoards(user.uid, user.email);
        const defaultBoard: any = userBoards.find((board: any) => board.boardType === 'default');
        const defaultBoardFirstList = defaultBoard?.lists?.find(list => list.order === 1);

        setBoardData({
          defaultBoard,
          defaultBoardFirstList,
        });
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoardData();
  }, [user.uid, user.email, products]);

  const filteredData = useMemo(() => {
    const data = ads.filter(ad =>
      // @ts-ignore
      productDataType
        ? ad.isMyProduct === true
        : ad.isMyProduct === false || ad.isMyProduct === undefined
    );
    return data;
  }, [ads, productDataType]);

  return (
    <div className=" inset-0 bg-black/50 flex items-center justify-center z-[100] ">
      <div
        className="min-h-screen w-screen  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-purple-900 via-slate-900 to-black  p-4"
      >
        <div className="bg-white shadow-md">
          <div className=" mx-auto px-6 py-4">
            <div className="flex gap-4 items-start">
              <button
                onClick={onBack}
                className="text-[#000000] hover:bg-white/10 p-2 rounded-lg transition-colors flex gap-1 items-center"
              >
                <ArrowLeft color="#000000" size={24} />
                <h2 className="text-xl font-medium text-black">Back</h2>
              </button>
              <div className="flex-grow">
                <AdForm onSubmit={handleSubmit} error={error} />
              </div>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className="flex items-center gap-2 px-4 py-2 text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <FolderHeart className="w-5 h-5" />
                Mes Listes
              </button>
              {showFavorites && (
                <div className="w-96">
                  <FavoritesManager />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-[calc(100vh-92px)] overflow-auto">
          <div className="max-w-6xl mx-auto px-2 py-8 text-white">
            <AdGalleryComp
              ads={filteredData}
              setAds={setAds}
              setProductDataType={setProductDataType}
              productDataType={productDataType}
              onReorder={handleReorder}
              onRatingChange={handleRatingChange}
              setShowAdProductModal={setShowAdProductModal}
            />
          </div>
        </div>
      </div>
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        setNotification={() => setNotification(prev => ({ ...prev, show: false }))}
      />
      {showAdProductModal.status && (
        <AddProductModal
          onClose={() => {
            setShowAdProductModal({ status: false, url: '', type: '' });
          }}
          listId={boardData?.defaultBoardFirstList?.id}
          boardId={boardData?.defaultBoard?.id}
          // to resolve build issue please check this
          // products={products}
          defaultCreation
          link={showAdProductModal}
          setAds={setAds}
        />
      )}
    </div>
  );
};

export default AdGalleryView;
