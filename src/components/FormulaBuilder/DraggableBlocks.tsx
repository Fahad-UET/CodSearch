import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Plus, Minus, X as Multiply, Divide, Percent, DollarSign, TrendingUp, BarChart2, Package, LucideIcon } from 'lucide-react';

interface DraggableBlocksProps {
  onAddElement?: (element: { type: string; value: string }) => void;
  variables: Record<string, number>;
}

const VARIABLE_CATEGORIES = [
  {
    name: 'Pricing',
    color: 'blue',
    variables: [
      { name: 'purchasePrice', label: 'Purchase Price', icon: DollarSign },
      { name: 'salePrice', label: 'Sale Price', icon: DollarSign },
      { name: 'aliexpressPrice', label: 'AliExpress Price', icon: DollarSign },
      { name: 'alibabaPrice', label: 'Alibaba Price', icon: DollarSign },
      { name: 'amazonPrice', label: 'Amazon Price', icon: DollarSign },
      { name: 'noonPrice', label: 'Noon Price', icon: DollarSign }
    ]
  },
  {
    name: 'Costs',
    color: 'red',
    variables: [
      { name: 'chargePerProduct', label: 'Charge Per Product', icon: DollarSign },
      { name: 'totalMonthlyExpenses', label: 'Monthly Expenses', icon: DollarSign }
    ]
  },
  {
    name: 'Metrics',
    color: 'green',
    variables: [
      { name: 'cpc', label: 'CPC', icon: BarChart2 },
      { name: 'cpl', label: 'CPL', icon: BarChart2 },
      { name: 'cpm', label: 'CPM', icon: BarChart2 },
      { name: 'roas', label: 'ROAS', icon: TrendingUp },
      { name: 'ctr', label: 'CTR', icon: TrendingUp }
    ]
  }
];

const OPERATORS = [
  { symbol: '+', icon: Plus },
  { symbol: '-', icon: Minus },
  { symbol: '*', icon: Multiply },
  { symbol: '/', icon: Divide },
  { symbol: '%', icon: Percent }
];

export function DraggableBlocks({ onAddElement, variables }: DraggableBlocksProps) {
  const handleClick = (type: string, value: string) => {
    if (onAddElement) {
      onAddElement({ type, value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Operators */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Operators</h3>
        <div className="flex flex-wrap gap-2">
          {OPERATORS.map((operator) => (
            <DraggableOperator 
              key={operator.symbol} 
              operator={operator}
              onClick={() => handleClick('operator', operator.symbol)}
            />
          ))}
        </div>
      </div>

      {/* Variables by Category */}
      {VARIABLE_CATEGORIES.map((category) => (
        <div key={category.name}>
          <h3 className="text-sm font-medium text-gray-700 mb-2">{category.name}</h3>
          <div className="grid grid-cols-3 gap-2">
            {category.variables.map((variable) => (
              <DraggableVariable
                key={variable.name}
                variable={variable}
                category={category}
                value={variables[variable.name]}
                onClick={() => handleClick('variable', variable.name)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface OperatorProps {
  operator: {
    symbol: string;
    // to resolve build issue please check this
    // icon: React.ComponentType<{ size?: number }>;
    icon: LucideIcon;
  };
  onClick: () => void;
}

function DraggableOperator({ operator, onClick }: OperatorProps) {
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
      onClick={onClick}
      className={`p-2 rounded-lg border ${
        isDragging
          ? 'bg-purple-100 border-purple-300'
          : 'bg-white border-gray-200 hover:bg-purple-50 hover:border-purple-200'
      } transition-colors`}
    >
      {/* // to resolve build issue please check this */}
      {/* <Icon size={16} className="text-purple-600" /> */}
      <Icon size={16} />
    </button>
  );
}

interface VariableProps {
  variable: {
    name: string;
    label: string;
    // to resolve build issue please check this
    // icon: React.ComponentType<{ size?: number }>;
    icon: LucideIcon;
  };
  category: {
    name: string;
    color: string;
  };
  value: number;
  onClick: () => void;
}

function DraggableVariable({ variable, category, value, onClick }: VariableProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `variable-${variable.name}`,
    data: {
      type: 'variable',
      value: variable.name
    }
  });

  const Icon = variable.icon;
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300',
    red: 'bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300',
    green: 'bg-green-50 border-green-200 hover:bg-green-100 hover:border-green-300'
  };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`p-3 rounded-lg border ${colorClasses[category.color as keyof typeof colorClasses]} transition-colors w-full`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
        {/* // to resolve build issue please check this */}
          {/* <Icon size={14} className="text-gray-600 flex-shrink-0" /> */}
          <Icon size={14} />
          <span className="text-sm font-medium text-gray-900 truncate">
            {variable.label}
          </span>
        </div>
        <span className="text-sm font-semibold text-gray-900">
          ${value?.toFixed(2) || '0.00'}
        </span>
      </div>
    </button>
  );
}