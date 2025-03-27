import React, { RefObject } from 'react';
import { X, Check, ImageIcon } from 'lucide-react';
import { AVAILABLE_MODELS } from './utils/Types';

interface ModelPanelProps {
  isModelPanelOpen: boolean;
  modelPanelRef: RefObject<HTMLDivElement>;
  selectedModels: string[];
  toggleModel: (modelId: string) => void;
  setIsModelPanelOpen: (open: boolean) => void;
}

export function ModelPanel({
  isModelPanelOpen,
  modelPanelRef,
  selectedModels,
  toggleModel,
  setIsModelPanelOpen
}: ModelPanelProps) {
  return (
    <div 
      ref={modelPanelRef}
      className={`fixed top-[88px] left-0 right-0 z-20 shadow-lg transition-opacity duration-300 ${
        isModelPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ backgroundColor: '#374151' }}
    >
      <div className="container mx-auto px-4 py-6 text-white border-t border-gray-600">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Available Models</h2>
          <button 
            onClick={() => setIsModelPanelOpen(false)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AVAILABLE_MODELS.map(model => {
            const isSelected = selectedModels.includes(model.id);
            const canToggle = selectedModels.length > 1 || !isSelected;
            return (
              <div key={model.id} className="relative group w-full">
                <button
                  onClick={() => toggleModel(model.id)}
                  disabled={!canToggle}
                  className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  } ${!canToggle ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-1">
                      {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                      <span className="text-xs">
                        {model.name}
                      </span>
                      <span className="text-xs text-green-600 ml-2">
                        1K tokens: {model.creditsPerThousandTokens} credits
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      {model.supportsImages && (
                        <ImageIcon className="w-4 h-4 opacity-75 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}