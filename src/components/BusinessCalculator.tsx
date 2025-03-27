import React, { useState } from 'react';
import { X, DollarSign, Calculator, TrendingUp, BarChart2, PieChart } from 'lucide-react';
import { useCalculatorStore } from '../store/calculatorStore';

interface BusinessCalculatorProps {
  onClose: () => void;
}

export function BusinessCalculator({ onClose }: BusinessCalculatorProps) {
  const [activeTab, setActiveTab] = useState('revenue');
  
  const {
    purchasePrice,
    salePrice,
    setPurchasePrice,
    setSalePrice,
  } = useCalculatorStore();

  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: <TrendingUp size={20} /> },
    { id: 'costs', label: 'Costs', icon: <DollarSign size={20} /> },
    { id: 'metrics', label: 'Metrics', icon: <BarChart2 size={20} /> },
    { id: 'analysis', label: 'Analysis', icon: <PieChart size={20} /> },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full max-w-[95vw] h-[95vh] mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calculator size={24} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Business Calculator</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-3 gap-6 p-6 h-[calc(95vh-116px)] overflow-y-auto">
          {/* Input Section */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Inputs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={purchasePrice || ''}
                      onChange={(e) => setPurchasePrice(parseFloat(e.target.value))}
                      className="w-full pl-8 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder="0.00"
                    />
                    <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sale Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={salePrice || ''}
                      onChange={(e) => setSalePrice(parseFloat(e.target.value))}
                      className="w-full pl-8 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      placeholder="0.00"
                    />
                    <DollarSign size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Revenue Card */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={24} className="text-blue-100" />
                  <h3 className="text-lg font-semibold">Revenue</h3>
                </div>
                <p className="text-3xl font-bold">${(salePrice || 0).toFixed(2)}</p>
                <p className="text-sm text-blue-100 mt-2">Per unit sale</p>
              </div>

              {/* Profit Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign size={24} className="text-emerald-100" />
                  <h3 className="text-lg font-semibold">Profit</h3>
                </div>
                <p className="text-3xl font-bold">
                  ${((salePrice || 0) - (purchasePrice || 0)).toFixed(2)}
                </p>
                <p className="text-sm text-emerald-100 mt-2">Per unit profit</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis</h3>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Charts and detailed analysis will be displayed here
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}