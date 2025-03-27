import React from 'react';
import { useFormulaStore } from '../../../store/formulaStore';

interface CustomFormulasTabProps {
  variables: Record<string, number>;
}

export function CustomFormulasTab({ variables }: CustomFormulasTabProps) {
  const { formulas, evaluateFormula } = useFormulaStore();

  return (
    <div className="grid grid-cols-3 gap-6">
      {formulas.map((formula) => {
        const result = evaluateFormula(formula, variables);
        
        return (
          <div
            key={formula.id}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-200 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {formula.name}
            </h3>
            {formula.description && (
              <p className="text-sm text-gray-500 mb-4">{formula.description}</p>
            )}

            <div className="space-y-2">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">Formula</div>
                <div className="flex flex-wrap gap-1">
                  {formula.formula.elements.map((element) => (
                    <span
                      key={element.id}
                      className={`inline-block px-2 py-1 rounded text-sm ${
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

              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Result</div>
                <div className="text-2xl font-bold text-green-700">
                  {result.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {formulas.length === 0 && (
        <div className="col-span-3 text-center py-12 text-gray-500">
          <p>No custom formulas created yet.</p>
          <p className="text-sm mt-1">
            Use the Formula Builder to create custom calculations.
          </p>
        </div>
      )}
    </div>
  );
}