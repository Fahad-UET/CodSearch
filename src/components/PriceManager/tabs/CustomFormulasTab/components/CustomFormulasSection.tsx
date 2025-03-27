import React, { useState } from 'react';
import { Plus, Calculator, Edit2, Trash2, Save } from 'lucide-react';
import { useFormulaStore } from '../../../../../store/formulaStore';
import { Formula } from '../../../../../types/formula';
import { FormulaEditor } from './FormulaEditor';

interface CustomFormulasSectionProps {
  variables: Record<string, number>;
}

export function CustomFormulasSection({ variables }: CustomFormulasSectionProps) {
  const { formulas, addFormula, updateFormula, deleteFormula, evaluateFormula } = useFormulaStore();
  const [showEditor, setShowEditor] = useState(false);
  const [editingFormula, setEditingFormula] = useState<any | null>(null);

  const handleSave = (formula: any) => {
    if (editingFormula) {
      updateFormula(editingFormula.id, formula);
    } else {
      addFormula({
        ...formula,
        id: `formula-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    setShowEditor(false);
    setEditingFormula(null);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Custom Formulas</h3>
        </div>
        <button
          onClick={() => setShowEditor(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Add Formula
        </button>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-2 gap-4">
        {formulas.map((formula: any) => {
          const result = evaluateFormula(formula, variables);
          
          return (
            <div
              key={formula.id}
              className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{formula.name}</h4>
                  {formula.description && (
                    <p className="text-sm text-gray-500 mt-1">{formula.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingFormula(formula);
                      setShowEditor(true);
                    }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteFormula(formula.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Formula Expression */}
              <div className="p-3 bg-white/80 rounded-lg mb-3 font-mono text-sm text-purple-900">
                {formula.formula.elements.map((element, i) => (
                  <span
                    key={i}
                    className={
                      element.type === 'operator'
                        ? 'text-purple-600 px-1'
                        : element.type === 'variable'
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    }
                  >
                    {element.value}
                  </span>
                ))}
              </div>

              {/* Result */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Result:</span>
                <span className="font-medium text-purple-900">{result.toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formula Editor Modal */}
      {showEditor && (
        <FormulaEditor
          formula={editingFormula}
          onSave={handleSave}
          onClose={() => {
            setShowEditor(false);
            setEditingFormula(null);
          }}
          availableVariables={Object.keys(variables)}
        />
      )}
    </div>
  );
}