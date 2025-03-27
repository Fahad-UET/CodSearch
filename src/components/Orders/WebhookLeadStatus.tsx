import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useWebhookStatus } from '../../services/codNetwork/hooks';

export function WebhookLeadStatus() {
  const { status, isLoading, error } = useWebhookStatus();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 text-sm rounded-lg">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        Checking webhook status...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg">
        <AlertCircle size={16} />
        Failed to check webhook status
      </div>
    );
  }

  if (!status) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 text-sm rounded-lg">
        <AlertCircle size={16} />
        No webhook configured
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
      status.active
        ? 'bg-green-50 text-green-600'
        : 'bg-red-50 text-red-600'
    }`}>
      {status.active ? (
        <CheckCircle size={16} />
      ) : (
        <XCircle size={16} />
      )}
      {status.active ? 'Webhook active' : 'Webhook inactive'}
      <span className="ml-2 px-2 py-0.5 bg-white rounded-full text-xs">
        {status.totalLeads} leads
      </span>
      {status.lastSync && (
        <span className="text-xs opacity-75">
          Last sync: {new Date(status.lastSync).toLocaleString()}
        </span>
      )}
    </div>
  );
}