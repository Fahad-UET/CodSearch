import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Package, Users, Truck } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useKpiStore } from '../../../../store/kpiStore';

interface KpiAnalyticsProps {
  selectedCountry: string;
  metrics: {
    cpc: number;
    cpl: number;
    cpm: number;
    roas: number;
    ctr: number;
    confirmationRate: number;
    deliveryRate: number;
    profitMargin: number;
  };
}

export function KpiAnalytics({ selectedCountry, metrics }: KpiAnalyticsProps) {
  const { getCountrySettings } = useKpiStore();
  const settings = getCountrySettings(selectedCountry);

  // Prepare data for charts
  const performanceData = [
    { name: 'CPC', value: metrics.cpc, threshold: settings.cpc.high },
    { name: 'CPL', value: metrics.cpl, threshold: settings.cpl.high },
    { name: 'CPM', value: metrics.cpm, threshold: settings.cpm.high },
    { name: 'ROAS', value: metrics.roas, threshold: settings.roas.high },
  ];

  const conversionData = [
    { name: 'CTR', value: metrics.ctr, threshold: settings.ctr.high },
    { name: 'Confirmation', value: metrics.confirmationRate, threshold: settings.confirmationRate.high },
    { name: 'Delivery', value: metrics.deliveryRate, threshold: settings.deliveryRate.high },
  ];

  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-purple-200" />
            <h3 className="font-medium">Average CPL</h3>
          </div>
          <p className="text-3xl font-bold">${metrics.cpl.toFixed(2)}</p>
          <p className="text-sm text-purple-200 mt-1">Target: ${settings.cpl.high.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-blue-200" />
            <h3 className="font-medium">CTR</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.ctr.toFixed(1)}%</p>
          <p className="text-sm text-blue-200 mt-1">Target: {settings.ctr.high}%</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-200" />
            <h3 className="font-medium">ROAS</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.roas.toFixed(1)}x</p>
          <p className="text-sm text-green-200 mt-1">Target: {settings.roas.high}x</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={20} className="text-amber-200" />
            <h3 className="font-medium">Delivery Rate</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.deliveryRate.toFixed(1)}%</p>
          <p className="text-sm text-amber-200 mt-1">Target: {settings.deliveryRate.high}%</p>
        </div>
      </div>

      {/* Performance Metrics Chart */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Cost Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8b5cf6" name="Current" />
                <Bar dataKey="threshold" fill="#e5e7eb" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Conversion Metrics</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {conversionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Analysis */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[
              { name: 'Week 1', cpl: 3.2, ctr: 2.1, roas: 2.5 },
              { name: 'Week 2', cpl: 2.8, ctr: 2.3, roas: 2.7 },
              { name: 'Week 3', cpl: 2.5, ctr: 2.5, roas: 2.9 },
              { name: 'Week 4', cpl: 2.2, ctr: 2.8, roas: 3.2 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cpl" stroke="#8b5cf6" name="CPL" />
              <Line type="monotone" dataKey="ctr" stroke="#3b82f6" name="CTR" />
              <Line type="monotone" dataKey="roas" stroke="#10b981" name="ROAS" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}