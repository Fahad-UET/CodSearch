import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Plus, Minus, X as Multiply, Divide, Percent, LucideIcon } from 'lucide-react';

const operators = [
  { symbol: '+', icon: Plus },
  { symbol: '-', icon: Minus },
  { symbol: '*', icon: Multiply },
  { symbol: '/', icon: Divide },
  { symbol: '%', icon: Percent },
  { symbol: '(', label: '(' },
  { symbol: ')', label: ')' }
];

export function OperatorsPalette() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Operators</h3>
      </div>

      <div className="p-4 grid grid-cols-3 gap-2">
        {operators.map((operator) => (
          <DraggableOperator key={operator.symbol} operator={operator} />
        ))}
      </div>
    </div>
  );
}

interface OperatorProps {
  operator: {
    symbol: string;
    // to resolve build issue please check this
    // icon?: React.ComponentType<{ size?: number }>;
    // label?: string;
    icon?: LucideIcon | null;
    label?: string | null;
  };
}

function DraggableOperator({ operator }: OperatorProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `operator-${operator.symbol}`,
    data: {
      type: 'operator',
      value: operator.symbol
    }
  });

  const Icon = operator.icon;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-lg border border-gray-200 flex items-center justify-center transition-colors ${
        isDragging
          ? 'bg-purple-100 border-purple-300'
          : 'hover:bg-purple-50 hover:border-purple-200'
      }`}
    >
      {Icon ? (
        // <Icon size={20} className="text-purple-600" />
        <Icon size={20} />
      ) : (
        <span className="text-lg font-medium text-purple-600">
          {operator.label || operator.symbol}
        </span>
      )}
    </button>
  );
}