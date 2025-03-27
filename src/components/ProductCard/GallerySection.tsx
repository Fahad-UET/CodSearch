interface GallerySectionProps {
  notesCount: number;
  videoCount: number;
  linkCount: number;
  className?: string;
  onPhotoClick: () => void;
  onVideoClick: () => void;
  onLinkClick: () => void;
}

export function GallerySection({
  videoCount,
  linkCount,
  className = '',
  onPhotoClick,
  onVideoClick,
  onLinkClick
}: GallerySectionProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
    </div>
  );
}