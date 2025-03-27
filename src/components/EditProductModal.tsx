import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { useProductStore } from '../store';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
}

export function EditProductModal({ product, onClose }: EditProductModalProps) {
  const updateProduct = useProductStore((state) => state.updateProduct);
  const [formData, setFormData] = useState({
    title: product.title,
    description: product.description,
    // change this because description exists in product is it cause any problem then check same in handlesubmit func
    // descriptions: [...product.descriptions, ''],
    descriptions: [...product.description, ''],
    images: [...product.images, ''],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(product.id, {
      ...formData,
      images: formData.images.filter(Boolean),
      // descriptions: formData.descriptions.filter(Boolean),
      description: formData.descriptions.filter(Boolean),
    });
    onClose();
  };

  const handleArrayFieldChange = (field: 'images' | 'descriptions', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addNewField = (field: 'images' | 'descriptions') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field: 'images' | 'descriptions', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    if (newArray.length === 0) newArray.push('');
    setFormData({ ...formData, [field]: newArray });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-2xl w-full max-w-4xl shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-[101] flex justify-between items-center p-6 border-b border-purple-100 bg-white/50 backdrop-blur-sm rounded-t-2xl">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-purple-900">Edit Product</h2>
            <p className="text-sm text-purple-600">Update the product details below</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-purple-400 hover:text-purple-600 transition-colors hover:bg-purple-50 p-2 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full rounded-lg border-purple-200 bg-white/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-purple-700">Descriptions</label>
              <button
                type="button"
                onClick={() => addNewField('descriptions')}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 px-2 py-1 rounded-md hover:bg-purple-100/50"
              >
                <Plus size={16} />
                Add Description
              </button>
            </div>
            {formData.descriptions.map((desc, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  className="flex-1 rounded-lg border-purple-200 bg-white/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-colors"
                  rows={2}
                  value={desc}
                  onChange={(e) => handleArrayFieldChange('descriptions', index, e.target.value)}
                  placeholder="Enter product description"
                />
                {formData.descriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('descriptions', index)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-purple-700">Image URLs</label>
              <button
                type="button"
                onClick={() => addNewField('images')}
                className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 px-2 py-1 rounded-md hover:bg-purple-100/50"
              >
                <Plus size={16} />
                Add Image
              </button>
            </div>
            {formData.images.map((url, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  className="flex-1 rounded-lg border-purple-200 bg-white/50 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-colors"
                  value={url}
                  onChange={(e) => handleArrayFieldChange('images', index, e.target.value)}
                  placeholder="Enter image URL"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('images', index)}
                    className="text-red-400 hover:text-red-600 p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-purple-700 bg-white rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-colors border border-purple-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}