import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useState } from 'react';

interface NavigationArrowsProps {
  onPrevious?: () => void;
  onNext?: () => void;
}

export const NavigationArrows = ({ onPrevious, onNext }: NavigationArrowsProps) => {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const handleLeftHover = useCallback((hover: boolean) => {
    setShowLeft(hover);
  }, []);

  const handleRightHover = useCallback((hover: boolean) => {
    setShowRight(hover);
  }, []);

  return (
    <>
      {/* Left hover zone and button */}
      <div
        className="fixed left-0 top-0 w-[50px] h-full z-10"
        onMouseEnter={() => handleLeftHover(true)}
        onMouseLeave={() => handleLeftHover(false)}
      >
        <button
          onClick={onPrevious}
          className={`
            fixed left-4 top-1/2 -translate-y-1/2
            flex items-center justify-center
            w-10 h-10 rounded-full
            bg-black/30 text-white
            transition-opacity duration-300
            hover:bg-black/40
            focus:outline-none focus:ring-2 focus:ring-white/50
            ${showLeft ? 'opacity-100' : 'opacity-0'}
          `}
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Right hover zone and button */}
      <div
        className="fixed right-0 top-0 w-[50px] h-full z-10"
        onMouseEnter={() => handleRightHover(true)}
        onMouseLeave={() => handleRightHover(false)}
      >
        <button
          onClick={onNext}
          className={`
            fixed right-4 top-1/2 -translate-y-1/2
            flex items-center justify-center
            w-10 h-10 rounded-full
            bg-black/30 text-white
            transition-opacity duration-300
            hover:bg-black/40
            focus:outline-none focus:ring-2 focus:ring-white/50
            ${showRight ? 'opacity-100' : 'opacity-0'}
          `}
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};