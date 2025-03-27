import React from 'react';
import { X } from 'lucide-react';
import { AVAILABLE_MODELS } from './utils/Types';

interface SelectedModelsProps {
  selectedModels: string[];
  toggleModel: (modelId: string) => void;
}

export function SelectedModels({ selectedModels, toggleModel }: SelectedModelsProps) {
  return (
    <div className="p-4 flex flex-wrap gap-2">
      {selectedModels.map(modelId => {
        const model = AVAILABLE_MODELS.find(m => m.id === modelId);
        if (!model) return null;
        return (
          <div key={modelId} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm whitespace-nowrap backdrop-blur-sm shadow-[0_2px_10px_rgb(0,0,0,0.1)] hover:bg-gray-100 transition-colors">
            <span>{model.name}</span>
            <button 
              onClick={() => toggleModel(modelId)}
              className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}