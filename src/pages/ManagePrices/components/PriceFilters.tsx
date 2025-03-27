import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

export function PriceFilters() {
  return (
    <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Search products..."
            className="w-full pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
          />
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
          <Filter size={20} />
          Filters
        </button>

        <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
          <ArrowUpDown size={20} />
          Sort
        </button>
      </div>
    </div>
  );
}