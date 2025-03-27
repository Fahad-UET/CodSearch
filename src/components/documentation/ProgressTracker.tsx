import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProgressTrackerProps {
  completed: number;
  total: number;
}

export default function ProgressTracker({ completed, total }: ProgressTrackerProps) {
  const percentage = (completed / total) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">Progression</h3>
        <span className="text-sm text-gray-600">{completed}/{total}</span>
      </div>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block text-primary-600">
              {Math.round(percentage)}% Complété
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-100">
          <div
            style={{ width: `${percentage}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"
          />
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <CheckCircle className="h-4 w-4 text-primary-500 mr-2" />
        <span>{total - completed} sections restantes</span>
      </div>
    </div>
  );
}