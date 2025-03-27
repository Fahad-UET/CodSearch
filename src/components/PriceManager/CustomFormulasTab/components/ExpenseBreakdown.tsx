import React from 'react';
import { DollarSign, TrendingDown, Package, Truck } from 'lucide-react';

interface ExpenseBreakdownProps {
  variables: Record<string, number>;
}

export function ExpenseBreakdown({ variables }: ExpenseBreakdownProps) {
  const expenses = [
    {
      label: 'Coûts Marketing',
      value: variables.marketingCosts || 0,
      icon: DollarSign,
      color: 'red'
    },
    {
      label: 'Coûts de Stock',
      value: variables.stockCosts || 0,
      icon: Package,
      color: 'blue'
    },
    {
      label: 'Coûts de Livraison',
      value: variables.shippingCosts || 0,
      icon: Truck,
      color: 'green'
    },
    {
      label: 'Autres Dépenses',
      value: variables.otherCosts || 0,
      icon: TrendingDown,
      color: 'purple'
    }
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.value, 0);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des Dépenses</h3>

      <div className="space-y-4">
        {expenses.map((expense, index) => {
          const Icon = expense.icon;
          const percentage = totalExpenses > 0 ? (expense.value / totalExpenses) * 100 : 0;
          
          const colors = {
            red: 'bg-red-50 text-red-600',
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600'
          };

          return (
            <div key={index} className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${colors[expense.color as keyof typeof colors]}`}>
                <Icon size={20} />
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{expense.label}</span>
                  <span className="text-sm text-gray-900">${expense.value.toFixed(2)}</span>
                </div>
                
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      expense.color === 'red' ? 'bg-red-500' :
                      expense.color === 'blue' ? 'bg-blue-500' :
                      expense.color === 'green' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              
              <span className="text-sm text-gray-500 w-16 text-right">
                {percentage.toFixed(1)}%
              </span>
            </div>
          );
        })}

        {/* Total */}
        <div className="pt-4 mt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Total des Dépenses</span>
            <span className="text-lg font-semibold text-gray-900">
              ${totalExpenses.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}