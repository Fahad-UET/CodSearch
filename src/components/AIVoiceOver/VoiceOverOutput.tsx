import React from 'react';
import { FileDown, Volume2, History } from 'lucide-react';

interface Props {
  output: string;
  generatedAudio: Record<string, string[]>;
  activeTab: string;
}

export default function VoiceOverOutput({ output, generatedAudio, activeTab }: Props) {
  const currentTabGenerations = generatedAudio[activeTab] || [];

  if (!output && currentTabGenerations.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* History section */}
      {currentTabGenerations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#2980B9]" />
              <h3 className="font-medium text-gray-700">Generation History</h3>
              <span className="text-sm text-gray-500">
                ({currentTabGenerations.length} generation
                {currentTabGenerations.length !== 1 ? 's' : ''})
              </span>
            </div>
          </div>

          {/* History grid */}
          <div className="grid grid-cols-3 gap-4">
            {currentTabGenerations.map((audioUrl, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:border-[#2980B9]/20 hover:bg-blue-50/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    Generation #{currentTabGenerations.length - index}
                  </span>
                  <button
                    onClick={() => {
                      // Handle download
                    }}
                    className="p-1.5 text-gray-500 hover:text-[#2980B9] hover:bg-white rounded-lg transition-all"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                </div>
                <audio src={audioUrl} controls className="w-full" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
