import React from 'react';
import { Product } from '../../../types';
import { PriceListItem } from './PriceListItem';
import { Loader2 } from 'lucide-react';

interface PriceListProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export function PriceList({ products, isLoading, error }: PriceListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-8 border border-purple-100 shadow-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 size={32} className="text-purple-600 animate-spin" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-8 border border-purple-100 shadow-sm">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-purple-100 shadow-sm">
        <div className="text-center text-gray-500">
          No products found
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-purple-100 shadow-sm divide-y divide-gray-100">
      {products.map(product => (
        <PriceListItem key={product.id} product={product} />
      ))}
    </div>
  );
}