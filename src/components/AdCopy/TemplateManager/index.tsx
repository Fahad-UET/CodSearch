import React, { useState, useRef } from 'react';
import { Plus, Save, X, Tag, Variable } from 'lucide-react';
import { VariableManager } from './VariableManager';
import { useVariableStore } from '../../../store/variableStore';

interface TemplateVariable {
  id: string;
  name: string;
  defaultValue: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
  variables: TemplateVariable[];
  category: string;
  createdAt: Date;
}

interface TemplateManagerProps {
  onSelectTemplate: (content: string) => void;
}

export function TemplateManager({ onSelectTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: 'general'
  });
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { variables: globalVariables } = useVariableStore();

  const handleAddVariable = (variable: Omit<TemplateVariable, 'id'>) => {
    setVariables(prev => [...prev, {
      ...variable,
      id: `var-${Date.now()}`
    }]);
  };

  const handleDeleteVariable = (id: string) => {
    setVariables(prev => prev.filter(v => v.id !== id));
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      setError('Template name and content are required');
      return;
    }

    const template: Template = {
      id: `template-${Date.now()}`,
      name: newTemplate.name.trim(),
      content: newTemplate.content.trim(),
      variables: [...variables],
      category: newTemplate.category,
      createdAt: new Date()
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ name: '', content: '', category: 'general' });
    setError(null);
  };

  const handleUseTemplate = (template: Template) => {
    let content = template.content;
    
    // Replace variables with their default values
    template.variables.forEach(variable => {
      const regex = new RegExp(`{{${variable.name}}}`, 'g');
      content = content.replace(regex, variable.defaultValue);
    });

    onSelectTemplate(content);
  };

  const insertVariable = (variableName: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = textarea.value;
    const newContent = content.substring(0, start) + `{{${variableName}}}` + content.substring(end);
    
    setNewTemplate(prev => ({
      ...prev,
      content: newContent
    }));

    // Set cursor position after the inserted variable
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + variableName.length + 4; // 4 for the {{ and }}
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'general', label: 'General' },
    { id: 'product', label: 'Product' },
    { id: 'promotional', label: 'Promotional' },
    { id: 'seasonal', label: 'Seasonal' }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              selectedCategory === category.id
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Variable Manager */}
      <VariableManager
        variables={variables}
        onAddVariable={handleAddVariable}
        onDeleteVariable={handleDeleteVariable}
      />

      {/* Quick Variable Buttons */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Variables</h4>
        <div className="flex flex-wrap gap-2">
          {[...variables, ...globalVariables].map(variable => (
            <button
              key={variable.id}
              onClick={() => insertVariable(variable.name)}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors flex items-center gap-1.5"
            >
              <Variable size={14} />
              {variable.name}
            </button>
          ))}
        </div>
      </div>

      {/* Template Form */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create Template</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Name
            </label>
            <input
              type="text"
              value={newTemplate.name}
              onChange={e => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="Enter template name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={newTemplate.category}
              onChange={e => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            >
              {categories.filter(c => c.id !== 'all').map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template Content
            </label>
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={newTemplate.content}
                onChange={e => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                placeholder="Enter template content. Click variable buttons above to insert variables."
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            onClick={handleSaveTemplate}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Template
          </button>
        </div>
      </div>

      {/* Templates List */}
      <div className="grid grid-cols-2 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-200 transition-all"
          >
            <h4 className="font-medium text-gray-900">{template.name}</h4>
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600 line-clamp-3">{template.content}</p>
              {template.variables.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {template.variables.map(variable => (
                    <span
                      key={variable.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs"
                    >
                      <Variable size={12} />
                      {variable.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleUseTemplate(template)}
              className="mt-4 w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
            >
              Use Template
            </button>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-500">
            No templates found in this category
          </div>
        )}
      </div>
    </div>
  );
}