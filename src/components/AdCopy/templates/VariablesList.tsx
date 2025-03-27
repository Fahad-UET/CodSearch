import React from 'react';
import { Tag, Plus, X, Save, Variable } from 'lucide-react';

interface TemplateVariable {
  name: string;
  description: string;
  example: string;
  category: 'pricing' | 'product' | 'marketing' | 'shipping';
}

const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Pricing Variables
  {
    name: 'price',
    description: 'Current product price',
    example: '$29.99',
    category: 'pricing'
  },
  {
    name: 'originalPrice',
    description: 'Original price before discount',
    example: '$39.99',
    category: 'pricing'
  },
  {
    name: 'discount',
    description: 'Discount percentage',
    example: '25%',
    category: 'pricing'
  },
  {
    name: 'savings',
    description: 'Amount saved',
    example: '$10',
    category: 'pricing'
  },
  
  // Product Variables
  {
    name: 'productName',
    description: 'Name of the product',
    example: 'Premium Wireless Earbuds',
    category: 'product'
  },
  {
    name: 'color',
    description: 'Product color',
    example: 'Midnight Black',
    category: 'product'
  },
  {
    name: 'size',
    description: 'Product size',
    example: 'Large',
    category: 'product'
  },
  {
    name: 'material',
    description: 'Product material',
    example: 'Premium Leather',
    category: 'product'
  },
  
  // Marketing Variables
  {
    name: 'offer',
    description: 'Special offer text',
    example: 'Buy One Get One Free',
    category: 'marketing'
  },
  {
    name: 'countdown',
    description: 'Offer countdown',
    example: '24 hours left',
    category: 'marketing'
  },
  {
    name: 'reviews',
    description: 'Number of reviews',
    example: '1,234',
    category: 'marketing'
  },
  {
    name: 'rating',
    description: 'Product rating',
    example: '4.8',
    category: 'marketing'
  },
  
  // Shipping Variables
  {
    name: 'shippingTime',
    description: 'Estimated shipping time',
    example: '2-3 business days',
    category: 'shipping'
  },
  {
    name: 'shippingCost',
    description: 'Shipping cost',
    example: 'Free',
    category: 'shipping'
  },
  {
    name: 'deliveryDate',
    description: 'Estimated delivery date',
    example: 'March 15',
    category: 'shipping'
  }
];

interface VariablesListProps {
  onSelectVariable: (variable: string) => void;
}

export function VariablesList({ onSelectVariable }: VariablesListProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* Quick Variables Access */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Access Variables</h4>
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_VARIABLES.map(variable => (
            <button
              key={variable.name}
              onClick={() => onSelectVariable(variable.name)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors flex items-center gap-1.5"
            >
              <Variable size={14} />
              {variable.name}
            </button>
          ))}
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Variables</h3>
      
      <div className="space-y-6">
        {/* Pricing Variables */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing</h4>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_VARIABLES
              .filter(v => v.category === 'pricing')
              .map(variable => (
                <button
                  key={variable.name}
                  onClick={() => onSelectVariable(`{{${variable.name}}}`)}
                  className="flex items-center gap-2 p-2 text-left hover:bg-purple-50 rounded-lg group transition-colors"
                >
                  <Tag size={16} className="text-purple-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {variable.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {variable.example}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Product Variables */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Product</h4>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_VARIABLES
              .filter(v => v.category === 'product')
              .map(variable => (
                <button
                  key={variable.name}
                  onClick={() => onSelectVariable(`{{${variable.name}}}`)}
                  className="flex items-center gap-2 p-2 text-left hover:bg-blue-50 rounded-lg group transition-colors"
                >
                  <Tag size={16} className="text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {variable.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {variable.example}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Marketing Variables */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Marketing</h4>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_VARIABLES
              .filter(v => v.category === 'marketing')
              .map(variable => (
                <button
                  key={variable.name}
                  onClick={() => onSelectVariable(`{{${variable.name}}}`)}
                  className="flex items-center gap-2 p-2 text-left hover:bg-green-50 rounded-lg group transition-colors"
                >
                  <Tag size={16} className="text-green-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {variable.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {variable.example}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Shipping Variables */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Shipping</h4>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_VARIABLES
              .filter(v => v.category === 'shipping')
              .map(variable => (
                <button
                  key={variable.name}
                  onClick={() => onSelectVariable(`{{${variable.name}}}`)}
                  className="flex items-center gap-2 p-2 text-left hover:bg-amber-50 rounded-lg group transition-colors"
                >
                  <Tag size={16} className="text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {variable.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {variable.example}
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}