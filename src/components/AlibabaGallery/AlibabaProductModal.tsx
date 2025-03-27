import React from 'react';
import { X, ShoppingCart, Star, Truck, Store, Download } from 'lucide-react';
import { AlibabaProduct } from '../../services/alibaba';

interface AlibabaProductModalProps {
  product: AlibabaProduct;
  onClose: () => void;
  onImport: (product: AlibabaProduct) => void;
}

export function AlibabaProductModal({ product, onClose, onImport }: AlibabaProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[300]">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-129px)]">
          <div className="p-6 space-y-6">
            {/* Product Header */}
            <div className="flex gap-6">
              {/* Main Image */}
              <div className="w-1/3">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
                  {product.images[0] && (
                    <img
                      src={product.images[0].url}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1 space-y-4">
                <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-red-600">
                    {product.price.currency} {product.price.current.toFixed(2)}
                  </span>
                  {product.price.original && (
                    <span className="text-lg text-gray-500 line-through">
                      {product.price.currency} {product.price.original.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => onImport(product)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart size={20} />
                    Import Product
                  </button>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Description</h3>
              <div className="prose prose-sm max-w-none">
                {product.description}
              </div>
            </div>

            {/* Specifications */}
            {Object.keys(product.specs).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="w-1/3 text-gray-500">{key}</span>
                      <span className="w-2/3 text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Shipping</h3>
              <div className="space-y-2">
                {product.shipping.methods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Truck size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.duration}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">
                      {method.price > 0
                        ? `${product.price.currency} ${method.price.toFixed(2)}`
                        : 'Free'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Seller Information</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Store size={24} className="text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{product.seller.name}</p>
                    {product.seller.rating && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="ml-1">{product.seller.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                {product.seller.followers && (
                  <span className="text-sm text-gray-500">
                    {product.seller.followers.toLocaleString()} followers
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}