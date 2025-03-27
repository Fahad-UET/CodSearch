import React, { useState, useMemo, useEffect } from 'react';
import { Variable, Plus, PenLine, Trash2, Search, ChevronDown, ChevronRight } from 'lucide-react';
import AddVariableModal from './AddVariableModal';
import EditVariableModal from './EditVariableModal';
import type { Variable as VariableType } from '../../../../types/variable';
import { useVariableStore } from '@/store/variableStore';
import {
  getVariableDocumentByProductId,
  updateVariableDocument,
} from '@/services/firebase/variable';

interface Props {
  onSelect: (variable: string) => void;
  product: any;
}

export default function VariableSelectorComp({ onSelect, product }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingVariable, setEditingVariable] = useState<VariableType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const { variables, deleteVariable, setVariables } = useVariableStore();

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleCopyVariable = async (variable: string) => {
    try {
      await navigator.clipboard.writeText(`{{${variable}}}`);
      setCopiedId(variable);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this variable?')) {
      const removedData = variables.filter(item => item.id !== id);
      await updateVariableDocument(product.id, removedData);
      setVariables(removedData);
    }
  };

  const handleEdit = async (variable: VariableType, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedVariables = variables.map(item =>
        item.id === variable.id ? { ...item, ...variable } : item
      );
      await updateVariableDocument(product.id, updatedVariables);
      setVariables(updatedVariables);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredVariables = variables.filter(
    variable =>
      variable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variable.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variable.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedVariables = React.useMemo(() => {
    const groups: Record<string, typeof filteredVariables> = {
      'Pricing & Discounts': [],
      'Shipping & Delivery': [],
      'Product Details': [],
      'Stock & Availability': [],
      'Store Details': [],
      'Contact Info': [],
      'Social Media': [],
      Measurements: [],
      'Warranty & Returns': [],
      Payment: [],
      Other: [],
    };

    filteredVariables.forEach(variable => {
      if (
        variable.name.includes('price') ||
        variable.name.includes('discount') ||
        variable.name.includes('currency')
      ) {
        groups['Pricing & Discounts'].push(variable);
      } else if (variable.name.includes('shipping') || variable.name.includes('delivery')) {
        groups['Shipping & Delivery'].push(variable);
      } else if (variable.name.includes('product') || variable.name.includes('brand')) {
        groups['Product Details'].push(variable);
      } else if (
        variable.name.includes('stock') ||
        variable.name.includes('sold') ||
        variable.name.includes('rating')
      ) {
        groups['Stock & Availability'].push(variable);
      } else if (
        variable.name.includes('store') ||
        variable.name.includes('country') ||
        variable.name.includes('city')
      ) {
        groups['Store Details'].push(variable);
      } else if (
        variable.name.includes('phone') ||
        variable.name.includes('whatsapp') ||
        variable.name.includes('email')
      ) {
        groups['Contact Info'].push(variable);
      } else if (
        variable.name.includes('facebook') ||
        variable.name.includes('tiktok') ||
        variable.name.includes('instagram') ||
        variable.name.includes('snapchat')
      ) {
        groups['Social Media'].push(variable);
      } else if (
        variable.name.includes('weight') ||
        variable.name.includes('size') ||
        variable.name.includes('dimensions') ||
        variable.name.includes('duration')
      ) {
        groups['Measurements'].push(variable);
      } else if (variable.name.includes('warranty') || variable.name.includes('return')) {
        groups['Warranty & Returns'].push(variable);
      } else if (variable.name.includes('payment') || variable.name.includes('installment')) {
        groups['Payment'].push(variable);
      } else {
        groups['Other'].push(variable);
      }
    });

    // Sort groups by number of variables, then alphabetically
    return Object.entries(groups)
      .filter(([_, vars]) => vars.length > 0)
      .sort((a, b) => {
        // First by number of variables (descending)
        const countDiff = b[1].length - a[1].length;
        if (countDiff !== 0) return countDiff;
        // Then alphabetically
        return a[0].localeCompare(b[0]);
      });
  }, [filteredVariables]);

  useEffect(() => {
    const getVariables = async () => {
      const data: any = await getVariableDocumentByProductId(product.id);
      setVariables(data?.variables);
    };
    getVariables();
  }, []);

  return (
    <>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-gray-900">Variables</h2>
              <span className="px-2 py-0.5 text-sm bg-purple-100 text-purple-700 rounded-full">
                {variables.length}
              </span>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search variables..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Variable
          </button>
        </div>

        <div className="space-y-2">
          {groupedVariables.map(([category, variables]) => (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 group ${
                  expandedCategories.includes(category)
                    ? 'bg-gradient-to-r from-[#5D1C83] to-[#8A1C66] text-white shadow-lg'
                    : 'bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-purple-50/50 text-gray-900 hover:text-[#5D1C83] border border-gray-200 hover:border-[#5D1C83]/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      expandedCategories.includes(category) ? 'bg-white' : 'bg-[#5D1C83]'
                    }`}
                  />
                  {category}
                  <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                    {variables.length}
                  </span>
                </div>
                {expandedCategories.includes(category) ? (
                  <ChevronDown className="w-4 h-4 text-white" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#5D1C83] transition-transform group-hover:translate-x-0.5" />
                )}
              </button>
              <div
                className={`grid grid-cols-3 gap-3 p-2 transition-all duration-300 ${
                  expandedCategories.includes(category)
                    ? 'opacity-100 max-h-[2000px] transform translate-y-0'
                    : 'opacity-0 max-h-0 overflow-hidden transform -translate-y-4'
                }`}
              >
                {variables.map((variable: any) => (
                  <div
                    key={`${variable.id}`}
                    onClick={() => handleCopyVariable(variable.name)}
                    className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#5D1C83]/20 hover:shadow-md transition-all duration-200 group cursor-pointer relative hover:scale-[1.01] transform"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="px-1.5 py-0.5 text-xs bg-gray-100 rounded font-mono text-[#5D1C83] truncate">
                          {`{{${variable.name}}}`}
                        </code>
                        <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                          {variable.type}
                        </span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <button
                          onClick={e => handleEdit(variable, e)}
                          className="p-1 text-gray-400 hover:text-[#5D1C83] hover:bg-purple-50 rounded transition-colors"
                        >
                          <PenLine className="w-3 h-3" />
                        </button>
                        <button
                          onClick={e => handleDelete(variable.id, e)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div
                        className="font-medium text-sm text-gray-900 truncate"
                        title={variable.value}
                      >
                        {variable.value}
                      </div>
                      <div className="text-xs text-gray-500 truncate" title={variable.description}>
                        {variable.description}
                      </div>
                    </div>
                    {copiedId === variable.name && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#5D1C83]/90 text-white text-sm font-medium rounded-lg">
                        Copied!
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredVariables.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No variables found matching your search</p>
          </div>
        )}

        <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100 mt-6">
          <h3 className="font-medium text-[#5D1C83] mb-2">How to use variables</h3>
          <p className="text-sm text-gray-600">
            Variables are replaced with their values when generating text. Use double curly braces
            to insert variables, for example:{' '}
            <code className="px-1 py-0.5 bg-white rounded">
              Save {'{{price}}'} {'{{currency}}'} today!
            </code>
          </p>
        </div>
      </div>

      <AddVariableModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        variables={variables}
        product={product}
      />
      {editingVariable && (
        <EditVariableModal
          isOpen={true}
          onClose={() => setEditingVariable(null)}
          variable={editingVariable}
        />
      )}
    </>
  );
}
