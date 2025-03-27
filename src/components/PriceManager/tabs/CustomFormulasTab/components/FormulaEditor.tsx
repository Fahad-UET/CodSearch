import React, { useState } from 'react';
import { X, Save, Plus, AlertCircle } from 'lucide-react';
import { Formula, FormulaElement } from '../../../../../types/formula';

interface FormulaEditorProps {
  // formula: Formula | null;
  formula: any | null;
  onSave: (formula: any) => void;
  onClose: () => void;
  availableVariables: any;
}

export function FormulaEditor({ formula, onSave, onClose, availableVariables }: FormulaEditorProps) {
  const [name, setName] = useState(formula?.name || '');
  const [description, setDescription] = useState(formula?.description || '');
  const [elements, setElements] = useState<FormulaElement[]>(formula?.formula.elements || []);
  const [error, setError] = useState<string | null>(null);

  const operators = ['+', '-', '×', '÷', '(', ')', '%'];

  const handleAddElement = (type: 'operator' | 'variable', value: string) => {
    setElements(prev => [
      ...prev,
      {
        id: `element-${Date.now()}-${Math.random()}`,
        type,
        value
      }
    ]);
  };

  const handleRemoveElement = (index: number) => {
    setElements(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Formula name is required');
      return;
    }

    if (elements.length === 0) {
      setError('Formula cannot be empty');
      return;
    }

    onSave({
      name,
      description,
      formula: { elements }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[110]">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">
            {formula ? 'Edit Formula' : 'Create Formula'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Formula Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formula Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Enter formula name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                rows={2}
                placeholder="Enter formula description"
              />
            </div>
          </div>

          {/* Formula Builder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Build Formula
            </label>

            {/* Elements Display */}
            <div className="p-4 bg-gray-50 rounded-lg mb-4 min-h-[60px] flex flex-wrap gap-2">
              {elements.map((element, index) => (
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
              {elements.length === 0 && (
                <div className="text-gray-400 text-sm">
                  Click operators and variables below to build your formula
                </div>
              )}
            </div>

            {/* Operators */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Operators</h4>
              <div className="flex flex-wrap gap-2">
                {operators.map(op => (
                  <button
                    key={op}
                    onClick={() => handleAddElement('operator', op)}
                    className="w-10 h-10 flex items-center justify-center bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            {/* Variables */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Variables</h4>
              <div className="flex flex-wrap gap-2">
                {availableVariables.map(variable => (
                  <button
                    key={variable}
                    onClick={() => handleAddElement('variable', variable)}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Save size={16} />
            Save Formula
          </button>
        </div>
      </div>
    </div>
  );
}