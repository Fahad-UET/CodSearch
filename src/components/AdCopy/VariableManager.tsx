import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Globe, Package2 } from 'lucide-react';
import { useVariableStore, Variable } from '../../store/variableStore';

interface VariableManagerProps {
  productId?: string;
}

export function VariableManager({ productId }: VariableManagerProps) {
  // to resolve build issue please check this
  // const { variables, addVariable, updateVariable, deleteVariable } = useVariableStore();
  const { variables, createVariable, updateVariable, deleteVariable } = useVariableStore();
  const [newVariable, setNewVariable] = useState({ name: '', value: '', global: true });
  const [editingVariable, setEditingVariable] = useState<Variable | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newVariable.name.trim() || !newVariable.value.trim()) {
      setError('Name and value are required');
      return;
    }

    try {
      createVariable({
        name: newVariable.name.trim(),
        value: newVariable.value.trim(),
        productId: newVariable.global ? undefined : productId,
        global: newVariable.global
      });
      setNewVariable({ name: '', value: '', global: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add variable');
    }
  };

  const handleSaveEdit = () => {
    if (!editingVariable) return;
    updateVariable(editingVariable.id, editingVariable.value);
    setEditingVariable(null);
  };

  const filteredVariables = variables.filter(v => 
    v.global || v.productId === productId
  );

  return (
    <div className="space-y-6">
      {/* Add New Variable Form */}
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
              Value
            </label>
            <input
              type="text"
              value={newVariable.value}
              onChange={e => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="Variable value"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newVariable.global}
              onChange={e => setNewVariable(prev => ({ ...prev, global: e.target.checked }))}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600">Global Variable</span>
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Variable
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </form>

      {/* Variables List */}
      <div className="space-y-4">
        {filteredVariables.map(variable => (
          <div
            key={variable.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-all group"
          >
            {editingVariable?.id === variable.id ? (
              <div className="flex-1 flex items-center gap-4">
                <input
                  type="text"
                  value={editingVariable.value}
                  onChange={e => setEditingVariable(prev => prev ? { ...prev, value: e.target.value } : null)}
                  className="flex-1 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <Save size={20} />
                  </button>
                  <button
                    onClick={() => setEditingVariable(null)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {variable.global ? (
                    <Globe size={20} className="text-blue-500" />
                  ) : (
                    <Package2 size={20} className="text-purple-500" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{variable.name}</p>
                    <p className="text-sm text-gray-500">{variable.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingVariable(variable)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => deleteVariable(variable.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}