import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { X } from 'lucide-react';
import { Formula, Variable, FormulaElement } from '../../types/formula';

interface FormulaEditorProps {
  formula: Formula;
  variables: Variable[];
  onFormulaChange: (formula: Formula) => void;
}

export function FormulaEditor({ formula, variables, onFormulaChange }: FormulaEditorProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'formula-editor',
    data: {
      accepts: ['operator', 'variable']
    }
  });

  const handleRemoveElement = (index: number) => {
    const newElements = [...formula.elements];
    newElements.splice(index, 1);
    onFormulaChange({ ...formula, elements: newElements });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Formula Editor</h3>
      </div>

      <div
        ref={setNodeRef}
        className={`min-h-[120px] p-4 ${
          isOver ? 'bg-purple-50' : 'bg-white'
        } transition-colors`}
      >
        <div className="flex flex-wrap gap-2 items-center min-h-[80px]">
          {formula.elements.map((element, index) => (
            <div
              key={element.id}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${
                element.type === 'operator'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              <span className="font-medium">{element.value}</span>
              <button
                onClick={() => handleRemoveElement(index)}
                className="p-0.5 hover:bg-white/20 rounded"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {formula.elements.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Drag and drop operators and variables here or click to add them
            </div>
          )}
        </div>
      </div>
    </div>
  );
}