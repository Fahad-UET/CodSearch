import React, { useState } from 'react';
import { Plus, Trash2, Variable, Save } from 'lucide-react';

interface TemplateVariable {
  id: string;
  name: string;
  defaultValue: string;
}

interface VariableManagerProps {
  variables: TemplateVariable[];
  onAddVariable: (variable: Omit<TemplateVariable, 'id'>) => void;
  onDeleteVariable: (id: string) => void;
}

export function VariableManager({ variables, onAddVariable, onDeleteVariable }: VariableManagerProps) {
  const [newVariable, setNewVariable] = useState({ name: '', defaultValue: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newVariable.name.trim()) {
      setError('Variable name is required');
      return;
    }

    // Validate variable name format
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(newVariable.name)) {
      setError('Variable name must start with a letter and contain only letters, numbers, and underscores');
      return;
    }

    // Check for duplicates
    if (variables.some(v => v.name === newVariable.name)) {
      setError('A variable with this name already exists');
      return;
    }

    onAddVariable(newVariable);
    setNewVariable({ name: '', defaultValue: '' });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Template Variables</h3>

      {/* Add Variable Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variable Name
            </label>
            <input
              type="text"
              value={newVariable.name}
              onChange={e => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., productName"
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Value
            </label>
            <input
              type="text"
              value={newVariable.defaultValue}
              onChange={e => setNewVariable(prev => ({ ...prev, defaultValue: e.target.value }))}
              placeholder="Default value"
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Variable
        </button>
      </form>

      {/* Variables List */}
      <div className="space-y-2">
        {variables.map(variable => (
          <div
            key={variable.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Variable size={16} className="text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{variable.name}</p>
                <p className="text-sm text-gray-500">{variable.defaultValue}</p>
              </div>
            </div>
            <button
              onClick={() => onDeleteVariable(variable.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {variables.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No variables defined yet
          </div>
        )}
      </div>
    </div>
  );
}