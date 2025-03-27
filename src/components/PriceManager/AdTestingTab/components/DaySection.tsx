import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, StickyNote, BarChart2, Calendar, Clock } from 'lucide-react';
import { DayData, NetworkMetrics } from '../types';
import { NetworkTab } from './NetworkTab';
import { NetworkToggle } from './NetworkToggle';
import { DateTimePicker } from './DateTimePicker';
import { AnalyticsSection } from './AnalyticsSection';
import { NETWORKS, NETWORK_COLORS } from '../constants';
import { createOrUpdateDay } from '@/services/firebase';
import { useProductStore } from '@/store';

interface DaySectionProps {
  day: DayData;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  onNetworkToggle: (network: string) => void;
  onMetricsChange: (network: string, updates: Partial<NetworkMetrics>) => void;
  onNotesChange: (notes: string) => void;
  onNetworkNotesChange: (network: string, notes: string) => void;
  productId: string;
}

export function DaySection({
  day,
  onDateChange,
  onTimeChange,
  onNetworkToggle,
  onMetricsChange,
  onNotesChange,
  onNetworkNotesChange,
  productId,
}: DaySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  // Calculate active networks stats
  const activeNetworks = Object.entries(day.networks)
    .filter(([_, data]) => data.isActive)
    .map(([network, data]) => ({
      network,
      leads: data.metrics.leads || 0,
      budget: data.metrics.budget || 0,
    }));

  const totalBudget = activeNetworks.reduce((sum, n) => sum + n.budget, 0);
  const totalLeads = activeNetworks.reduce((sum, n) => sum + n.leads, 0);

  const handleSaveIndiudal = async () => {
    setLoading(prev => ({ ...prev, [day.id]: true }));
    const dayCreated = await createOrUpdateDay(productId, day);
    setLoading(prev => ({ ...prev, [day.id]: false }));
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 ${
        isExpanded ? 'border-purple-300 shadow-lg' : 'border-purple-100 hover:border-purple-200'
      }`}
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar size={18} />
            <span className="font-medium">{day.date.toLocaleDateString()}</span>
            <Clock size={18} />
            <span className="font-medium">{day.time}</span>
          </div>

          {/* Network Pills with Stats */}
          <div className="flex items-center gap-2">
            {activeNetworks.map(({ network, leads, budget }) => (
              <div
                key={network}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transform transition-all duration-200 hover:scale-105 ${
                  NETWORK_COLORS[network as keyof typeof NETWORK_COLORS].bg
                } ${NETWORK_COLORS[network as keyof typeof NETWORK_COLORS].text}`}
              >
                <div className="flex flex-col items-center">
                  <span>{network}</span>
                  <div className="flex gap-2 mt-1">
                    <span>L: {leads}</span>
                    <span>${budget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Summary Stats */}
          <div className="flex items-center gap-4 px-4 py-2 bg-purple-50 rounded-lg">
            <div className="text-right">
              <div className="text-xs text-purple-600 font-medium">Budget</div>
              <div className="font-semibold text-purple-700">${totalBudget.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-purple-600 font-medium">Leads</div>
              <div className="font-semibold text-purple-700">{totalLeads}</div>
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div
            className={`transform transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          >
            <ChevronDown size={20} className="text-purple-400" />
          </div>
        </div>
      </button>

      {/* Expanded Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-purple-100">
          {/* Date/Time and Network Selection */}
          <div className="p-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50">
            <div className="flex justify-between items-center">
              <DateTimePicker
                date={day.date}
                time={day.time}
                onDateChange={onDateChange}
                onTimeChange={onTimeChange}
              />
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    showAnalytics
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                >
                  <BarChart2 size={18} />
                  {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                </button>
                <button
                  disabled={loading[day?.id]}
                  onClick={() => handleSaveIndiudal()}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-[#121212] text-white font-semibold 
                  `}
                >
                  {loading[day?.id] ? <div>Loading...</div> : 'Save'}
                </button>
              </div>
            </div>

            {/* Network Toggles */}
            <div className="mt-4 flex flex-wrap gap-2">
              {NETWORKS.map(network => (
                <NetworkToggle
                  key={network}
                  network={network}
                  isActive={day.networks[network].isActive}
                  onToggle={() => onNetworkToggle(network)}
                  colors={NETWORK_COLORS[network as keyof typeof NETWORK_COLORS]}
                />
              ))}
            </div>
          </div>

          {/* Analytics Section */}
          {showAnalytics && (
            <div className="p-4 bg-gradient-to-r from-gray-50 to-purple-50 border-t border-purple-100">
              <AnalyticsSection networks={day.networks} />
            </div>
          )}

          {/* Main Content Grid */}
          <div className="p-6 grid grid-cols-3 gap-6">
            {/* Left Column - Network Metrics */}
            <div className="col-span-2 space-y-4 max-h-[800px] overflow-y-auto custom-scrollbar pr-4">
              {NETWORKS.map(
                network =>
                  day.networks[network].isActive && (
                    <div
                      key={network}
                      className={`rounded-xl p-6 transform transition-all duration-200 hover:scale-[1.01] ${
                        NETWORK_COLORS[network as keyof typeof NETWORK_COLORS].bg
                      } ${NETWORK_COLORS[network as keyof typeof NETWORK_COLORS].text}`}
                      style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
                    >
                      <h4 className="text-lg font-medium mb-4">{network} Metrics</h4>
                      <NetworkTab
                        network={network}
                        metrics={day.networks[network].metrics}
                        notes={day.networks[network].notes}
                        onMetricsChange={updates => onMetricsChange(network, updates)}
                        onNotesChange={notes => onNetworkNotesChange(network, notes)}
                        isActive={day.networks[network].isActive}
                        isDark={network === 'TikTok'}
                      />
                    </div>
                  )
              )}
            </div>

            {/* Right Column - Day Notes */}
            <div className="col-span-1">
              <div className="bg-white rounded-xl p-6 border-2 border-purple-200 h-full shadow-sm hover:shadow-md transition-shadow duration-200 sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <StickyNote size={20} className="text-purple-500" />
                  <h4 className="font-medium text-gray-900">Day Notes</h4>
                </div>
                <textarea
                  value={day.notes || ''}
                  onChange={e => onNotesChange(e.target.value)}
                  placeholder="Add your notes about this testing day..."
                  className="w-full h-[calc(100%-40px)] p-4 rounded-lg border-gray-200 focus:border-purple-500 focus:ring focus:ring-purple-200 resize-none bg-purple-50/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
