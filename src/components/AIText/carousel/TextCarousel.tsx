import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TABS } from '../ui/constant';

interface Props {
  texts: any;
  onTextSelect: (text: string, id: string) => void;
  currentPrompt: string;
  // to resolve build issue please check this
  activeTab?: string;
}

export default function TextCarousel({ texts, onTextSelect, currentPrompt, activeTab }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const updateArrowVisibility = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
  };

  useEffect(() => {
    updateArrowVisibility();
    window.addEventListener('resize', updateArrowVisibility);
    return () => window.removeEventListener('resize', updateArrowVisibility);
  }, [texts]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    const targetScroll =
      direction === 'left'
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    e.preventDefault();

    scrollContainerRef.current.scrollLeft += e.deltaY;
    updateArrowVisibility();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      scroll('left');
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      scroll('right');
      e.preventDefault();
    }
  };

  const handleTextToggle = (text: any) => {
    if (text.usedInPrompt) {
      // Remove text from prompt
      const textToRemove = text?.content || text?.title;
      const updatedPrompt = currentPrompt
        .split('\n\n')
        .filter(chunk => chunk.trim() !== textToRemove.trim())
        .join('\n\n');
      onTextSelect(updatedPrompt, text.id);
    } else {
      // Add text to prompt
      onTextSelect(text?.title || text?.content, text.id);
    }
  };

  const bgGradient = useMemo(() => {
    const currentTab = TABS.find(tab => tab.tagId === activeTab);

    return currentTab?.bgColor || 'from-purple-500/5 to-purple-50/50';
  }, [texts, activeTab]);
  const currentTab = TABS.find(tab => {
    return tab.tagId === texts?.[0]?.tags[0];
  });

  const borderColor = currentTab?.borderColor || 'border-purple-200';

  return (
    <div
      className={`relative group !bg-gradient-to-r ${bgGradient} !from-green-500/5 !to-green-50/50 rounded-xl border ${borderColor} shadow-inner p-4`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Navigation arrows */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#5D1C83] text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-[#4D0C73] hover:scale-110"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#5D1C83] text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-[#4D0C73] hover:scale-110"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide"
        onScroll={updateArrowVisibility}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="inline-flex gap-4 p-1">
          {texts?.map((text, index) => {
            return (
              <div key={text.id} className="flex-none w-[300px]">
                <button
                  onClick={() => handleTextToggle(text)}
                  className={`w-full p-3 rounded-lg border text-left transition-all
                    ${
                      text?.usedInPrompt
                        ? `${
                            currentTab?.id === 'creative-voice'
                              ? 'bg-gray-50/30 border-gray-100/30 '
                              : 'bg-[rgba(128,128,128,0.5)] backdrop-blur-md'
                          }`
                        : `${
                            currentTab?.id === 'creative-voice'
                              ? 'bg-gradient-to-br from-[#EBF5FB] to-[#D6EAF8] hover:from-[#D6EAF8] hover:to-[#AED6F1] border-[#3498DB]/20'
                              : 'bg-gray-50 hover:bg-white'
                          } hover:shadow-lg hover:border-${borderColor} border-gray-200 hover:scale-[1.02] transform transition-all duration-200`
                    }`}
                >
                  <p
                    className={`text-sm line-clamp-3 ${
                      text.usedInPrompt
                        ? '!text-white'
                        : `${
                            currentTab?.id === 'creative-voice'
                              ? 'text-black font-semibold'
                              : 'text-black'
                          } font-medium shadow-sm`
                    } `}
                    dir={text.language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {text?.content || text?.title}
                  </p>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
