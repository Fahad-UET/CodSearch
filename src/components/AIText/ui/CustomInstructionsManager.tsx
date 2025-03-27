import React, { useState } from 'react';
import { Plus, Star, StarOff, Pencil, Trash2, Save, X } from 'lucide-react';
// import type { any } from '../../types/customInstructions';
import { useCustomInstructionsStore } from '@/store/CustomInstructionsStore';

interface Props {
  onSelect: (content: string) => void;
  activeTab: string;
  product: any;
}

export default function CustomInstructionsManager({ onSelect, activeTab, product }: Props) {
  const {
    instructions,
    createInstruction,
    updateInstruction,
    deleteInstruction,
    setDefaultInstruction,
  } = useCustomInstructionsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({
    name: '',
    content: '',
    tabId: activeTab,
    isDefault: false,
  });

  // Filter instructions for current tab
  const tabInstructions = React.useMemo(
    () => instructions.filter(instruction => instruction.tabId === activeTab),
    [instructions, activeTab]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateInstruction(editingId, formData);
    } else {
      createInstruction({ ...formData, tabId: activeTab });
    }

    setFormData({ name: '', content: '', tabId: activeTab, isDefault: false });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (id: string) => {
    const instruction = instructions.find(i => i.id === id);
    if (!instruction) return;

    setFormData({
      tabId: instruction.tabId,
      name: instruction.name,
      content: instruction.content,
      isDefault: instruction.isDefault,
    });
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93] transition-all"
      >
        <Plus className="w-4 h-4" />
        Add New Custom Instruction
      </button>

      {showForm && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              onKeyDown={e => e.stopPropagation()}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              onKeyDown={e => e.stopPropagation()}
              className="w-full h-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5D1C83] resize-none"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onKeyDown={e => e.stopPropagation()}
              onChange={e => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              className="rounded border-gray-300 text-[#5D1C83] focus:ring-[#5D1C83]"
            />
            <label htmlFor="isDefault" className="ml-2 text-sm text-gray-600">
              Set as default instruction
            </label>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onKeyDown={e => e.stopPropagation()}
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: '', content: '', isDefault: false });
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              onKeyDown={e => e.stopPropagation()}
              className="px-4 py-2 text-sm bg-[#5D1C83] text-white rounded-lg hover:bg-[#6D2C93]"
            >
              {editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Saved Instructions</h3>
        {tabInstructions.map(instruction => (
          <div
            key={instruction.id}
            className="p-3 bg-white rounded-lg border border-gray-200 hover:border-[#5D1C83]/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{instruction.name}</h4>
                {instruction.isDefault && (
                  <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onSelect(instruction.content)}
                  className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all"
                  title="Use this instruction"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDefaultInstruction(instruction.id)}
                  className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all"
                  title={instruction.isDefault ? 'Remove default' : 'Set as default'}
                >
                  {instruction.isDefault ? (
                    <StarOff className="w-4 h-4" />
                  ) : (
                    <Star className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(instruction.id)}
                  className="p-1.5 text-gray-500 hover:text-[#5D1C83] hover:bg-purple-50 rounded-lg transition-all"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteInstruction(instruction.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{instruction.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
