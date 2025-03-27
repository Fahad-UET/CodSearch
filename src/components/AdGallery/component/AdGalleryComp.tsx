import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import FilterBar from './FilterBar';
import type { AdCreative } from '../../../types';
import type { Platform } from '../../../types';
import { DateRange } from 'react-day-picker';

interface Props {
  ads: AdCreative[];
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  onRatingChange: (id: string, rating: number) => void;
// to resolve build issue please check this
// setShowAdProductModal: (args: { status: boolean; url: string; id: string }) => void;
  setShowAdProductModal: (args: { status: boolean; url: string; type: string }) => void;
  setProductDataType: (args: boolean) => void;
  productDataType: boolean;
  setAds: (args: any) => void;
}

export default function AdGalleryComp({
  ads,
  onReorder,
  onRatingChange,
  setShowAdProductModal,
  setProductDataType,
  productDataType,
  setAds,
}: Props) {
  const [currentFilter, setCurrentFilter] = React.useState<Platform | 'all'>('all');
  const [sortByRating, setSortByRating] = React.useState(true);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredAds = React.useMemo(() => {
    let filtered = currentFilter === 'all' ? ads : ads.filter(ad => ad.platform === currentFilter);

    if (dateRange?.from) {
      filtered = filtered.filter(ad => {
        const date = new Date(ad?.dateCreated);
        if (dateRange.to) {
          return date >= dateRange.from && date <= dateRange.to;
        }
        return date >= dateRange.from;
      });
    }

    return filtered;
  }, [ads, currentFilter, dateRange]);


  const sortedAds = React.useMemo(() => {
    if (!sortByRating) return filteredAds;
    return [...filteredAds].sort((a, b) => {
      // Si les deux éléments ont une note de 0, gardez l'ordre original
      if (a.rating === 0 && b.rating === 0) return 0;
      // Si un seul élément a une note de 0, mettez-le à la fin
      if (a.rating === 0) return 1;
      if (b.rating === 0) return -1;
      // Sinon, triez par note décroissante
      return b.rating - a.rating;
    });
  }, [filteredAds, sortByRating]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = ads.findIndex(ad => ad.id === active.id);
      const newIndex = ads.findIndex(ad => ad.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  if (ads.length === 0) {
    return (
      <>
      {/* // to resolve build issue please check this */}
      {/* <FilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          totalCount={ads.length}
          setProductDataType={setProductDataType}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          count={ads.length}
        /> */}
        <FilterBar
          currentFilter={currentFilter}
          sortByRating={sortByRating}
          onSortChange={setSortByRating}
          productDataType={productDataType}
          onFilterChange={setCurrentFilter}
          totalCount={ads.length}
          setProductDataType={setProductDataType}
          dateRange={dateRange}
          onDateRangeChange={(range) => setDateRange(range)}
          count={ads.length}
        />
        <div className="text-center py-12 bg-[#4B2A85]/30 backdrop-blur-sm rounded-lg border border-white/10">
          <p className="text-white/70">Aucune annonce ajoutée pour le moment</p>
        </div>
      </>
    );
  }

  return (
    <>
      <FilterBar
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        sortByRating={sortByRating}
        onSortChange={setSortByRating}
        totalCount={ads.length}
        setProductDataType={setProductDataType}
        productDataType={productDataType}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        count={ads.length}
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={sortedAds.map(ad => ad.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-auto">
            {sortedAds.map(ad => (
              <SortableItem
                ads={ads}
                setAds={setAds}
                setShowAdProductModal={setShowAdProductModal}
                key={ad.id}
                ad={ad}
                onRatingChange={onRatingChange}
                productDataType={productDataType}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
