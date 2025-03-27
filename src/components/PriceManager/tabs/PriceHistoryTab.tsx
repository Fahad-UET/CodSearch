import React from 'react';
import { Product } from '../../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { DollarSign, TrendingUp, Clock } from 'lucide-react';

interface PriceHistoryTabProps {
  products: Product[];
}

export function PriceHistoryTab({ products }: PriceHistoryTabProps) {
  // Get products with saved price history
  const productsWithHistory = products.filter(p => p.savedPrices && p.savedPrices.length > 0);

  // Calculate price history metrics
  const metrics = productsWithHistory.reduce((acc, product) => {
    const history = product.savedPrices || [];
    if (history.length > 0) {
      const latestPrice = history[history.length - 1].salePrice;
      const oldestPrice = history[0].salePrice;
      const priceChange = ((latestPrice - oldestPrice) / oldestPrice) * 100;
      
      return {
        totalProducts: acc.totalProducts + 1,
        averagePriceChange: acc.averagePriceChange + priceChange,
        totalPriceChanges: acc.totalPriceChanges + history.length,
      };
    }
    return acc;
  }, {
    totalProducts: 0,
    averagePriceChange: 0,
    totalPriceChanges: 0,
  });

  // Prepare data for price history chart
  const historyData = productsWithHistory.flatMap(product => 
    (product.savedPrices || []).map(price => ({
      name: product.title,
      date: format(new Date(price.createdAt), 'MMM d, yyyy'),
      price: price.salePrice,
      profitMargin: price.metrics.profitMargin,
    }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-purple-200" />
            <h3 className="font-medium">Products with History</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-blue-200" />
            <h3 className="font-medium">Average Price Change</h3>
          </div>
          <p className="text-3xl font-bold">
            {(metrics.averagePriceChange / metrics.totalProducts || 0).toFixed(1)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-green-200" />
            <h3 className="font-medium">Total Price Changes</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.totalPriceChanges}</p>
        </div>
      </div>

      {/* Price History Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Price History</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis yAxisId="price" orientation="left" unit="$" />
              <YAxis yAxisId="margin" orientation="right" unit="%" />
              <Tooltip />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="#8b5cf6"
                name="Price"
              />
              <Line
                yAxisId="margin"
                type="monotone"
                dataKey="profitMargin"
                stroke="#10b981"
                name="Profit Margin"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}