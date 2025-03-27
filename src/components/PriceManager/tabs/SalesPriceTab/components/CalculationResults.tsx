import React from 'react';
import { DollarSign, TrendingUp, Package, Truck } from 'lucide-react';
import { CalculationResult } from '../types';

interface CalculationResultsProps {
  results: CalculationResult;
  networks: string[];
}

export function CalculationResults({ results, networks }: CalculationResultsProps) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={20} className="text-purple-200" />
          <h3 className="font-semibold">Financial Overview</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-purple-200">Total Sales</div>
            <div className="text-3xl font-bold">${results.totalSales.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-purple-200">Total Costs</div>
            <div className="text-3xl font-bold">${results.totalCosts.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-purple-200">Profit Margin</div>
            <div className="text-3xl font-bold">{results.profitMargin.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Package size={20} className="text-blue-200" />
          <h3 className="font-semibold">Delivery Overview</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-blue-200">Expected Deliveries</div>
            <div className="text-3xl font-bold">{results.expectedDeliveries}</div>
          </div>
          <div>
            <div className="text-sm text-blue-200">Expected Returns</div>
            <div className="text-3xl font-bold">{results.expectedReturns}</div>
          </div>
        </div>
      </div>

      {/* Network Performance */}
      {networks.map(network => {
        const stats = results.networkStats[network];
        if (!stats) return null;

        return (
          <div 
            key={network}
            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={20} className="text-green-200" />
              <h3 className="font-semibold">{network} Performance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-green-200">Total Spend</div>
                <div className="text-3xl font-bold">${stats.spend.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-green-200">Total Leads</div>
                <div className="text-3xl font-bold">{stats.leads}</div>
              </div>
              <div>
                <div className="text-sm text-green-200">CPL</div>
                <div className="text-3xl font-bold">${stats.cpl.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-green-200">ROI</div>
                <div className="text-3xl font-bold">{stats.roi.toFixed(1)}x</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}