import React from 'react';
import { AliExpressProduct } from '../../services/aliexpress';
import { ShoppingBag, Star, Truck, Store, ChevronRight } from 'lucide-react';

interface AliExpressProductCardProps {
  product: AliExpressProduct;
  onSelect?: () => void;
}

export function AliExpressProductCard({ product, onSelect }: AliExpressProductCardProps) {
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={onSelect}
    >
      {/* Main Image */}
      <div className="aspect-square overflow-hidden bg-gray-50">
        {product.images[0] && (
          <img
            src={product.images[0].url}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-medium text-gray-900 line-clamp-2">
          {product.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-red-600">
            {product.price.currency} {product.price.current.toFixed(2)}
          </span>
          {product.price.original && (
            <span className="text-sm text-gray-500 line-through">
              {product.price.currency} {product.price.original.toFixed(2)}
            </span>
          )}
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-yellow-400">
            <Star size={16} className="fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {product.ratings.average.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            ({product.ratings.count} ratings)
          </span>
        </div>

        {/* Shipping */}
        {product.shipping.methods.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck size={16} />
            <span>
              {product.shipping.methods[0].name} ({product.shipping.methods[0].duration})
            </span>
          </div>
        )}

        {/* Seller */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Store size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{product.seller.name}</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}