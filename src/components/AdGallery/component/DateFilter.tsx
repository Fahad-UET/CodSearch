import React from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface Props {
  // to resolve build issue please check this
  // dateRange: DateRange | undefined;
  // onDateRangeChange: (range: DateRange | undefined) => void;
  dateRange: any;
  onDateRangeChange: (range: any) => void;
  count: number;
}

export default function DateFilter({ dateRange, onDateRangeChange, count }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleReset = () => {
    onDateRangeChange(undefined);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
            dateRange
              ? 'bg-white text-[#5D1C83] shadow-lg'
              : 'bg-white/10 text-white/90 hover:bg-white/20'
          }`}
        >
          <Calendar className="w-4 h-4" />
          {dateRange ? (
            <span>
              {format(dateRange.from!, 'MMM d, yyyy')}
              {dateRange.to && ` - ${format(dateRange.to, 'MMM d, yyyy')}`}
            </span>
          ) : (
            <span>Filter by date</span>
          )}
        </button>

        {dateRange && (
          <button
            onClick={handleReset}
            className="p-2 text-white/90 hover:bg-white/10 rounded-md transition-all"
            title="Reset date filter"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <span className="text-sm text-white/70">
          {count} {count === 1 ? 'video' : 'videos'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 z-50">
          <DayPicker
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            footer={
              <div className="mt-4 text-center">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-[#5D1C83] hover:bg-[#5D1C83]/10 rounded-md transition-colors"
                >
                  Reset
                </button>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
