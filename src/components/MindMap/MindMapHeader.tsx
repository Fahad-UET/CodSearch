import React from 'react';
import { X } from 'lucide-react';
import { MindMapIcon } from './MindMapIcon';

interface MindMapHeaderProps {
  title: string;
  onClose: () => void;
}

export function MindMapHeader({ title, onClose }: MindMapHeaderProps) {
  return (
    <div className="flex justify-between items-center p-6 border-b border-purple-100 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <MindMapIcon type="brain" className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-purple-900">{title}</h2>
          <p className="text-sm text-purple-600">Organize your thoughts visually</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X size={24} />
      </button>
    </div>
  );
}