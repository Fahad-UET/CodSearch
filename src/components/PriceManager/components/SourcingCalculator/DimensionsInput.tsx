import React from 'react';
import { Box } from 'lucide-react';

interface DimensionsInputProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  onChange: (dimensions: { length: number; width: number; height: number }) => void;
}

export function DimensionsInput({ dimensions, onChange }: DimensionsInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <div className="flex items-center gap-2">
          <Box size={16} className="text-gray-400" />
          <span>Package Dimensions (cm)</span>
        </div>
      </label>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Length</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={dimensions.length}
            onChange={(e) => onChange({
              ...dimensions,
              length: parseFloat(e.target.value) || 0
            })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Width</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={dimensions.width}
            onChange={(e) => onChange({
              ...dimensions,
              width: parseFloat(e.target.value) || 0
            })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Height</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={dimensions.height}
            onChange={(e) => onChange({
              ...dimensions,
              height: parseFloat(e.target.value) || 0
            })}
            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>
      </div>
    </div>
  );
}