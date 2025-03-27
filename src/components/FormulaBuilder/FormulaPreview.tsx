import React, { useState, useEffect } from 'react';
import { Formula } from '../../types/formula';
import { evaluateFormula, formatFormula } from '../../utils/formulaEvaluation';

interface FormulaPreviewProps {
  formula: Formula;
  variables: Record<string, number>;
}

export function FormulaPreview({ formula, variables }: FormulaPreviewProps) {
  const [result, setResult] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const value = evaluateFormula(formula, variables);
      setResult(value);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate formula');
    }
  }, [formula, variables]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Preview</h3>

      {/* Variables Display */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(variables).map(([name, value]) => (
          <div key={name} className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">{name}</div>
            <div className="font-medium text-gray-900">${value.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Formula Display */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="text-sm text-purple-600 mb-2">Formula</div>
        <div className="flex flex-wrap gap-2">
          {formula.elements.map((element) => (
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
          {formula.elements.length === 0 && (
            <span className="text-gray-500">No formula elements added yet</span>
          )}
        </div>
        {formula.elements.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            {formatFormula(formula)}
          </div>
        )}
      </div>

      {/* Result Display */}
      <div className="p-4 bg-green-50 rounded-lg">
        <div className="text-sm text-green-600 mb-2">Result</div>
        {error ? (
          <div className="text-red-600 text-sm">{error}</div>
        ) : (
          <div className="text-2xl font-bold text-green-700">
            ${result.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}