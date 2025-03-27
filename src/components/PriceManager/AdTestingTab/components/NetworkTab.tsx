import React, { useEffect } from 'react';
import { DollarSign, Percent, StickyNote } from 'lucide-react';
import { NetworkMetrics } from '../types';

interface NetworkTabProps {
  network: string;
  metrics: NetworkMetrics;
  notes: string;
  onMetricsChange: (updates: Partial<NetworkMetrics>) => void;
  onNotesChange: (notes: string) => void;
  isActive: boolean;
  isDark?: boolean;
}

export function NetworkTab({
  network,
  metrics,
  notes,
  onMetricsChange,
  onNotesChange,
  isActive,
  isDark = false
}: NetworkTabProps) {
  if (!isActive) return null;

  const handleValueChange = (value: string, field: keyof NetworkMetrics) => {
    const numValue = value === '' ? '' : parseFloat(value);
    if (numValue === '' || (!isNaN(numValue) && numValue >= 0)) {
      const updates: Partial<NetworkMetrics> = { [field]: numValue === '' ? 0 : numValue };
      
      // Calculate dependent metrics
      if (field === 'budget' || field === 'cpm' || field === 'ctr') {
        if (field === 'budget' || field === 'cpm') {
          // Calculate impressions from budget and CPM
          if (metrics.cpm > 0) {
            updates.impressions = Math.round((metrics.budget * 1000) / metrics.cpm);
          }
        }
        
        // Calculate clicks from impressions and CTR
        if (updates.impressions !== undefined && metrics.ctr > 0) {
          updates.clicks = Math.round(updates.impressions * (metrics.ctr / 100));
        }
      }
      
      // Calculate CPC from budget and clicks
      if (updates.clicks !== undefined && metrics.budget > 0) {
        updates.cpc = metrics.budget / updates.clicks;
      }
      
      onMetricsChange(updates);
    }
  };

  // Auto-calculate metrics when component mounts or when relevant values change
  useEffect(() => {
    const updates: Partial<NetworkMetrics> = {};
    
    // Calculate impressions
    if (metrics.budget > 0 && metrics.cpm > 0) {
      updates.impressions = Math.round((metrics.budget * 1000) / metrics.cpm);
    }
    
    // Calculate clicks
    if (metrics.impressions > 0 && metrics.ctr > 0) {
      updates.clicks = Math.round(metrics.impressions * (metrics.ctr / 100));
    } else if (metrics.budget > 0 && metrics.cpc > 0) {
      updates.clicks = Math.round(metrics.budget / metrics.cpc);
    }
    
    // Calculate derived metrics
    if (Object.keys(updates).length > 0) {
      onMetricsChange(updates);
    }
  }, [metrics.budget, metrics.cpm, metrics.ctr, metrics.cpc]);

  const inputClasses = `w-full rounded-lg transition-colors ${
    isDark
      ? 'bg-gray-800 border-gray-700 focus:border-gray-500 focus:ring-gray-500 text-white placeholder-gray-400'
      : 'bg-white/10 border-white/20 focus:border-white/40 focus:ring-white/20 placeholder-white/60'
  }`;

  // Calculate per $1 spent metrics
  const metricsPerDollar = {
    impressions: metrics.budget > 0 ? metrics.impressions / metrics.budget : 0,
    clicks: metrics.budget > 0 ? metrics.clicks / metrics.budget : 0,
    leads: metrics.budget > 0 ? metrics.leads / metrics.budget : 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* CPM */}
        <div>
          <label className="block text-sm font-medium mb-1">CPM</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={metrics.cpm || ''}
              onChange={(e) => handleValueChange(e.target.value, 'cpm')}
              className={`${inputClasses} pr-8`}
              placeholder="Enter CPM"
            />
            <DollarSign size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
        </div>

        {/* CPC */}
        <div>
          <label className="block text-sm font-medium mb-1">CPC</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={metrics.cpc || ''}
              onChange={(e) => handleValueChange(e.target.value, 'cpc')}
              className={`${inputClasses} pr-8`}
              placeholder="Enter CPC"
            />
            <DollarSign size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
        </div>

        {/* CTR */}
        <div>
          <label className="block text-sm font-medium mb-1">CTR</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={metrics.ctr || ''}
              onChange={(e) => handleValueChange(e.target.value, 'ctr')}
              className={`${inputClasses} pr-8`}
              placeholder="Enter CTR"
            />
            <Percent size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-1">Daily Budget</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={metrics.budget || ''}
              onChange={(e) => handleValueChange(e.target.value, 'budget')}
              className={`${inputClasses} pr-8`}
              placeholder="Enter budget"
            />
            <DollarSign size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Impressions */}
        <div>
          <label className="block text-sm font-medium mb-1">Impressions</label>
          <input
            type="number"
            min="0"
            value={metrics.impressions || ''}
            onChange={(e) => handleValueChange(e.target.value, 'impressions')}
            className={inputClasses}
            placeholder="Auto-calculated"
          />
          <div className="mt-1 text-xs opacity-60">
            Per $1: {metricsPerDollar.impressions.toFixed(0)}
          </div>
        </div>

        {/* Clicks */}
        <div>
          <label className="block text-sm font-medium mb-1">Clicks</label>
          <input
            type="number"
            min="0"
            value={metrics.clicks || ''}
            onChange={(e) => handleValueChange(e.target.value, 'clicks')}
            className={inputClasses}
            placeholder="Auto-calculated"
          />
          <div className="mt-1 text-xs opacity-60">
            Per $1: {metricsPerDollar.clicks.toFixed(2)}
          </div>
        </div>

        {/* Leads */}
        <div>
          <label className="block text-sm font-medium mb-1">Leads</label>
          <input
            type="number"
            min="0"
            value={metrics.leads || ''}
            onChange={(e) => handleValueChange(e.target.value, 'leads')}
            className={inputClasses}
            placeholder="Enter leads"
          />
          <div className="mt-1 text-xs opacity-60">
            Per $1: {metricsPerDollar.leads.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Network Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">
          <div className="flex items-center gap-2">
            <StickyNote size={16} className="opacity-60" />
            <span>{network} Notes</span>
          </div>
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={`Add notes specific to ${network} performance...`}
          className={`${inputClasses} h-24 resize-none`}
        />
      </div>
    </div>
  );
}