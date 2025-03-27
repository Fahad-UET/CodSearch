import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Calculator } from 'lucide-react';

interface SavedPrice {
  id: string;
  salePrice: number;
  purchasePrice: number;
  profit: number;
  profitMargin: number;
  createdAt: Date;
}

interface SavedPricesRoiProps {
  savedPrices: SavedPrice[];
}

export function SavedPricesRoi({ savedPrices }: SavedPricesRoiProps) {
  // Sort prices by date descending
  const sortedPrices = [...savedPrices].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Calculate averages
  const averages = sortedPrices.reduce((acc, price) => ({
    salePrice: acc.salePrice + price.salePrice,
    purchasePrice: acc.purchasePrice + price.purchasePrice,
    profit: acc.profit + price.profit,
    profitMargin: acc.profitMargin + price.profitMargin
  }), {
    salePrice: 0,
    purchasePrice: 0,
    profit: 0,
    profitMargin: 0
  });

  const count = sortedPrices.length;
  if (count > 0) {
    averages.salePrice /= count;
    averages.purchasePrice /= count;
    averages.profit /= count;
    averages.profitMargin /= count;
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Calculator size={24} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Saved Prices ROI Analysis</h3>
      </div>

      {/* Averages Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-purple-600" />
            <p className="text-sm text-purple-600">Avg. Sale Price</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">
            ${averages.salePrice.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-blue-600" />
            <p className="text-sm text-blue-600">Avg. Purchase Price</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">
            ${averages.purchasePrice.toFixed(2)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-600" />
            <p className="text-sm text-green-600">Avg. Profit</p>
          </div>
          <p className="text-2xl font-bold text-green-700">
            ${averages.profit.toFixed(2)}
          </p>
        </div>

        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={16} className="text-amber-600" />
            <p className="text-sm text-amber-600">Avg. Margin</p>
          </div>
          <p className="text-2xl font-bold text-amber-700">
            {averages.profitMargin.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Price History Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchase Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margin
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPrices.map((price) => (
              <tr key={price.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {price.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${price.salePrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${price.purchasePrice.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${price.profit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {price.profitMargin.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}