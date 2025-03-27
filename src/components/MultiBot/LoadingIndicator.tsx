import React from 'react';
import { Bot } from 'lucide-react';
import { AVAILABLE_MODELS } from './utils/Types';

interface LoadingIndicatorProps {
  selectedModels: string[];
}

export function LoadingIndicator({ selectedModels }: LoadingIndicatorProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start gap-3">
        <Bot className="w-8 h-8 p-1 bg-purple-100 text-purple-500 rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]" />
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg space-y-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.2s]"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-[pulse_1s_ease-in-out_infinite_0.4s]"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 loading-shimmer rounded w-1/3"></div>
            <div className="h-4 loading-shimmer rounded w-2/3"></div>
            <div className="h-4 loading-shimmer rounded w-1/2"></div>
          </div>
          <div className="text-sm text-purple-600 font-medium">
            Querying: {selectedModels.map(id => 
              AVAILABLE_MODELS.find(m => m.id === id)?.name
            ).join(' • ')}
          </div>
        </div>
      </div>
    </div>
  );
}