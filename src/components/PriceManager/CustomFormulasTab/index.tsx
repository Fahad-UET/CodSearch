import React, { useState } from 'react';
import { Calculator, Plus, AlertCircle } from 'lucide-react';
import { Formula, SavedFormula } from '../../../types/formula';
import { ProfitabilityGraph } from './components/ProfitabilityGraph';
import { FormulaEditor } from '@/components/PriceManager/tabs/CustomFormulasTab/components/FormulaEditor';
import { FormulasList } from './components/FormulasList';
import { MetricsGrid } from './components/MetricsGrid';
import { ExpenseBreakdown } from './components/ExpenseBreakdown';
import { ServiceParticipation } from './components/ServiceParticipation';
import { ProfitabilityAnalysis } from './components/ProfitabilityAnalysis';

interface CustomFormulasTabProps {
  variables: Record<string, number>;
}

export function CustomFormulasTab({ variables }: CustomFormulasTabProps) {
  const [formulas, setFormulas] = useState<SavedFormula[]>([]);
  const [selectedFormula, setSelectedFormula] = useState<SavedFormula | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddFormula = () => {
    setSelectedFormula(null);
    setShowEditor(true);
  };

  const handleEditFormula = (formula: SavedFormula) => {
    setSelectedFormula(formula);
    setShowEditor(true);
  };

  const handleSaveFormula = (formula: SavedFormula) => {
    try {
      if (selectedFormula) {
        // Update existing formula
        setFormulas(prev => prev.map(f => 
          f.id === selectedFormula.id ? { ...formula, updatedAt: new Date() } : f
        ));
      } else {
        // Add new formula
        setFormulas(prev => [...prev, {
          ...formula,
          id: `formula-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
      }
      setShowEditor(false);
      setSelectedFormula(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save formula');
    }
  };

  const handleDeleteFormula = (id: string) => {
    setFormulas(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calculator size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Formules Personnalisées</h2>
            <p className="text-sm text-gray-500">Créez et gérez vos formules de calcul</p>
          </div>
        </div>
        <button
          onClick={handleAddFormula}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle Formule
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Formulas List */}
        <div className="col-span-1 space-y-6">
          <FormulasList
            formulas={formulas}
            variables={variables}
            onEditFormula={handleEditFormula}
            onDeleteFormula={handleDeleteFormula}
            onAddFormula={handleAddFormula}
          />
        </div>

        {/* Right Column - Metrics and Analysis */}
        <div className="col-span-2 space-y-6">
          {/* Metrics Grid */}
          <MetricsGrid variables={variables} />

          {/* Expense Breakdown */}
          <ExpenseBreakdown variables={variables} />

          {/* Service Participation */}
          <ServiceParticipation variables={variables} />
        </div>
      </div>

      {/* Formula Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl w-full max-w-4xl">
            <FormulaEditor
              formula={selectedFormula}
              availableVariables={variables}
              onSave={handleSaveFormula}
              onClose={() => {
                setShowEditor(false);
                setSelectedFormula(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}