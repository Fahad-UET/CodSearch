import React, { useState } from 'react';
import { Calculator, Plus, Edit2, Trash2, Play, Save } from 'lucide-react';
import { Formula } from '../../../../types/formula';
import { evaluateFormula } from '../../../../utils/formulaEvaluation';

interface CustomFormulasSectionProps {
  formulas: Formula[];
  variables: Record<string, number>;
  onAddFormula?: () => void;
  onEditFormula?: (id: string) => void;
  onDeleteFormula?: (id: string) => void;
  onSaveFormula?: (formula: Formula) => void;
}

export function CustomFormulasSection({
  formulas,
  variables,
  onAddFormula,
  onEditFormula,
  onDeleteFormula,
  onSaveFormula
}: CustomFormulasSectionProps) {
  const [expandedFormula, setExpandedFormula] = useState<string | null>(null);

  const evaluateFormulaWithVariables = (formula: Formula) => {
    try {
      return evaluateFormula(formula, variables);
    } catch (error) {
      console.error('Failed to evaluate formula:', error);
      return 0;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator size={20} className="text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Custom Formulas</h3>
        </div>
        {onAddFormula && (
          <button
            onClick={onAddFormula}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Formula
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {formulas.map((formula: any) => {
          const isExpanded = expandedFormula === formula.id;
          const result = evaluateFormulaWithVariables(formula);

          return (
            <div
              key={formula.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-purple-200 transition-all shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{formula.name}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedFormula(isExpanded ? null : formula.id)}
                      className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title={isExpanded ? 'Show less' : 'Show more'}
                    >
                      <Play
                        size={16}
                        className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {onEditFormula && (
                      <button
                        onClick={() => onEditFormula(formula.id)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit formula"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDeleteFormula && (
                      <button
                        onClick={() => onDeleteFormula(formula.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete formula"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="text-sm text-gray-500">
                    {formula.elements.map((element, i) => (
                      <span
                        key={i}
                        className={
                          element.type === 'operator'
                            ? 'text-purple-600 px-1'
                            : element.type === 'variable'
                            ? 'text-blue-600'
                            : ''
                        }
                      >
                        {element.value}
                      </span>
                    ))}
                  </div>
                  <div className="text-lg font-semibold text-purple-600">
                    = {result.toFixed(2)}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700">Variables Used:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {formula.elements
                          .filter(el => el.type === 'variable')
                          .map((variable, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <span className="text-sm text-gray-600">{variable.value}</span>
                              <span className="text-sm font-medium text-gray-900">
                                {variables[variable.value]?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {formulas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calculator size={32} className="mx-auto mb-3 text-gray-400" />
            <p>No custom formulas yet. Click "Add Formula" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
}