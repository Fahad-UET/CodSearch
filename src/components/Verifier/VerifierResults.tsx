import React from 'react';
import { Loader2, CheckCircle, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { VerificationResult } from './utils/verification';
import { useState } from 'react';

interface VerifierResultsProps {
  results: VerificationResult | null;
  isLoading: boolean;
}

const STATUS_STYLES = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    text: 'text-green-700',
    iconColor: 'text-green-500'
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    iconColor: 'text-yellow-500'
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-700',
    iconColor: 'text-red-500'
  }
} as const;

export function VerifierResults({ results, isLoading }: VerifierResultsProps) {
  const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set());
  
  const toggleCheck = (checkId: string) => {
    setExpandedChecks(prev => {
      const next = new Set(prev);
      if (next.has(checkId)) {
        next.delete(checkId);
      } else {
        next.add(checkId);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 size={32} className="text-purple-600 animate-spin mb-4" />
        <p className="text-gray-500">Running verification checks...</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12 text-gray-500">
        No verification results yet
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12 text-gray-500">
        No verification results yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm font-medium text-purple-600">Total Checks</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {results.summary.total}
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm font-medium text-green-600">Passed</div>
          <div className="text-2xl font-bold text-green-700 mt-1">
            {results.summary.passed}
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-sm font-medium text-yellow-600">Warnings</div>
          <div className="text-2xl font-bold text-yellow-700 mt-1">
            {results.summary.warnings}
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="text-sm font-medium text-red-600">Errors</div>
          <div className="text-2xl font-bold text-red-700 mt-1">
            {results.summary.errors}
          </div>
        </div>
      </div>

      {/* Check Results */}
      <div className="space-y-3">
        {results.checks.map(check => {
          const style = STATUS_STYLES[check.status];
          const Icon = style.icon;
          const isExpanded = expandedChecks.has(check.id);
          
          return (
            <div 
              key={check.id}
              className={`${style.bg} rounded-lg overflow-hidden transition-all`}
            >
              <button
                onClick={() => toggleCheck(check.id)}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Icon className={style.iconColor} size={20} />
                  <div className="text-left">
                    <h3 className={`font-medium ${style.text}`}>{check.name}</h3>
                    <p className={`text-sm mt-0.5 ${style.text} opacity-90`}>
                      {check.message}
                    </p>
                  </div>
                </div>
                {check.details && (
                  <div className={`${style.text} opacity-75`}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                )}
              </button>
              
              {isExpanded && check.details && (
                <div className="px-4 pb-4 pt-1">
                  <p className={`text-sm ${style.text} opacity-75`}>
                    {check.details}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-500">
        Last updated: {results.timestamp.toLocaleString()}
      </div>
    </div>
  );
}