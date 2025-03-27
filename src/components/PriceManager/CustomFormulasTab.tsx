import React, { useState } from 'react';
import {
  TrendingUp,
  LineChart,
  Package,
  DollarSign,
  Wallet,
  ShoppingBag,
  Calculator
} from 'lucide-react';
import { Formula } from '../../types/formula';
import { useProductStore } from '../../store';
import { calculateRevenueFromAds, calculatePersonalCapitalRoi, calculateTotalExpenses } from './utils/calculations';

interface CustomFormulasTabProps {
  variables: Record<string, number>;
  product: any;
}

export function CustomFormulasTab({ variables, product }: CustomFormulasTabProps) {
  // Calculate investment metrics
  const stockInvestment = variables.purchasePrice * variables.stock || 0;
  const serviceParticipation = 30; // Default 30% participation
  const personalInvestment = stockInvestment * (100 - serviceParticipation) / 100;
  const serviceInvestment = stockInvestment * serviceParticipation / 100;

  // Calculate revenue and expenses
  const totalRevenue = variables.salePrice * variables.stock || 0;
  const adSpend = variables.cpc * variables.leads || 0;
  const operatingCosts = variables.chargePerProduct * variables.stock || 0;
  const totalExpenses = calculateTotalExpenses(adSpend, operatingCosts);

  // Calculate ROAS and ROI
  const revenueFromAds = calculateRevenueFromAds(totalRevenue, adSpend);
  const personalCapitalRoi = calculatePersonalCapitalRoi(totalRevenue, personalInvestment, totalExpenses);

  return (
    <div className="space-y-6">
      {/* ROI Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Return on Investment (ROI)</h3>

        <div className="grid grid-cols-3 gap-4">
          {/* Service Company Share */}
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <LineChart size={20} className="text-green-600" />
              <h4 className="font-medium text-green-700">Service Company Share</h4>
            </div>
            <p className="text-sm text-green-600 mb-2">Participation of the service company in the purchase of stock</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-700">{serviceParticipation}%</span>
            </div>
          </div>

          {/* Stock Investment */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag size={20} className="text-blue-600" />
              <h4 className="font-medium text-blue-700">Stock Investment</h4>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              ${stockInvestment.toFixed(2)}
            </p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-purple-600">
                <span>Stock Investment:</span>
                <span>${stockInvestment.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Service Company Share:</span>
                <span>${serviceInvestment.toFixed(2)} ({serviceParticipation}%)</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>Personal Investment:</span>
                <span>${personalInvestment.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ROAS */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-emerald-600" />
              <h3 className="font-medium text-emerald-900">ROAS (Return on Ad Spend)</h3>
            </div>
            <p className="text-2xl font-bold text-emerald-700">
              ${revenueFromAds.toFixed(2)}
            </p>
            <p className="text-sm text-emerald-600 mt-1">
              Revenue Generated from Advertising
            </p>
          </div>

          {/* Personal Capital ROI */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} className="text-blue-600" />
              <h3 className="font-medium text-blue-900">Personal Capital ROI</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              ${personalCapitalRoi.toFixed(2)}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Return on Personal Investment
            </p>
          </div>

          {/* Total Expenses */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Calculator size={20} className="text-red-600" />
              <h3 className="font-medium text-red-900">Total Expenses</h3>
            </div>
            <p className="text-2xl font-bold text-red-700">
              ${totalExpenses.toFixed(2)}
            </p>
            <p className="text-sm text-red-600 mt-1">
              Ads + Operating Costs
            </p>
          </div>

          {/* Profit Margin */}
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-indigo-600" />
              <h4 className="font-medium text-indigo-700">Profit Margin</h4>
            </div>
            <p className="text-2xl font-bold text-indigo-700">
              {((variables.salePrice - variables.purchasePrice) / variables.salePrice * 100 || 0).toFixed(1)}%
            </p>
          </div>

          {/* Total Revenue */}
          <div className="p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={20} className="text-emerald-600" />
              <h4 className="font-medium text-emerald-700">Total Revenue</h4>
            </div>
            <p className="text-2xl font-bold text-emerald-700">
              ${(variables.salePrice * variables.stock || 0).toFixed(2)}
            </p>
          </div>

          {/* Total Profit */}
          <div className="p-4 bg-teal-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={20} className="text-teal-600" />
              <h4 className="font-medium text-teal-700">Total Profit</h4>
            </div>
            <p className="text-2xl font-bold text-teal-700">
              ${((variables.salePrice - variables.purchasePrice) * variables.stock || 0).toFixed(2)}
            </p>
          </div>

          {/* Profit per Delivered Unit */}
          <div className="p-4 bg-cyan-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package size={20} className="text-cyan-600" />
              <h4 className="font-medium text-cyan-700">Profit per Delivered Unit</h4>
            </div>
            <p className="text-2xl font-bold text-cyan-700">
              ${(variables.salePrice - variables.purchasePrice || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}