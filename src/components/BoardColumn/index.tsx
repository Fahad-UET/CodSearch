import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { moveItem } from '../../utils/sorting';
import { ProductCard } from '../ProductCard';
import { useMemo } from 'react';

interface Product {
  id: string;
  position: number;
  [key: string]: any;
}

interface BoardColumnProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

export function BoardColumn({ products, onProductsChange }: BoardColumnProps) {
  // Sort products by position to maintain order
  const sortedProducts = useMemo(() => 
    [...products].sort((a, b) => a.position - b.position),
    [products]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = sortedProducts.findIndex(p => p.id === active.id);
    const updatedProducts = moveItem(sortedProducts, active.id, over.id);
    onProductsChange(updatedProducts);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortedProducts.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}