import React from 'react';
import { Package2, DollarSign, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Product } from '../../types';

interface ProductInfoZoneProps {
  product: Product;
}

export function ProductInfoZone({ product }: ProductInfoZoneProps) {
  const isProductsList = product.status === 'products';

  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-b border-gray-100">
      <h3 className="font-medium text-gray-900 text-sm mb-3">{product.title}</h3>

      {isProductsList ? (
        <>
        <div className="grid grid-cols-2 gap-4">
          {/* Sourcing & Sale Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Package2 size={16} className="text-purple-500" />
              {product.purchasePrice ? (
                <span className="text-sm font-medium text-gray-900">
                  ${product.purchasePrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm text-gray-400">• • •</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-green-500" />
              {product.salePrice ? (
                <span className="text-sm font-medium text-gray-900">
                  ${product.salePrice.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm text-gray-400">• • •</span>
              )}
            </div>
          </div>
          
          {/* AliExpress & Alibaba Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-orange-500" />
              {product.competitorPrices?.aliexpress ? (
                <span className="text-sm font-medium text-gray-900">
                  ${product.competitorPrices.aliexpress.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm text-gray-400">• • •</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-blue-500" />
              {product.competitorPrices?.alibaba ? (
                <span className="text-sm font-medium text-gray-900">
                  ${product.competitorPrices.alibaba.toFixed(2)}
                </span>
              ) : (
                <span className="text-sm text-gray-400">• • •</span>
              )}
            </div>
          </div>
        </div>
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-white mb-1">{product.title}</h3>
          <p className="text-sm text-gray-200">{product.description}</p>
        </div>
        </>
      ) : null}
    </div>
  )
}