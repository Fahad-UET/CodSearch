import React, { useState } from 'react';
import { Search, Plus, Calculator, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { SavedFormula } from '../../../../types/formula';

interface FormulasListProps {
  formulas: SavedFormula[];
  variables: Record<string, number>;
  onAddFormula: () => void;
  onEditFormula: (formula: SavedFormula) => void;
  onDeleteFormula: (id: string) => void;
}

export function FormulasList({
  formulas,
  variables,
  onAddFormula,
  onEditFormula,
  onDeleteFormula
}: FormulasListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFormulas, setExpandedFormulas] = useState<Set<string>>(new Set());

  const toggleFormula = (id: string) => {
    setExpandedFormulas(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredFormulas = formulas.filter(formula => 
    formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    formula.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Mes Formules Personnalisées</h3>
        <button
          onClick={onAddFormula}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle Formule
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher une formule..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
        />
        <Search 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
        />
      </div>

      {/* Formulas List */}
      <div className="space-y-4">
        {filteredFormulas.map(formula => {
          const isExpanded = expandedFormulas.has(formula.id);
          
          return (
            <div
              key={formula.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-purple-200 transition-all"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{formula.name}</h4>
                    {formula.description && (
                      <p className="text-sm text-gray-500 mt-1">{formula.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFormula(formula.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <button
                      onClick={() => onEditFormula(formula)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => onDeleteFormula(formula.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Formula Display */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calculator size={16} className="text-purple-600" />
                    <span className="text-sm font-mono">
                      {formula.formula.elements.map((element, i) => (
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
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Variables utilisées:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {formula.variables.map(variable => (
                            <div
                              key={variable.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                            >
                              <span className="text-sm text-gray-600">{variable.name}</span>
                              <span className="text-sm font-medium text-gray-900">
                                {variables[variable.name]?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Dernière mise à jour:</h5>
                        <p className="text-sm text-gray-600">
                          {formula.updatedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredFormulas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calculator size={32} className="mx-auto mb-3 text-gray-400" />
            <p>Aucune formule trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}