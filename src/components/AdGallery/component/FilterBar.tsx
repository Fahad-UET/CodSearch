import { Layout, Facebook, Video, Image, Star } from 'lucide-react';
import type { Platform } from '../../../types';
import DateFilter from './DateFilter';
import { DateRange } from 'react-day-picker';

interface Props {
  currentFilter: Platform | 'all';
  onFilterChange: (filter: Platform | 'all') => void;
  sortByRating: boolean;
  onSortChange: (sort: boolean) => void;
  totalCount: number;
  setProductDataType: (dataType: boolean) => void;
  productDataType: boolean;
  // to resolve build issue please check this
  // dateRange: Date;
  // onDateRangeChange: (date: Date) => void;
  dateRange: DateRange;
  onDateRangeChange: (date: DateRange) => void;
  count?: any;  // to remove ts errors in build
}

export default function FilterBar({
  currentFilter,
  onFilterChange,
  sortByRating,
  onSortChange,
  totalCount,
  setProductDataType,
  productDataType,
  dateRange,
  onDateRangeChange,
  count,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 relative z-50">
      <div className="flex gap-4 items-center">
        <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
          <button
            onClick={() => onFilterChange('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              currentFilter === 'all'
                ? 'bg-white text-[#5D1C83] shadow-lg'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>All ({totalCount})</span>
          </button>
          <button
            onClick={() => onFilterChange('direct')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              currentFilter === 'direct'
                ? 'bg-white text-[#5D1C83] shadow-lg'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Photos/GIFs</span>
          </button>
          <button
            onClick={() => onFilterChange('facebook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              currentFilter === 'facebook'
                ? 'bg-white text-[#5D1C83] shadow-lg'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </button>
          <button
            onClick={() => onFilterChange('tiktok')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              currentFilter === 'tiktok'
                ? 'bg-white text-[#5D1C83] shadow-lg'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>TikTok</span>
          </button>
        </div>
        <DateFilter onDateRangeChange={onDateRangeChange} dateRange={dateRange} count={count} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setProductDataType(!productDataType);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all bg-white text-[#5D1C83] shadow-lg}`}
        >
          {!productDataType ? (
            <span className="font-semibold">My Product</span>
          ) : (
            <span className="font-semibold">Ad Gallery</span>
          )}
        </button>
        <button
          onClick={() => onSortChange(!sortByRating)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            sortByRating
              ? 'bg-white text-[#5D1C83] shadow-lg'
              : 'bg-white/10 text-white/90 hover:bg-white/20'
          }`}
        >
          <Star className={`w-4 h-4 ${sortByRating ? 'fill-current' : ''}`} />
          <span>{sortByRating ? 'Best rated first' : 'Sort by rating'}</span>
        </button>
      </div>
    </div>
  );
}
