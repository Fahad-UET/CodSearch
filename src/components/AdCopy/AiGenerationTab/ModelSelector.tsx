import React from 'react';
import { Info } from 'lucide-react';

interface ModelSelectorProps {
  // to resolve build issue please check this
  model?: string;
  onChange?: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ model, onChange }) => {
  const models = [
    {
      id: 'gpt-4-turbo-preview',
      name: 'GPT-4 Turbo',
      description: 'Most capable model, best for complex tasks',
      context: '128K tokens'
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'More capable than GPT-3.5, better at complex tasks',
      context: '8K tokens'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Good balance of capability and speed',
      context: '16K tokens'
    },
    {
      id: 'gpt-3.5-turbo-16k',
      name: 'GPT-3.5 Turbo 16K',
      description: 'Same as GPT-3.5 but with larger context',
      context: '16K tokens'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        ChatGPT Model
      </label>
      <div className="grid gap-3">
        {models.map(m => (
          <label
            key={m.id}
            className={`relative flex items-start p-3 cursor-pointer rounded-lg border ${
              model === m.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="model"
              value={m.id}
              checked={model === m.id}
              onChange={e => onChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {m.name}
                </span>
                <div className="group relative">
                  <Info size={14} className="text-gray-400" />
                  <div className="absolute left-full ml-2 hidden group-hover:block w-48 p-2 text-xs bg-gray-900 text-white rounded shadow-lg">
                    Context window: {m.context}
                  </div>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {m.description}
              </p>
            </div>
            <div className="ml-3 flex h-5 items-center">
              <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                model === m.id 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {model === m.id && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};