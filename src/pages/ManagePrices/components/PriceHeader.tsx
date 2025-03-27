import React from 'react';
import { DollarSign, Download, Upload } from 'lucide-react';

export function PriceHeader() {
  return (
    <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <DollarSign size={24} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Prices</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and update product prices across your catalog
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2">
            <Upload size={20} />
            Import
          </button>
          <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}