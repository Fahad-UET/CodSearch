import React, { useState } from 'react';
import { Product } from '../../../types';
import { DollarSign, Edit2, Save, X } from 'lucide-react';
import { useProductStore } from '../../../store';

interface PriceListItemProps {
  product: Product;
}

export function PriceListItem({ product }: PriceListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(product.purchasePrice);
  const [salePrice, setSalePrice] = useState(product.salePrice);
  const [isLoading, setIsLoading] = useState(false);
  const { updateProduct } = useProductStore();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateProduct(product.id, {
        purchasePrice,
        salePrice
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const profitMargin = ((salePrice - purchasePrice) / salePrice) * 100;

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-gray-400" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-900">{product.title}</h3>
            <p className="text-sm text-gray-500">ID: {product.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {isEditing ? (
            <>
              <div className="space-y-1">
                <label className="block text-xs text-gray-500">Purchase Price</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
                    className="w-32 pl-6 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-gray-500">Sale Price</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value))}
                    className="w-32 pl-6 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                >
                  <Save size={20} />
                </button>
                <button
                  onClick={() => {
                    setPurchasePrice(product.purchasePrice);
                    setSalePrice(product.salePrice);
                    setIsEditing(false);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-right">
                <div className="text-sm text-gray-500">Purchase Price</div>
                <div className="font-medium text-gray-900">${product.purchasePrice.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Sale Price</div>
                <div className="font-medium text-gray-900">${product.salePrice.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Margin</div>
                <div className="font-medium text-gray-900">{profitMargin.toFixed(1)}%</div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Edit2 size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}