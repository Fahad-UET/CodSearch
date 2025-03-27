import React from 'react';
import { DollarSign, TrendingUp, Truck, RefreshCw, Phone } from 'lucide-react';

interface ExpenseBreakdownProps {
  expenses: {
    advertisingCosts: number;
    deliveryCosts: number;
    returnCosts: number;
    callCenterCosts: number;
    codFees: number;
  };
}

export function ExpenseBreakdown({ expenses }: ExpenseBreakdownProps) {
  const {
    advertisingCosts,
    deliveryCosts,
    returnCosts,
    callCenterCosts,
    codFees
  } = expenses;

  const totalExpenses = Object.values(expenses).reduce((sum, cost) => sum + cost, 0);

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const calculatePercentage = (amount: number) => ((amount / totalExpenses) * 100).toFixed(1);

  const expenseItems = [
    {
      label: 'Advertising Costs',
      value: advertisingCosts,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Delivery Costs',
      value: deliveryCosts,
      icon: Truck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Return Costs',
      value: returnCosts,
      icon: RefreshCw,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Call Center Costs',
      value: callCenterCosts,
      icon: Phone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'COD Fees',
      value: codFees,
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Total Expenses Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-xl">
        <h3 className="text-lg font-semibold mb-1">Total Expenses</h3>
        <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
      </div>

      {/* Expense Breakdown */}
      <div className="grid gap-3">
        {expenseItems.map(({ label, value, icon: Icon, color, bgColor }) => (
          <div key={label} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${bgColor} rounded-lg`}>
                <Icon size={20} className={color} />
              </div>
              <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{calculatePercentage(value)}% of total</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatCurrency(value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}