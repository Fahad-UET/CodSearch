import React from 'react';
import { History, ChevronDown, ChevronUp } from 'lucide-react';
import { TABS } from '../ui/constant';

interface Props {
  tabId: string;
  output: string;
}

export default function LatestGeneration({ tabId, output }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  if (!output) return null;

  const tab = TABS.find(t => t.id === tabId);
  if (!tab) return null;

  return (
    <div className="space-y-4">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:border-[#5D1C83]/20 hover:bg-purple-50/30 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <History className={`w-5 h-5 ${tab.textColor}`} />
          <h2 className="text-lg font-medium text-gray-700">Latest {tab.label} Generation</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div className={`p-4 bg-gray-50 rounded-lg border ${tab.borderColor}`}>
          <p className="text-gray-700 whitespace-pre-wrap">{output}</p>
        </div>
      )}
    </div>
  );
}
