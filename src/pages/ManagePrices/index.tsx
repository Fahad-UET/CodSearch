import React, { useState, useEffect } from 'react';
import { useProductStore } from '../../store';
import { PriceList } from './components/PriceList';
import { PriceAnalytics } from './components/PriceAnalytics';
import { PriceFilters } from './components/PriceFilters';
import { PriceHeader } from './components/PriceHeader';
import { AnalyticsTab } from './components/AnalyticsTab';
import { SalesPriceTab } from './tabs/SalesPriceTab';
import { ProfitEvolutionTab } from './tabs/ProfitEvolutionTab';

export function ManagePrices() {
  const { products } = useProductStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');

  // useEffect(() => {
  //   const loadData = async () => {
  //     try {
  //       await loadAllProducts();
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : 'Failed to load products');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [loadAllProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PriceHeader />
        
        {/* Tabs */}
        <div className="mt-8 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'list'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Price List
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'list' ? (
            <div className="grid grid-cols-12 gap-6">
              {/* Main Content */}
              <div className="col-span-8 space-y-6">
                <PriceFilters />
                <PriceList 
                  products={products}
                  isLoading={isLoading}
                  error={error}
                />
              </div>

              {/* Analytics Sidebar */}
              <div className="col-span-4">
                <PriceAnalytics products={products} />
              </div>
            </div>
          ) : (
            <AnalyticsTab products={products} />
          )}
        </div>
      </div>
    </div>
  );
}