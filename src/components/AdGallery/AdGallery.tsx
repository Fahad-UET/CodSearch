import { GalleryVerticalEnd } from 'lucide-react';
import { useLanguageStore } from '../../store/languageStore';

interface AddGalleryType {
  onShowAdGallery: (val: boolean) => void;
}
const AdGallery = ({ onShowAdGallery }: AddGalleryType) => {
  const { t } = useLanguageStore();
  return (
    <button
      onClick={() => onShowAdGallery(true)}
      className="h-9 px-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors flex items-center gap-1.5 relative z-[9999]"
    >
      <GalleryVerticalEnd size={16} />
      <span className="text-sm">{t('My Ad Library')}</span>
    </button>
  );
};

export default AdGallery;
