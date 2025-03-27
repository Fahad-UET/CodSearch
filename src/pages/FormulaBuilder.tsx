import React, { useState } from 'react';
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { X, Save, Calculator, AlertCircle, ArrowLeft } from 'lucide-react';
import { useFormulaStore } from '../store/formulaStore';
import { Formula, Variable, FormulaElement } from '../types/formula';
import { DraggableBlocks } from '../components/FormulaBuilder/DraggableBlocks';
import { FormulaEditor } from '../components/FormulaBuilder/FormulaEditor';
import { FormulaPreview } from '../components/FormulaBuilder/FormulaPreview';
import { SavedFormulas } from '../components/FormulaBuilder/SavedFormulas';

interface FormulaBuilderProps {
  onClose: () => void;
}

// Example variables with values
const EXAMPLE_VARIABLES = {
  purchasePrice: 10.00,
  salePrice: 29.99,
  aliexpressPrice: 8.50,
  alibabaPrice: 7.50,
  amazonPrice: 24.99,
  noonPrice: 27.99,
  cpc: 0.50,
  cpl: 2.00,
  cpm: 5.00,
  roas: 2.5,
  ctr: 1.5,
  confirmationRate: 60,
  deliveryRate: 85,
  profitMargin: 45,
  chargePerProduct: 2.45,
  totalMonthlyExpenses: 245.00
};

export function FormulaBuilder({ onClose }: FormulaBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [formula, setFormula] = useState<Formula>({ elements: [] });
  const { addFormula } = useFormulaStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type === 'operator' || active.data.current?.type === 'variable') {
      setFormula(prev => ({
        ...prev,
        elements: [...prev.elements, {
          id: `element-${Date.now()}`,
          type: active.data.current?.type,
          value: active.data.current?.value
        }]
      }));
    }
  };

  const handleAddElement = (element: { type: string; value: string }) => {
    setFormula(prev => ({
      ...prev,
      elements: [...prev.elements, {
        id: `element-${Date.now()}`,
        type: element.type as "number" | "operator" | "variable" | "parenthesis",
        value: element.value
      }]
    }));
  };

  const handleSave = async () => {
    try {
      if (!name.trim()) {
        setError('Formula name is required');
        return;
      }

      if (formula.elements.length === 0) {
        setError('Formula cannot be empty');
        return;
      }

      await addFormula({
        id: `formula-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        variables,
        formula,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setName('');
      setDescription('');
      setVariables([]);
      setFormula({ elements: [] });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save formula');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calculator size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Formula Builder</h1>
                    <p className="text-sm text-gray-500">Create and test custom formulas</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Save size={20} />
                Save Formula
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Formula Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="Enter formula name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  placeholder="Enter formula description"
                />
              </div>
            </div>
          </div>
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          {/* Main Formula Building Area */}
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6 mb-6">
            <div className="min-h-[200px] bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
              <FormulaEditor
                formula={formula}
                variables={variables}
                onFormulaChange={setFormula}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Variables and Operators */}
            <div className="col-span-8 space-y-6">
              {/* Draggable Blocks */}
              <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
                <DraggableBlocks 
                  onAddElement={handleAddElement} 
                  variables={EXAMPLE_VARIABLES}
                />
              </div>

              {/* Formula Preview */}
              <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
                <FormulaPreview
                  formula={formula}
                  variables={EXAMPLE_VARIABLES}
                />
              </div>
            </div>

            {/* Right Panel - Saved Formulas */}
            <div className="col-span-4">
              <SavedFormulas
                onSelect={(savedFormula) => {
                  setName(savedFormula.name);
                  setDescription(savedFormula.description || '');
                  setVariables(savedFormula.variables);
                  setFormula(savedFormula.formula);
                }}
              />
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
}