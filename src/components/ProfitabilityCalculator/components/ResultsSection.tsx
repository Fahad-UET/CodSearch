import React from 'react';
import { Calculator, TrendingUp, BarChart3, DollarSign } from 'lucide-react';

interface ResultsSectionProps {
  results: {
    numberOfLeads: number;
    confirmedOrders: number;
    productsDelivered: number;
    productsReturned: number;
    confirmationRate: number;
    deliveryRate: number;
    salePrice: number;
    purchasePrice: number;
    totalSales: number;
    shippingCost: number;
    returnCost: number;
    totalShippingCost: number;
    leadFees: number;
    confirmationFees: number;
    deliveryFees: number;
    totalCallCenterFees: number;
    codFees: number;
    totalCosts: number;
    totalProfit: number;
    profitPerDelivered: number;
    profitMargin: number;
    monthlyCharges: number;
  };
}

export function ResultsSection({ results }: any) {
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
            <p className="text-3xl font-bold">{formatNumber(results.confirmedOrders)}</p>
            <p className="text-sm opacity-80">Confirmed Orders</p>
            <p className="text-xs opacity-60">{formatNumber(results.numberOfLeads)} leads</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-300">{formatNumber(results.productsDelivered)}</p>
            <p className="text-sm opacity-80">Delivered</p>
            <p className="text-xs opacity-60">{formatPercentage(results.deliveryRate)} success</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-300">{formatNumber(results.productsReturned)}</p>
            <p className="text-sm opacity-80">Returned</p>
            <p className="text-xs opacity-60">{formatPercentage(100 - results.deliveryRate)} returns</p>
          </div>
        </div>
      </div>

      {/* Call Center Costs */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Call Center Costs</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.leadFees)}</p>
            <p className="text-sm opacity-80">Lead Fees</p>
            <p className="text-xs opacity-60">{formatNumber(results.numberOfLeads)} leads</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.confirmationFees)}</p>
            <p className="text-sm opacity-80">Confirmation</p>
            <p className="text-xs opacity-60">{formatNumber(results.confirmedOrders)} confirmed</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.deliveryFees)}</p>
            <p className="text-sm opacity-80">Delivery</p>
            <p className="text-xs opacity-60">{formatNumber(results.productsDelivered)} delivered</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-80">Total Call Center Fees:</span>
            <span className="text-xl font-bold">{formatCurrency(results.totalCallCenterFees)}</span>
          </div>
        </div>
      </div>

      {/* Shipping & Returns */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Shipping & Returns</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.totalShippingCost)}</p>
            <p className="text-sm opacity-80">Total Cost</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{formatCurrency(results.shippingCost)}</p>
            <p className="text-sm opacity-80">Shipping</p>
            <p className="text-xs opacity-60">{formatNumber(results.confirmedOrders)} orders</p>
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
            <p className="text-3xl font-bold">{formatCurrency(results.profitPerDelivered)}</p>
            <p className="text-sm opacity-80">Profit/Order</p>
            <p className="text-xs opacity-60">Per delivered order</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-80">Monthly Charges:</span>
            <span className="text-xl font-bold">{formatCurrency(results.monthlyCharges)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm opacity-80">Profit Margin:</span>
            <span className="text-xl font-bold">{formatPercentage(results.profitMargin)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}