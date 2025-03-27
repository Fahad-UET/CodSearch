import React, { useState } from 'react';
import { Plus, X, AlertCircle, ArrowRight } from 'lucide-react';
import { Variable } from '../../types/formula';

interface VariablesListProps {
  variables: Variable[];
  onAddVariable: (variable: Variable) => void;
  onDeleteVariable: (id: string) => void;
}

const PREDEFINED_VARIABLES = [
  // Pricing Variables
  { name: 'purchasePrice', label: 'Purchase Price', type: 'number' },
  { name: 'salePrice', label: 'Sale Price', type: 'number' },
  { name: 'aliexpressPrice', label: 'AliExpress Price', type: 'number' },
  { name: 'alibabaPrice', label: 'Alibaba Price', type: 'number' },
  { name: 'amazonPrice', label: 'Amazon Price', type: 'number' },
  { name: 'noonPrice', label: 'Noon Price', type: 'number' },
  
  // Cost Variables
  { name: 'shippingCost', label: 'Shipping Cost', type: 'number' },
  { name: 'returnCost', label: 'Return Cost', type: 'number' },
  { name: 'chargePerProduct', label: 'Charge Per Product', type: 'number' },
  { name: 'totalMonthlyExpenses', label: 'Total Monthly Expenses', type: 'number' },
  
  // Advertising Metrics
  { name: 'cpc', label: 'Cost Per Click (CPC)', type: 'number' },
  { name: 'cpl', label: 'Cost Per Lead (CPL)', type: 'number' },
  { name: 'cpm', label: 'Cost Per Mille (CPM)', type: 'number' },
  { name: 'roas', label: 'Return on Ad Spend (ROAS)', type: 'percentage' },
  { name: 'ctr', label: 'Click-Through Rate (CTR)', type: 'percentage' },
  
  // Performance Metrics
  { name: 'codFee', label: 'COD Fee', type: 'percentage' },
  { name: 'confirmationRate', label: 'Confirmation Rate', type: 'percentage' },
  { name: 'deliveryRate', label: 'Delivery Rate', type: 'percentage' },
  { name: 'profitMargin', label: 'Profit Margin', type: 'percentage' }
];

export function VariablesList({ variables, onAddVariable, onDeleteVariable }: VariablesListProps) {
  // to resolve build issue please check this
  // const [newVariable, setNewVariable] = useState({ name: '', type: 'number' as const });
  const [newVariable, setNewVariable] = useState<{name: string, type: 'number' | 'percentage'}>({ name: '', type: 'number' as const });
  const [error, setError] = useState<string | null>(null);
  const [selectedPredefined, setSelectedPredefined] = useState('');

  const handleAddVariable = () => {
    if (!newVariable.name.trim()) {
      setError('Variable name is required');
      return;
    }

    if (variables.some(v => v.name === newVariable.name)) {
      setError('Variable name must be unique');
      return;
    }

    onAddVariable({
      id: `var-${Date.now()}`,
      name: newVariable.name.trim(),
      type: newVariable.type
    });

    setNewVariable({ name: '', type: 'number' });
    setError(null);
  };

  const handleAddPredefined = () => {
    if (!selectedPredefined) return;

    const predefined = PREDEFINED_VARIABLES.find(v => v.name === selectedPredefined);
    if (!predefined) return;

    if (variables.some(v => v.name === predefined.name)) {
      setError('Variable already exists');
      return;
    }

    onAddVariable({
      id: `var-${Date.now()}`,
      name: predefined.name,
      type: predefined.type as 'number' | 'percentage'
    });

    setSelectedPredefined('');
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Variables</h3>
      </div>

      <div className="p-4">
        {/* Predefined Variables Dropdown */}
        <div className="mb-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Add Predefined Variable
          </label>
          <div className="flex gap-2">
            <select
              value={selectedPredefined}
              onChange={(e) => setSelectedPredefined(e.target.value)}
              className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              <option value="">Select a variable...</option>
              <optgroup label="Pricing">
                {PREDEFINED_VARIABLES.slice(0, 6).map((variable) => (
                  <option key={variable.name} value={variable.name}>
                    {variable.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Costs">
                {PREDEFINED_VARIABLES.slice(6, 10).map((variable) => (
                  <option key={variable.name} value={variable.name}>
                    {variable.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Advertising Metrics">
                {PREDEFINED_VARIABLES.slice(10, 15).map((variable) => (
                  <option key={variable.name} value={variable.name}>
                    {variable.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Performance Metrics">
                {PREDEFINED_VARIABLES.slice(15).map((variable) => (
                  <option key={variable.name} value={variable.name}>
                    {variable.label}
                  </option>
                ))}
              </optgroup>
            </select>
            <button
              onClick={handleAddPredefined}
              disabled={!selectedPredefined}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-4 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Add Custom Variable
          </label>
          {/* Add Variable Form */}
          <div className="space-y-3 mb-4">
            <input
              type="text"
              value={newVariable.name}
              onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
              placeholder="Variable name"
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
            <select
              value={newVariable.type}
              onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value as 'number' | 'percentage' })}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              <option value="number">Number</option>
              <option value="percentage">Percentage</option>
            </select>
            <button
              onClick={handleAddVariable}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Custom Variable
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Variables List */}
        <div className="space-y-2">
          {variables.map((variable) => (
            <div
              key={variable.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div>
                <span className="font-medium text-gray-900">{variable.name}</span>
                <span className="ml-2 text-sm text-gray-500">({variable.type})</span>
              </div>
              <button
                onClick={() => onDeleteVariable(variable.id)}
                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>
          ))}

          {variables.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-4">
              No variables added yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}