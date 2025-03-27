import React from 'react';
import { TrendingUp, DollarSign, Percent } from 'lucide-react';

interface SavedPricesRoiProps {
  savedPrices: Array<{
    salePrice: number;
    purchasePrice: number;
    date: Date;
  }>;
}

export function SavedPricesRoi({ savedPrices }: SavedPricesRoiProps) {
  const calculateRoi = (salePrice: number, purchasePrice: number) => {
    if (!purchasePrice) return 0;
    return ((salePrice - purchasePrice) / purchasePrice) * 100;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-purple-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">Saved Prices ROI Analysis</h3>
      </div>

      <div className="space-y-4">
        {savedPrices.length > 0 ? (
          savedPrices.map((price, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg"
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Sale Price</div>
                  <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
                    <DollarSign size={16} className="text-purple-600" />
                    {price.salePrice.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Purchase Price</div>
                  <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
                    <DollarSign size={16} className="text-purple-600" />
                    {price.purchasePrice.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm text-gray-500">ROI</div>
                  <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
                    <Percent size={16} className="text-purple-600" />
                    {calculateRoi(price.salePrice, price.purchasePrice).toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Saved on: {price.date.toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No saved prices found
          </div>
        )}
      </div>
    </div>
  );
}