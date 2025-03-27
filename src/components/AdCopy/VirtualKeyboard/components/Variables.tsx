import React from 'react';
import { Edit2, Trash2, Plus, X, Save } from 'lucide-react';
import { TextVariable } from '../types';

interface VariablesProps {
  variables: TextVariable[];
  onVariableSelect: (value: string) => void;
  onAddVariable: (name: string, value: string) => void;
  onEditVariable: (id: string, name: string, value: string) => void;
  onDeleteVariable: (id: string) => void;
}

export function Variables({
  variables,
  onVariableSelect,
  onAddVariable,
  onEditVariable,
  onDeleteVariable,
}: VariablesProps) {
  const [editingVariable, setEditingVariable] = React.useState<TextVariable | null>(null);
  const [newVariable, setNewVariable] = React.useState({ name: '', value: '' });

  const handleSaveEdit = () => {
    if (!editingVariable || !newVariable.name || !newVariable.value) return;
    onEditVariable(editingVariable.id, newVariable.name, newVariable.value);
    setEditingVariable(null);
    setNewVariable({ name: '', value: '' });
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {variables.map((variable) => (
          <div
            key={variable.id}
            className="flex items-center justify-between p-2 bg-white rounded-lg group"
          >
            <button
              onClick={() => onVariableSelect(`{{${variable.name}}}`)}
              className="flex items-center gap-2 flex-1 hover:bg-blue-50 p-2 rounded-lg transition-colors"
            >
              <variable.icon size={16} className="text-blue-600" />
              <span className="text-sm font-medium">{variable.name}</span>
            </button>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditingVariable(variable);
                  setNewVariable({ name: variable.name, value: variable.value });
                }}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDeleteVariable(variable.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={editingVariable ? "Edit variable name" : "Variable name"}
          value={newVariable.name}
          onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
          className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <input
          type="text"
          placeholder={editingVariable ? "Edit default value" : "Default value"}
          value={newVariable.value}
          onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
          className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        {editingVariable ? (
          <>
            <button
              onClick={handleSaveEdit}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save size={20} />
            </button>
            <button
              onClick={() => {
                setEditingVariable(null);
                setNewVariable({ name: '', value: '' });
              }}
              className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              if (!newVariable.name || !newVariable.value) return;
              onAddVariable(newVariable.name, newVariable.value);
              setNewVariable({ name: '', value: '' });
            }}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </div>
  );
}