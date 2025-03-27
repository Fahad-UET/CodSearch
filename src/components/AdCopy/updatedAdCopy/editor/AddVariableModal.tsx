import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { CreateVariableDto } from '../../../../types/variable';
import { useVariableStore } from '@/store/variableStore';
import { updateVariableDocument } from '@/services/firebase/variable';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // to resolve build issue please check this
  variables?: any;
  product?: any;
}

export default function AddVariableModal({ isOpen, onClose, variables, product }: Props) {
  const { setVariables } = useVariableStore();
  const [formData, setFormData] = useState<CreateVariableDto>({
    name: '',
    value: '',
    type: 'text',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const uniqueId = `text-${crypto.randomUUID()}`;
      const newData = {
        id: uniqueId,
        ...formData,
      };
      const newVariableList = [...variables, newData];

      await updateVariableDocument(product.id, newVariableList);
      setVariables(newVariableList);
      setFormData({ name: '', value: '', type: 'text' });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Add New Variable</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variable Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] font-mono"
              placeholder="price"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Will be used as {`{{${formData.name}}}`} in text
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              type="text"
              value={formData.value}
              onChange={e => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83] font-mono"
              placeholder="99.99"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="currency">Currency</option>
              <option value="date">Date</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#5D1C83] focus:border-[#5D1C83]"
              placeholder="Explain what this variable is used for"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-[#5D1C83] hover:bg-[#6D2C93] rounded-md"
            >
              Add Variable
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
