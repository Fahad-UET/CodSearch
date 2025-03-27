import React from 'react';
import { Trash2, Calculator, Edit2 } from 'lucide-react';
import { useFormulaStore } from '../../store/formulaStore';
import { SavedFormula } from '../../types/formula';

interface SavedFormulasProps {
  onSelect: (formula: SavedFormula) => void;
}

export function SavedFormulas({ onSelect }: SavedFormulasProps) {
  const { formulas, deleteFormula } = useFormulaStore();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Saved Formulas</h3>
      </div>

      <div className="p-4">
        {formulas.length > 0 ? (
          <div className="space-y-3">
            {formulas.map((formula) => (
              <div
                key={formula.id}
                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{formula.name}</h4>
                    {formula.description && (
                      <p className="text-sm text-gray-500">{formula.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onSelect(formula)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit formula"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteFormula(formula.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete formula"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  {formula.formula.elements.map((element) => (
                    <span
                      key={element.id}
                      className={`inline-block px-1.5 py-0.5 rounded mr-1 ${
                        element.type === 'operator'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {element.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calculator size={32} className="mx-auto mb-2 text-gray-400" />
            <p>No saved formulas yet</p>
          </div>
        )}
      </div>
    </div>
  );
}