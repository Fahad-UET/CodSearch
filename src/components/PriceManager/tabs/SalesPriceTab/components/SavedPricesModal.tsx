import React from 'react';
import { X, DollarSign, Calendar, Settings, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface SavedPrice {
  id: string;
  salePrice: number;
  settings: {
    confirmationRate: number;
    deliveryRate: number;
    cpl: number;
    stock: number;
    productType: string;
    serviceType: string;
    country: string;
  };
  metrics: {
    totalSales: number;
    totalCosts: number;
    totalProfit: number;
    profitMargin: number;
    profitPerUnit: number;
  };
  createdAt: Date;
}

interface SavedPricesModalProps {
  savedPrices: SavedPrice[];
  onClose: () => void;
  onSelectPrice: (price: SavedPrice) => void;
}

export function SavedPricesModal({ savedPrices, onClose, onSelectPrice }: SavedPricesModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[400]">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Saved Price Simulations</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-129px)]">
          <div className="grid grid-cols-2 gap-6">
            {savedPrices.map(price => (
              <button
                key={price.id}
                onClick={() => onSelectPrice(price)}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100 hover:border-purple-300 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign size={20} className="text-purple-600" />
                    <span className="text-2xl font-bold text-purple-900">
                      ${price.salePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={16} />
                    {format(new Date(price.createdAt), 'MMM d, yyyy HH:mm')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Settings size={14} />
                      <span>Settings</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>Stock: {price.settings.stock}</p>
                      <p>Confirmation: {price.settings.confirmationRate}%</p>
                      <p>Delivery: {price.settings.deliveryRate}%</p>
                      <p>CPL: ${price.settings.cpl}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp size={14} />
                      <span>Results</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>Profit/Unit: ${price.metrics.profitPerUnit.toFixed(2)}</p>
                      <p>Margin: {price.metrics.profitMargin.toFixed(1)}%</p>
                      <p>Total Sales: ${price.metrics.totalSales.toFixed(2)}</p>
                      <p>Total Costs: ${price.metrics.totalCosts.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <span className="text-sm text-purple-600 hover:text-purple-700">
                    Click to load this simulation
                  </span>
                </div>
              </button>
            ))}

            {savedPrices.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-500">
                No saved price simulations yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}