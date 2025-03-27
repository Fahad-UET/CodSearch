import React from 'react';
import { Package } from 'lucide-react';
import { useProductStore } from '../../../store';
import { Product } from '../../../types';
import { selectClasses } from '../constants';

interface ProductSelectorProps {
  selectedProductId: string | null;
  onProductSelect: (product: Product | null) => void;
}

export function ProductSelector({ selectedProductId, onProductSelect }: ProductSelectorProps) {
  const { products } = useProductStore(state => ({ products: state.getAllProducts() }));

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const selectedProduct = products.find(p => p.id === productId) || null;
    onProductSelect(selectedProduct);
  };

  return (
    <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <Package size={20} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-900">Select Product</h3>
      </div>

      <select
        value={selectedProductId || ''}
        onChange={handleChange}
        className={selectClasses}
      >
        <option value="">Choose a product...</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.title} (${product.purchasePrice.toFixed(2)} → ${product.salePrice.toFixed(2)})
          </option>
        ))}
      </select>

      {selectedProductId && (
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-purple-700">Purchase Price</p>
              <p className="text-lg font-semibold text-purple-900">
                ${products.find(p => p.id === selectedProductId)?.purchasePrice.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-700">Sale Price</p>
              <p className="text-lg font-semibold text-purple-900">
                ${products.find(p => p.id === selectedProductId)?.salePrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}