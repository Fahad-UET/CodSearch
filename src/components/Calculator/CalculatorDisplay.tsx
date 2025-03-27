import React from 'react';

interface CalculatorDisplayProps {
  value: string;
  formula: string;
}

export function CalculatorDisplay({ value, formula }: CalculatorDisplayProps) {
  return (
    <div className="p-4 md:px-8 md:py-2 bg-gradient-to-br from-white to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm px-6 py-2 rounded-xl shadow-inner border border-purple-100">
        <div className="text-right text-lg font-mono text-gray-500 truncate mb-2">
          {formula || '\u00A0'}
        </div>
        <div className="text-right text-3xl md:text-5xl font-mono text-gray-900 truncate font-bold">
          {value}
        </div>
      </div>
    </div>
  );
}