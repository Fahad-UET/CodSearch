import React, { useMemo, useState } from 'react';
import { DndContext, DragEndEvent, useDroppable } from '@dnd-kit/core';
import { Minimize2, ArrowLeftRight, Edit2, Check, X } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../ProductCard';
import { updateProduct } from '@/services/firebase';

interface Zone {
  id: string;
  title: string;
  color: string;
  products: Product[];
}

interface FullscreenViewProps {
  title: string;
  products: Product[];
  onClose: () => void;
  onProductMove: (productId: string, zone: string) => Promise<void>;
  listIndex: number;
}

function DropZone({
  zone,
  products,
  listIndex,
  onTitleChange,
}: {
  zone: Zone;
  products: Product[];
  listIndex: number;
  onTitleChange: (id: string, newTitle: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: zone.id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(zone.title);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onTitleChange(zone.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const bgColors = {
    green: isOver ? 'bg-green-100' : 'bg-green-50',
    orange: isOver ? 'bg-orange-100' : 'bg-orange-50',
    red: isOver ? 'bg-red-100' : 'bg-red-50',
  };

  const textColors = {
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  };

  const borderColors = {
    green: 'border-green-200',
    orange: 'border-orange-200',
    red: 'border-red-200',
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-full p-6 rounded-lg transition-colors border ${
        bgColors[zone.color as keyof typeof bgColors]
      } ${borderColors[zone.color as keyof typeof borderColors]}`}
    >
      <div className="flex items-center justify-between mb-4 px-5">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200"
              autoFocus
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 text-green-600 hover:bg-green-100 rounded-lg"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 text-red-600 hover:bg-red-100 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3
              className={`text-lg font-semibold ${
                textColors[zone.color as keyof typeof textColors]
              }`}
            >
              {zone.title}
            </h3>
            <button
              onClick={() => setIsEditing(true)}
              className={`p-1 ${
                textColors[zone.color as keyof typeof textColors]
              } hover:bg-white/50 rounded-lg`}
            >
              <Edit2 size={16} />
            </button>
          </div>
        )}
        <ArrowLeftRight className={textColors[zone.color as keyof typeof textColors]} />
      </div>

      <div className="grid grid-cols-7 gap-4">
        {products.map((product, idx) => (
          <ProductCard
            key={product.id}
            product={product}
            listIndex={listIndex}
            verticalIndex={idx}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div
          className={`h-32 border-2 border-dashed ${
            borderColors[zone.color as keyof typeof borderColors]
          } rounded-lg flex items-center justify-center`}
        >
          <p className={`text-sm ${textColors[zone.color as keyof typeof textColors]}`}>
            Drop items here
          </p>
        </div>
      )}
    </div>
  );
}
// to resolve build issue please check this
// interface Product {
//   id: string;
//   name: string;
//   zone?: 'priority' | 'normal' | 'backlog';
// }

interface Zone {
  id: string;
  title: string;
  color: string;
  products: Product[];
}

interface FullscreenViewProps {
  title: string;
  products: Product[];
  onClose: () => void;
  // to resolve build issue please check this
  // onProductMove: (productId: string, zoneId: string) => void;
  onProductMove: (productId: string, zone: string) => Promise<void>;
  listIndex: number;
}

export function FullscreenView({
  title,
  products = [],
  onClose,
  onProductMove,
  listIndex,
}: FullscreenViewProps) {
  const [zoneNames, setZoneNames] = useState({
    priority: 'Stars',
    normal: 'Promising',
    backlog: 'To Explore',
  });

  const zones: Zone[] = useMemo(() => {
    return [
      {
        id: 'priority',
        title: zoneNames.priority,
        color: 'green',
        products: products.filter(p => p.zone === 'priority'),
      },
      {
        id: 'normal',
        title: zoneNames.normal,
        color: 'orange',
        products: products.filter(p => p.zone === 'normal' || !p.zone),
      },
      {
        id: 'backlog',
        title: zoneNames.backlog,
        color: 'red',
        products: products.filter(p => p.zone === 'backlog'),
      },
    ];
  }, [products, zoneNames]);
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const activeProduct = products.find(p => p.id === activeId);
    await updateProduct(activeProduct.id, { zone: over.id })
      .then(updatedProduct => {})
      .catch(error => {
        console.error('Failed to update product:', error);
      });

    if (over && active.id !== over.id) {
      onProductMove(active.id as string, over.id as string);
    }
  };
  // to resolve build issue please check this
  // const handleZoneTitleChange = (zoneId: string, newTitle: string) => {
  const handleZoneTitleChange = (zone: string, newTitle: string) => {
    setZoneNames(prev => ({
      ...prev,
      // to resolve build issue please check this
      // [zoneId]: newTitle,
      [zone]: newTitle,
    }));
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Minimize2 size={24} />
          </button>
        </div>
      </div>

      {/* Drag-and-drop context */}
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex flex-col gap-6 p-6 bg-gray-50 overflow-y-auto">
          {zones.map(zone => (
            <DropZone
              key={zone.id}
              zone={zone}
              products={zone.products}
              listIndex={listIndex}
              onTitleChange={handleZoneTitleChange}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
