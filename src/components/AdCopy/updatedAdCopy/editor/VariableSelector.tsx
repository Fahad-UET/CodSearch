import React, { useState } from 'react';
import { Variable, ChevronDown, Plus } from 'lucide-react';
import AddVariableModal from './AddVariableModal';
import { useVariableStore } from '@/store/variableStore';

interface Props {
  onSelect: (variable: string) => void;
}

export default function VariableSelector({ onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { variables } = useVariableStore();

  const handleSelect = (variable: string) => {
    onSelect(`{{${variable}}}`);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-[#5D1C83] bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 hover:from-purple-50 hover:to-white shadow-sm hover:shadow-md transition-all"
        >
          <Variable className="w-4 h-4" />
          Insert Variable
          <ChevronDown className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#5D1C83] hover:bg-purple-50 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Add New Variable
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto p-1">
              {variables.map(variable => (
                <button
                  key={variable.id}
                  onClick={() => handleSelect(variable.name)}
                  className="w-full px-3 py-2 text-sm text-left hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-between group"
                >
                  <span className="font-medium text-gray-700 group-hover:text-[#5D1C83]">
                    {variable.name}
                  </span>
                  <span className="text-xs text-gray-400">{variable.value}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddVariableModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}
