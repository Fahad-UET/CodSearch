import React from 'react';
import { Calculator, DollarSign, TrendingUp, BarChart2 } from 'lucide-react';
import { CountrySettingsData } from '../../../../../services/serviceProviders/types';

interface PriceAnalyticsProps {
  salePrice: number;
  sourcingPrice: number;
  settings: {
    confirmationRate: number;
    deliveryRate: number;
    cpl: number;
    stock: number;
  };
  countrySettings?: CountrySettingsData;
}

export function PriceAnalytics({
  salePrice,
  sourcingPrice,
  settings,
  countrySettings
}: PriceAnalyticsProps) {
  // Calculate metrics
  const confirmedOrders = Math.round((settings.stock * settings.confirmationRate) / 100);
  const deliveredOrders = Math.round((confirmedOrders * settings.deliveryRate) / 100);
  const returnedOrders = confirmedOrders - deliveredOrders;

  const totalSales = salePrice * deliveredOrders;
  const totalCosts = sourcingPrice * deliveredOrders;
  const profitMargin = totalSales > 0 ? ((totalSales - totalCosts) / totalSales) * 100 : 0;

  // Cost calculations
  const costs = {
    monthlyCharges: 2.50,
    adsPerDelivered: 5.00,
    codFees: 1.75,
    callCenter: 1.00,
    shipping: 3.75,
  };

  const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={20} className="text-green-200" />
            <h3 className="font-medium">Total Revenue</h3>
          </div>
          <p className="text-3xl font-bold">${totalSales.toFixed(2)}</p>
          <p className="text-sm text-green-200 mt-2">
            Based on {deliveredOrders} delivered orders
          </p>
        </div>

        {/* Profit Margin Card */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-blue-200" />
            <h3 className="font-medium">Profit Margin</h3>
          </div>
          <p className="text-3xl font-bold">{profitMargin.toFixed(1)}%</p>
          <p className="text-sm text-blue-200 mt-2">
            Net margin after all costs
          </p>
        </div>

        {/* Orders Card */}
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={20} className="text-purple-200" />
            <h3 className="font-medium">Order Metrics</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-purple-200">Confirmed:</span>
              <span className="font-bold">{confirmedOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Delivered:</span>
              <span className="font-bold">{deliveredOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-200">Returns:</span>
              <span className="font-bold">{returnedOrders}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Cost Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold">Total Cost per Delivered</h3>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Monthly Charges</p>
                <p className="text-lg font-semibold">${costs.monthlyCharges.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Ads Cost</p>
                <p className="text-lg font-semibold">${costs.adsPerDelivered.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">COD Fees</p>
                <p className="text-lg font-semibold">${costs.codFees.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Call Center</p>
                <p className="text-lg font-semibold">${costs.callCenter.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Shipping</p>
                <p className="text-lg font-semibold">${costs.shipping.toFixed(2)}</p>
              </div>
              <div className="bg-primary-50 p-4 rounded">
                <p className="text-sm text-primary-600 font-medium">Total Cost</p>
                <p className="text-lg font-semibold text-primary-700">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Analysis</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Cost Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Product Cost</span>
                  <span className="font-medium text-gray-900">
                    ${(sourcingPrice * deliveredOrders).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Shipping Cost</span>
                  <span className="font-medium text-gray-900">
                    ${(countrySettings?.shippingCosts.withCallCenter.shipping || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Return Cost</span>
                  <span className="font-medium text-gray-900">
                    ${(countrySettings?.shippingCosts.withCallCenter.return || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Performance Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Confirmation Rate</span>
                  <span className="font-medium text-gray-900">
                    {settings.confirmationRate}%
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Delivery Rate</span>
                  <span className="font-medium text-gray-900">
                    {settings.deliveryRate}%
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Cost Per Lead</span>
                  <span className="font-medium text-gray-900">
                    ${settings.cpl.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}