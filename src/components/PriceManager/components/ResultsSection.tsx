import React from 'react';
import { Calculator, TrendingUp, BarChart2, DollarSign, Package2 } from 'lucide-react';
import { ExpenseBreakdown } from './ExpenseBreakdown';
import { ServiceParticipation } from './ServiceParticipation';

interface ResultsSectionProps {
  results: {
    totalSales: number;
    totalCosts: number;
    totalProfit: number;
    shippingCost: number;
    returnCost: number;
    totalCallCenterFees?: number;
    codFees: number;
    productsDelivered?: number;
    productsReturned?: number;
    profitMargin: number;
    totalShipping?: any;
    totalCallCenter?: any;
    leadFees?: any;
    confirmationFees?: any;
    deliveryFees?: any;
    confirmedOrders?: any;
    deliveredOrders?: any;
    returnedOrders?: any;
    monthlyCharges?: any;
    expenses?: any;
  };
}

export function ResultsSection({ results }: ResultsSectionProps) {
  const formatNumber = (value: number) => {
    return isNaN(value) ? 0 : Math.round(value);
  };

  const formatCurrency = (value: number) => {
    return isNaN(value) ? '$0' : `$${value.toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return isNaN(value) ? '0%' : `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Orders Summary */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Orders Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold">{formatNumber(results.productsDelivered)}</p>
            <p className="text-sm opacity-80">Delivered Orders</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-300">{formatNumber(results.productsDelivered)}</p>
            <p className="text-sm opacity-80">Delivered</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-300">{formatNumber(results.productsReturned)}</p>
            <p className="text-sm opacity-80">Returned</p>
          </div>
        </div>
      </div>

      {/* Call Center Costs */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Call Center Costs</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.totalCallCenterFees)}</p>
            <p className="text-sm opacity-80">Total Fees</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.shippingCost)}</p>
            <p className="text-sm opacity-80">Shipping</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.returnCost)}</p>
            <p className="text-sm opacity-80">Returns</p>
          </div>
        </div>
      </div>

      {/* Shipping & Returns */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Shipping & Returns</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.shippingCost + results.returnCost)}</p>
            <p className="text-sm opacity-80">Total Cost</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.shippingCost)}</p>
            <p className="text-sm opacity-80">Shipping</p>
            <p className="text-xs opacity-60">{formatNumber(results.productsDelivered)} orders</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.returnCost)}</p>
            <p className="text-sm opacity-80">Returns</p>
            <p className="text-xs opacity-60">{formatNumber(results.productsReturned)} returns</p>
          </div>
        </div>
      </div>

      {/* Final Results */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Financial Results</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.totalSales)}</p>
            <p className="text-sm opacity-80">Total Sales</p>
            <p className="text-xs opacity-60">{formatNumber(results.productsDelivered)} orders</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.totalProfit)}</p>
            <p className="text-sm opacity-80">Total Profit</p>
            <p className="text-xs opacity-60">After all costs</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatPercentage(results.profitMargin)}</p>
            <p className="text-sm opacity-80">Profit Margin</p>
            <p className="text-xs opacity-60">Net margin</p>
          </div>
        </div>
      </div>
      {/* Expense Breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <ExpenseBreakdown expenses={results.expenses} />
        <ServiceParticipation expenses={results.expenses} />
      </div>
    </div>
  );
}