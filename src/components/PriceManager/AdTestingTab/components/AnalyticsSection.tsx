import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { NetworkData } from '../types';
import { NETWORK_COLORS } from '../constants';

interface AnalyticsSectionProps {
  networks: Record<string, NetworkData>;
  allDaysData?: {
    totalSpend: number;
    totalLeads: number;
    networkStats: Record<string, {
      spend: number;
      leads: number;
      clicks: number;
      impressions: number;
    }>;
  };
}

export function AnalyticsSection({ networks, allDaysData }: AnalyticsSectionProps) {
  // Calculate totals and metrics for each network
  const activeNetworks = Object.entries(networks)
    .filter(([_, data]) => data.isActive)
    .map(([network, data]) => {
      const budget = allDaysData?.networkStats[network]?.spend || data.metrics.budget || 0;
      const leads = allDaysData?.networkStats[network]?.leads || data.metrics.leads || 0;
      const clicks = allDaysData?.networkStats[network]?.clicks || data.metrics.clicks || 0;
      const impressions = allDaysData?.networkStats[network]?.impressions || data.metrics.impressions || 0;
      
      return {
        network,
        metrics: {
          budget,
          impressions,
          clicks,
          leads,
          ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
          cpl: leads > 0 ? budget / leads : 0
        },
        color: NETWORK_COLORS[network as keyof typeof NETWORK_COLORS].fill
      };
    });

  // Calculate absolute totals
  const totals = {
    budget: allDaysData?.totalSpend || 0,
    leads: allDaysData?.totalLeads || 0,
    clicks: activeNetworks.reduce((sum, n) => sum + n.metrics.clicks, 0),
    impressions: activeNetworks.reduce((sum, n) => sum + n.metrics.impressions, 0)
  };

  // Calculate overall averages
  const averages = {
    ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    cpl: totals.leads > 0 ? totals.budget / totals.leads : 0
  };

  // Prepare chart data
  const leadsData = activeNetworks
    .filter(n => n.metrics.leads > 0)
    .map(n => ({
      name: n.network,
      value: n.metrics.leads,
      percentage: (n.metrics.leads / totals.leads) * 100,
      color: n.color
    }));

  const budgetData = activeNetworks
    .filter(n => n.metrics.budget > 0)
    .map(n => ({
      name: n.network,
      value: n.metrics.budget,
      percentage: (n.metrics.budget / totals.budget) * 100,
      color: n.color
    }));

  // Prepare per $1 spent comparison data
  const perDollarData = activeNetworks
    .filter(n => n.metrics.budget > 0)
    .map(n => ({
      name: n.network,
      leads: n.metrics.budget > 0 ? n.metrics.leads / n.metrics.budget : 0,
      clicks: n.metrics.budget > 0 ? n.metrics.clicks / n.metrics.budget : 0,
      impressions: n.metrics.budget > 0 ? n.metrics.impressions / n.metrics.budget : 0,
      color: n.color
    }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const textColor = name === 'Snapchat' ? 'black' : 'white';

    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill={textColor}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="space-y-6">
      {/* Overall Results Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Results</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-600">Total Spend</div>
              <div className="text-2xl font-bold text-purple-700">${totals.budget.toFixed(2)}</div>
              <div className="mt-2 space-y-1">
                {activeNetworks.map(n => (
                  <div key={n.network} className="flex justify-between text-sm">
                    <span className="text-purple-500">{n.network}</span>
                    <span className="font-medium">${n.metrics.budget.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-600">Total Leads</div>
              <div className="text-2xl font-bold text-blue-700">{totals.leads}</div>
              <div className="mt-2 space-y-1">
                {activeNetworks.map(n => (
                  <div key={n.network} className="flex justify-between text-sm">
                    <span className="text-blue-500">{n.network}</span>
                    <span className="font-medium">{n.metrics.leads}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-600">Average CPL</div>
              <div className="text-2xl font-bold text-green-700">${averages.cpl.toFixed(2)}</div>
              <div className="mt-2 space-y-1">
                {activeNetworks.map(n => (
                  <div key={n.network} className="flex justify-between text-sm">
                    <span className="text-green-500">{n.network}</span>
                    <span className="font-medium">${n.metrics.cpl.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-sm font-medium text-yellow-600">Average CTR</div>
              <div className="text-2xl font-bold text-yellow-700">{averages.ctr.toFixed(2)}%</div>
              <div className="mt-2 space-y-1">
                {activeNetworks.map(n => (
                  <div key={n.network} className="flex justify-between text-sm">
                    <span className="text-yellow-600">{n.network}</span>
                    <span className="font-medium">{n.metrics.ctr.toFixed(2)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leads Distribution</h3>
            <div className="text-sm font-medium text-purple-600">
              Total: {totals.leads} leads
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {leadsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} leads`, 'Leads']}
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Budget Distribution</h3>
            <div className="text-sm font-medium text-purple-600">
              Total: ${totals.budget.toFixed(2)}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Budget']}
                  contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Per $1 Spent Comparisons */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance per $1 Spent</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={perDollarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="leads" 
                name="Leads/$1" 
                stroke="#8b5cf6" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                name="Clicks/$1" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="impressions" 
                name="Impressions/$1" 
                stroke="#10b981" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}