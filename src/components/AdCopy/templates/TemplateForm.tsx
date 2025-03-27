import React, { useState } from 'react';
import { Save, AlertCircle, Tag } from 'lucide-react';
import { useTemplateStore } from '../../../store/templateStore';
import { Template } from '../../../types/templates';

interface TemplateFormProps {
  template?: Template | null;
  onClose: () => void;
}

const CATEGORIES = [
  'Product Description',
  'Social Media',
  'Email Marketing',
  'Landing Page',
  'Sales Copy',
  'Promotional'
];

const CHARACTER_LIMITS = {
  facebook: 125,
  instagram: 125,
  tiktok: 150,
  snapchat: 100
};

export function TemplateForm({ template, onClose }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    content: template?.content || '',
    category: template?.category || CATEGORIES[0],
    description: template?.description || ''
  });
  const [error, setError] = useState<string | null>(null);

  const { addTemplate, updateTemplate } = useTemplateStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.content.trim()) {
      setError('Name and content are required');
      return;
    }

    try {
      // Extract variables from content
      const variables = Array.from(
        formData.content.matchAll(/\{(\w+)\}/g),
        match => match[1]
      );

      const templateData = {
        name: formData.name.trim(),
        content: formData.content.trim(),
        category: formData.category,
        description: formData.description.trim(),
        variables
      };

      if (template) {
        await updateTemplate(template.id, templateData);
      } else {
        await addTemplate(templateData);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    }
  };

  const getCharacterCount = (text: string) => {
    // Remove variable placeholders from count
    return text.replace(/\{(\w+)\}/g, '').length;
  };

  const characterCount = getCharacterCount(formData.content);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            placeholder="Enter template name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Template Content
        </label>
        <div className="relative">
          <textarea
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            rows={6}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            placeholder="Enter template content. Use {variable_name} for dynamic variables."
          />
          <div className="absolute bottom-2 right-2 text-sm">
            {Object.entries(CHARACTER_LIMITS).map(([platform, limit]) => (
              <span
                key={platform}
                className={`ml-2 ${
                  characterCount > limit ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {platform}: {characterCount}/{limit}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          placeholder="Add a description for this template"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Save size={20} />
          {template ? 'Update Template' : 'Save Template'}
        </button>
      </div>
    </form>
  );
}