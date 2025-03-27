import React from 'react';
import { format } from 'date-fns';
import { DollarSign, Calendar, Settings, TrendingUp } from 'lucide-react';

interface SimulationsTabProps {
  savedPrices: Array<{
    id: string;
    salePrice: number;
    settings: {
      confirmationRate: number;
      deliveryRate: number;
      cpl: number;
      stock: number;
      productType: string;
      serviceType: string;
    };
    metrics: {
      totalProfit: number;
      profitMargin: number;
      totalSales: number;
      totalCosts: number;
      profitPerUnit: number;
    };
    createdAt: Date;
  }>;
  onSelectPrice: (price: any) => void;
}

export function SimulationsTab({ savedPrices, onSelectPrice }: SimulationsTabProps) {
  const sortedPrices = [...savedPrices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (savedPrices.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-purple-100">
        <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">No price simulations saved yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Use the Price Calculator to create and save price simulations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {sortedPrices.map((price) => (
        <button
          key={price.id}
          onClick={() => onSelectPrice(price)}
          className="bg-white rounded-xl border border-purple-100 p-6 hover:border-purple-300 hover:shadow-lg transition-all text-left group"
        >
          {/* Price and Date */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-3xl font-bold text-purple-600">
                ${price.salePrice.toFixed(2)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Calendar size={14} />
                {format(new Date(price.createdAt), 'MMM d, yyyy HH:mm')}
              </div>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                Click to Load
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <Settings size={14} />
                Settings
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Stock:</span>
                  <span className="font-medium">{price.settings.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">CPL:</span>
                  <span className="font-medium">${price.settings.cpl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Confirmation:</span>
                  <span className="font-medium">{price.settings.confirmationRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery:</span>
                  <span className="font-medium">{price.settings.deliveryRate}%</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
                <TrendingUp size={14} />
                Results
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Profit/Unit:</span>
                  <span className="font-medium">${price.metrics.profitPerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Margin:</span>
                  <span className="font-medium">{price.metrics.profitMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Sales:</span>
                  <span className="font-medium">${price.metrics.totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Costs:</span>
                  <span className="font-medium">${price.metrics.totalCosts.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}