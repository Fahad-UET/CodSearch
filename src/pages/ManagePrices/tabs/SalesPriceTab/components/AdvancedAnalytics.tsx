import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CountrySettingsData } from '../../../../../services/serviceProviders/types';

interface AdvancedAnalyticsProps {
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

export function AdvancedAnalytics({
  salePrice,
  sourcingPrice,
  settings,
  countrySettings
}: AdvancedAnalyticsProps) {
  // Calculate net profits and ROI data
  const profitsData = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const sales = (i + 1) * 10 * salePrice;
      const costs = (i + 1) * 10 * sourcingPrice;
      const profit = sales - costs;
      const roi = (profit / costs) * 100;
      return {
        units: (i + 1) * 10,
        sales,
        profit,
        roi
      };
    });
  }, [salePrice, sourcingPrice]);

  // Calculate break-even point
  const breakEvenData = useMemo(() => {
    const fixedCosts = settings.stock * settings.cpl;
    const variableCost = sourcingPrice;
    const revenuePerUnit = salePrice;
    const contributionMargin = revenuePerUnit - variableCost;
    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);

    return Array.from({ length: 20 }, (_, i) => {
      const units = i * Math.ceil(breakEvenUnits / 10);
      return {
        units,
        revenue: units * revenuePerUnit,
        totalCost: fixedCosts + (units * variableCost),
        profit: (units * revenuePerUnit) - (fixedCosts + (units * variableCost))
      };
    });
  }, [salePrice, sourcingPrice, settings.stock, settings.cpl]);

  // Calculate profit by confirmation rate
  const confirmationRateData = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const rate = i * 10;
      const confirmedOrders = Math.round((settings.stock * rate) / 100);
      const deliveredOrders = Math.round((confirmedOrders * settings.deliveryRate) / 100);
      const profit = (salePrice - sourcingPrice) * deliveredOrders;
      return { rate, profit };
    });
  }, [salePrice, sourcingPrice, settings.stock, settings.deliveryRate]);

  // Calculate profit by delivery rate
  const deliveryRateData = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => {
      const rate = i * 10;
      const confirmedOrders = Math.round((settings.stock * settings.confirmationRate) / 100);
      const deliveredOrders = Math.round((confirmedOrders * rate) / 100);
      const profit = (salePrice - sourcingPrice) * deliveredOrders;
      return { rate, profit };
    });
  }, [salePrice, sourcingPrice, settings.stock, settings.confirmationRate]);

  // Combined rate analysis
  const combinedRateData = useMemo(() => {
    const data = [];
    for (let c = 0; c <= 100; c += 20) {
      for (let d = 0; d <= 100; d += 20) {
        const confirmedOrders = Math.round((settings.stock * c) / 100);
        const deliveredOrders = Math.round((confirmedOrders * d) / 100);
        const profit = (salePrice - sourcingPrice) * deliveredOrders;
        data.push({
          confirmationRate: c,
          deliveryRate: d,
          profit
        });
      }
    }
    return data;
  }, [salePrice, sourcingPrice, settings.stock]);

  return (
    <div className="space-y-8">
      {/* Net Profits & ROI */}
      <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Net Profits & ROI Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="units" label={{ value: 'Units Sold', position: 'bottom' }} />
              <YAxis yAxisId="left" label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'ROI (%)', angle: 90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="profit" name="Net Profit" stroke="#8b5cf6" />
              <Line yAxisId="right" type="monotone" dataKey="roi" name="ROI" stroke="#06b6d4" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Break-even Analysis */}
      <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Break-even Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={breakEvenData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="units" label={{ value: 'Units', position: 'bottom' }} />
              <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#10b981" />
              <Line type="monotone" dataKey="totalCost" name="Total Cost" stroke="#ef4444" />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confirmation & Delivery Rate Analysis */}
      <div className="grid grid-cols-2 gap-6">
        {/* Confirmation Rate Impact */}
        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Profit by Confirmation Rate</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confirmationRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rate" label={{ value: 'Confirmation Rate (%)', position: 'bottom' }} />
                <YAxis label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#8b5cf6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Rate Impact */}
        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Profit by Delivery Rate</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deliveryRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rate" label={{ value: 'Delivery Rate (%)', position: 'bottom' }} />
                <YAxis label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#06b6d4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Combined Rate Analysis */}
      <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Combined Rate Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={combinedRateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="confirmationRate" label={{ value: 'Confirmation Rate (%)', position: 'bottom' }} />
              <YAxis label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" name="Profit" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}