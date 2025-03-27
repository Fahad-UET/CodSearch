import React, { useState, useEffect, useCallback } from 'react';
import { Box, Calculator } from 'lucide-react';
import { calculateVolumetricWeight } from '../utils/calculations';

interface VolumetricWeightCalculatorProps {
  dimensions: any;
  setDimensions: any;
  onWeightCalculated: (weight: number) => void;
}

export function VolumetricWeightCalculator({
  dimensions,
  setDimensions,
  onWeightCalculated,
}: VolumetricWeightCalculatorProps) {
  // Calculate weight whenever dimensions change
  useEffect(() => {
    const weight = calculateVolumetricWeight(
      dimensions.length,
      dimensions.width,
      dimensions.height
    );
    onWeightCalculated(weight);
  }, [dimensions.length, dimensions.width, dimensions.height]); // Remove onWeightCalculated from dependencies

  const handleDimensionChange = (dimension: keyof typeof dimensions, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setDimensions(prev => ({
      ...prev,
      [dimension]: numValue,
    }));
  };

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center gap-2 mb-2">
        <Box size={16} className="text-gray-500" />
        <label className="text-sm font-medium text-gray-700">
          Volumetric Weight Calculator (L × W × H) ÷ 5000
        </label>
      </div> */}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Length (cm)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={dimensions.length || ''}
            onChange={e => handleDimensionChange('length', e.target.value)}
            className="w-full rounded-lg border-[1px] border-black focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Width (cm)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={dimensions.width || ''}
            onChange={e => handleDimensionChange('width', e.target.value)}
            className="w-full rounded-lg border-[1px] border-black focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Height (cm)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={dimensions.height || ''}
            onChange={e => handleDimensionChange('height', e.target.value)}
            className="w-full rounded-lg border-[1px] border-black focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
        </div>
      </div>

      <div className="p-3 bg-purple-50 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator size={16} className="text-purple-600" />
          <span className="text-sm text-purple-700">Volumetric Weight:</span>
        </div>
        <span className="font-medium text-purple-900">
          {calculateVolumetricWeight(
            dimensions.length,
            dimensions.width,
            dimensions.height
          ).toFixed(2)}{' '}
          kg
        </span>
      </div>
    </div>
  );
}
