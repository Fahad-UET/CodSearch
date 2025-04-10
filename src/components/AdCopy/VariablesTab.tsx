import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Variable, Tag } from 'lucide-react';
import { useVariableStore } from '../../store/variableStore';
import { getVariableDocumentByProductId } from '@/services/firebase/variable';

const VARIABLE_CATEGORIES = [
  { id: 'product', name: 'Product Details', icon: Variable },
  { id: 'pricing', name: 'Pricing', icon: Tag },
  { id: 'shipping', name: 'Shipping', icon: Variable },
  { id: 'marketing', name: 'Marketing', icon: Variable },
  { id: 'custom', name: 'Custom', icon: Variable },
];

const PREDEFINED_VARIABLES = {
  product: [
    { name: 'productName', description: 'Product name' },
    { name: 'productDescription', description: 'Product description' },
    { name: 'brand', description: 'Product brand' },
    { name: 'category', description: 'Product category' },
  ],
  pricing: [
    { name: 'price', description: 'Current price' },
    { name: 'originalPrice', description: 'Original price' },
    { name: 'discount', description: 'Discount amount' },
    { name: 'discountPercentage', description: 'Discount percentage' },
  ],
  shipping: [
    { name: 'shippingCost', description: 'Shipping cost' },
    { name: 'deliveryTime', description: 'Delivery time' },
    { name: 'shippingMethod', description: 'Shipping method' },
  ],
  marketing: [
    { name: 'promoCode', description: 'Promotion code' },
    { name: 'offerEnds', description: 'Offer end date' },
    { name: 'stockLevel', description: 'Stock level' },
  ],
};

export function VariablesTab({ productId }: { productId?: string }) {
  // to resolve build issue please check this
  // const { variables, addVariable, updateVariable, deleteVariable, setVariables } =
  const { variables,createVariable , updateVariable, deleteVariable, setVariables } =
    useVariableStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('product');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    description: '',
    category: selectedCategory,
  });


  const handleAddPredefined = (
    variable: (typeof PREDEFINED_VARIABLES)[keyof typeof PREDEFINED_VARIABLES][0]
  ) => {
    createVariable({
      name: variable.name,
      value: '',
      description: variable.description,
      category: selectedCategory,
      global: !productId,
      productId,
    });
  };

  const handleAddCustomVariable = () => {
    if (!formData.name.trim() || !formData.value.trim()) {
      return;
    }

    createVariable({
      name: formData.name.trim(),
      value: formData.value.trim(),
      description: formData.description.trim(),
      category: formData.category,
      global: !productId,
      productId,
    });

    setShowAddForm(false);
    setFormData({
      name: '',
      value: '',
      description: '',
      category: selectedCategory,
    });
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {Object.keys(PREDEFINED_VARIABLES).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)} Variables
          </button>
        ))}
      </div>

      {/* Predefined Variables */}
      <div className="grid grid-cols-2 gap-4">
        {PREDEFINED_VARIABLES[selectedCategory as keyof typeof PREDEFINED_VARIABLES]?.map(
          variable => (
            <button
              key={variable.name}
              onClick={() => handleAddPredefined(variable)}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Variable size={16} className="text-purple-600" />
                <span className="font-medium text-gray-900">{variable.name}</span>
              </div>
              <p className="text-sm text-gray-500">{variable.description}</p>
            </button>
          )
        )}
      </div>

      {/* Custom Variables */}
      <div className="bg-white rounded-xl p-6 border border-purple-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Custom Variables</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Variable
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variable Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="Enter variable name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="Enter value"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  createVariable({
                    name: formData.name,
                    value: formData.value,
                    description: formData.description,
                    category: formData.category,
                    global: !productId,
                    productId,
                  });
                  setShowAddForm(false);
                  setFormData({
                    name: '',
                    value: '',
                    description: '',
                    category: 'product',
                  });
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Add Variable
              </button>
            </div>
          </div>
        )}

        {/* Variables List */}
        <div className="space-y-3">
          {variables
            .filter(v => v.global || v.productId === productId)
            .map(variable => (
              <div
                key={variable.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg group hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Variable size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{variable.name}</p>
                    <p className="text-sm text-gray-500">{variable.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setFormData({
                        name: variable.name,
                        value: variable.value,
                        description: variable.description || '',
                        category: variable.category || 'custom',
                      });
                      setShowAddForm(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteVariable(variable.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
