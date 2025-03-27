import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { CopyOptions } from '../../types/card-relationships';

interface CopyOptionsModalProps {
  onConfirm: (options: CopyOptions, makeChild: boolean) => void;
  onClose: () => void;
}

export function CopyOptionsModal({ onConfirm, onClose }: CopyOptionsModalProps) {
  const [options, setOptions] = useState<CopyOptions>({
    title: true,
    description: true,
    images: true,
    videos: true,
    links: true,
    prices: true,
    notes: true,
    tasks: true,
    metrics: true
  });

  const [makeChild, setMakeChild] = useState(true);

  const toggleOption = (key: keyof CopyOptions) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-3">
            <Copy className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Copy Card</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Copy Options */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Select Elements to Copy</h3>
            {Object.entries(options).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleOption(key as keyof CopyOptions)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 capitalize">{key}</span>
              </label>
            ))}
          </div>

          {/* Make Child Option */}
          <div className="pt-4 border-t">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={makeChild}
                onChange={(e) => setMakeChild(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="text-gray-900 font-medium">Make Child Card</span>
                <p className="text-sm text-gray-500">
                  Selected elements will automatically sync with the parent card
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(options, makeChild)}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Check size={16} />
            Create Copy
          </button>
        </div>
      </div>
    </div>
  );
}