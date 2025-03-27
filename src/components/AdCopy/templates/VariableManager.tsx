import React, { useState } from 'react';
import { Plus, Trash2, Variable, Save, X, Tag } from 'lucide-react';

interface TemplateVariable {
  id: string;
  name: string;
  defaultValue: string;
  // to resolve build issue please check this
  category?: string;
  description?: string;
}

interface VariableManagerProps {
  variables: TemplateVariable[];
  onAddVariable: (variable: Omit<TemplateVariable, 'id'>) => void;
  onDeleteVariable: (id: string) => void;
  onEditVariable: (id: string, updates: Partial<TemplateVariable>) => void;
}

const VARIABLE_CATEGORIES = [
  { id: 'product', name: 'Product Details' },
  { id: 'pricing', name: 'Pricing' },
  { id: 'shipping', name: 'Shipping' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'custom', name: 'Custom' }
];

export function VariableManager({
  variables,
  onAddVariable,
  onDeleteVariable,
  onEditVariable
}: VariableManagerProps) {
  const [newVariable, setNewVariable] = useState({
    name: '',
    defaultValue: '',
    category: 'custom',
    description: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);
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
    setNewVariable({
      name: '',
      defaultValue: '',
      category: 'custom',
      description: ''
    });
  };

  const handleEdit = (variable: TemplateVariable) => {
    setEditingId(variable.id);
    setNewVariable({
      name: variable.name,
      defaultValue: variable.defaultValue,
      category: variable.category,
      description: variable.description || ''
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    if (!newVariable.name.trim()) {
      setError('Variable name is required');
      return;
    }

    onEditVariable(editingId, newVariable);
    setEditingId(null);
    setNewVariable({
      name: '',
      defaultValue: '',
      category: 'custom',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Variable Manager</h3>

        {/* Add/Edit Variable Form */}
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
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="e.g., productName"
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
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Default value"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newVariable.category}
              onChange={e => setNewVariable(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              {VARIABLE_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={newVariable.description}
              onChange={e => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              rows={2}
              placeholder="Describe how this variable should be used"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            {editingId ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNewVariable({
                      name: '',
                      defaultValue: '',
                      category: 'custom',
                      description: ''
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus size={16} />
                Add Variable
              </button>
            )}
          </div>
        </form>

        {/* Variables List */}
        <div className="mt-8">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Available Variables</h4>
          <div className="space-y-3">
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
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{variable.name}</p>
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                        {VARIABLE_CATEGORIES.find(c => c.id === variable.category)?.name}
                      </span>
                    </div>
                    {variable.description && (
                      <p className="text-sm text-gray-500 mt-1">{variable.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(variable)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Tag size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteVariable(variable.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {variables.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No variables defined yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}