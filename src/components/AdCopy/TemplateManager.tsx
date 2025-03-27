import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag, Variable } from 'lucide-react';
import { useTemplateStore, AdTemplate } from '../../store/templateStore';
import { useVariableStore } from '../../store/variableStore';

interface TemplateManagerProps {
  onSelectTemplate?: (content: string) => void;
}

const TEMPLATE_CATEGORIES = [
  'Product Description',
  'Social Media Post',
  'Email Campaign',
  'Landing Page',
  'Sales Copy',
  'Promotional Offer',
];

export function TemplateManager({ onSelectTemplate }: TemplateManagerProps) {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplateStore();
  const { replaceVariables, variables } = useVariableStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showVariableDropdown, setShowVariableDropdown] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AdTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: TEMPLATE_CATEGORIES[0],
  });
  const [error, setError] = useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      setError('Name and content are required');
      return;
    }

    try {
      // Extract variables from content using regex
      const variables = Array.from(
        newTemplate.content.matchAll(/\{\{(\w+)\}\}/g),
        match => match[1]
      );

      addTemplate({
        name: newTemplate.name.trim(),
        content: newTemplate.content.trim(),
        category: newTemplate.category,
        variables,
      });

      setNewTemplate({
        name: '',
        content: '',
        category: TEMPLATE_CATEGORIES[0],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add template');
    }
  };

  const handleSaveEdit = () => {
    if (!editingTemplate) return;

    const variables = Array.from(
      editingTemplate.content.matchAll(/\{\{(\w+)\}\}/g),
      match => match[1]
    );

    updateTemplate(editingTemplate.id, {
      ...editingTemplate,
      variables,
    });
    setEditingTemplate(null);
  };

  const handleUseTemplate = (template: AdTemplate) => {
    const content = replaceVariables(template.content);
    onSelectTemplate(content);
  };

  const handleInsertVariable = (variableName: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = textarea.value;

    setNewTemplate(prev => ({
      ...prev,
      content: content.substring(0, start) + `{{${variableName}}}` + content.substring(end),
    }));

    // Set cursor position after inserted variable
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + variableName.length + 4; // 4 for {{ and }}
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Variable Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowVariableDropdown(!showVariableDropdown)}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
        >
          <Variable size={20} />
          Insert Variable
        </button>

        {showVariableDropdown && (
          <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
            {variables.map(variable => (
              <button
                key={variable.id}
                onClick={() => {
                  handleInsertVariable(variable.name);
                  setShowVariableDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-purple-50 flex items-center gap-2"
              >
                <Variable size={14} className="text-purple-500" />
                {variable.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TEMPLATE_CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Add/Edit Template Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
            <input
              type="text"
              value={editingTemplate?.name || newTemplate.name}
              onChange={e =>
                editingTemplate
                  ? setEditingTemplate({ ...editingTemplate, name: e.target.value })
                  : setNewTemplate({ ...newTemplate, name: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="Enter template name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={editingTemplate?.category || newTemplate.category}
              onChange={e =>
                editingTemplate
                  ? setEditingTemplate({ ...editingTemplate, category: e.target.value })
                  : setNewTemplate({ ...newTemplate, category: e.target.value })
              }
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              {TEMPLATE_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Template Content</label>
          <textarea
            ref={textareaRef}
            value={editingTemplate?.content || newTemplate.content}
            onChange={e =>
              editingTemplate
                ? setEditingTemplate({ ...editingTemplate, content: e.target.value })
                : setNewTemplate({ ...newTemplate, content: e.target.value })
            }
            rows={4}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            placeholder="Enter template content with variables like {{productName}}"
          />
        </div>

        <div className="flex justify-end gap-2">
          {editingTemplate ? (
            <>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Template
            </button>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      {/* Templates List */}
      <div className="grid grid-cols-2 gap-4">
        {templates
          .filter(template => template.category === selectedCategory)
          .map(template => (
            <div
              key={template.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.content}</p>

              {template.variables.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.variables.map(variable => (
                    <span
                      key={variable}
                      className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs flex items-center gap-1"
                    >
                      <Tag size={12} />
                      {variable}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
              >
                Use Template
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
