import React from 'react';
import { ChevronDown, ChevronUp, DollarSign, Percent, Calendar, Calculator, Trash2, AlertCircle } from 'lucide-react';
import {  CalculatedMetrics } from './types';
import { calculateDailyMetrics } from './utils';

interface DaySectionProps {
  day: any;
  // day: DailyMetrics;
  isExpanded: boolean;
  onToggle: () => void;
  onChange: (updates: any) => void;
  // onChange: (updates: Partial<DailyMetrics>) => void;
  onDelete?: () => void;
  isFirst?: boolean;
}

export function DaySection({ day, isExpanded, onToggle, onChange, onDelete, isFirst = false }: DaySectionProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const calculatedMetrics: CalculatedMetrics = calculateDailyMetrics(day);
  const date = new Date();
  date.setDate(date.getDate() - (day.day - 1));

  // Format date and time
  const formattedDate = date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl border border-purple-100 shadow-sm transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              {formattedDate} à {formattedTime}
            </h3>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
              CPL: ${calculatedMetrics.cpl.toFixed(2)}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
              Delivery: {calculatedMetrics.deliveryRate.toFixed(1)}%
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              Confirmation: {calculatedMetrics.confirmationRate.toFixed(1)}%
            </span>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} className="text-purple-500" /> : <ChevronDown size={20} className="text-purple-500" />}
      </button>

      {isExpanded && (
        <div className="p-6 border-t border-purple-100 bg-gradient-to-br from-white/80 to-purple-50/80">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            {/* Input Metrics */}
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                Input Metrics
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={day.sellingPrice}
                    onChange={(e) => onChange({ sellingPrice: parseFloat(e.target.value) })}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPC
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={day.cpc}
                      onChange={(e) => onChange({ cpc: parseFloat(e.target.value) })}
                      className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    />
                    <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPM
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={day.cpm}
                      onChange={(e) => onChange({ cpm: parseFloat(e.target.value) })}
                      className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                    />
                    <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CTR
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={day.ctr}
                    onChange={(e) => onChange({ ctr: parseFloat(e.target.value) })}
                    className="w-full pr-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <Percent size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Budget
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={day.adBudget}
                    onChange={(e) => onChange({ adBudget: parseFloat(e.target.value) })}
                    className="w-full pl-8 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                  />
                  <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Orders & Results */}
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                Orders & Results
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Leads
                </label>
                <input
                  type="number"
                  min="0"
                  value={day.leads}
                  onChange={(e) => onChange({ leads: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmed Orders
                </label>
                <input
                  type="number"
                  min="0"
                  value={day.confirmedOrders}
                  onChange={(e) => onChange({ confirmedOrders: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivered Orders
                </label>
                <input
                  type="number"
                  min="0"
                  value={day.deliveredOrders}
                  onChange={(e) => onChange({ deliveredOrders: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
                />
              </div>

              {/* Calculated Metrics */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Calculated Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm font-medium text-purple-700">CPL</div>
                    <div className="text-lg font-semibold text-purple-900">
                      ${calculatedMetrics.cpl.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-medium text-green-700">Delivery Rate</div>
                    <div className="text-lg font-semibold text-green-900">
                      {calculatedMetrics.deliveryRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-700">Confirmation Rate</div>
                    <div className="text-lg font-semibold text-blue-900">
                      {calculatedMetrics.confirmationRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[400]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Delete Day {day.day}?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete this day? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete Day
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}