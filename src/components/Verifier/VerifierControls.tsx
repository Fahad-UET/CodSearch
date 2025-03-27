import React from 'react';
import { X, RefreshCw, Clock } from 'lucide-react';

interface VerifierControlsProps {
  isVerifying: boolean;
  isAutoRefresh: boolean;
  interval: number;
  onRefresh: () => void;
  onToggleAutoRefresh: () => void;
  onIntervalChange: (interval: number) => void;
  onClose: () => void;
}

export function VerifierControls({
  isVerifying,
  isAutoRefresh,
  interval,
  onRefresh,
  onToggleAutoRefresh,
  onIntervalChange,
  onClose
}: VerifierControlsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Auto-refresh Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleAutoRefresh}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isAutoRefresh ? 'bg-purple-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isAutoRefresh ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-sm text-gray-600">Auto-refresh</span>
      </div>

      {/* Interval Selector */}
      {isAutoRefresh && (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <select
            value={interval}
            onChange={(e) => onIntervalChange(parseInt(e.target.value))}
            className="text-sm rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          >
            <option value="5">5s</option>
            <option value="10">10s</option>
            <option value="30">30s</option>
            <option value="60">1m</option>
          </select>
        </div>
      )}

      {/* Manual Refresh */}
      <button
        onClick={onRefresh}
        disabled={isVerifying}
        className={`p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors ${
          isVerifying ? 'animate-spin' : ''
        }`}
        title="Refresh"
      >
        <RefreshCw size={20} />
      </button>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X size={20} />
      </button>
    </div>
  );
}