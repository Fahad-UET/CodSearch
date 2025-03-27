import React from 'react';
import { Crown, Package, Grid, List } from 'lucide-react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useProductStore } from '../../store';

export function SubscriptionInfo() {
  const { tiers, currentSubscription } = useSubscriptionStore();
  const products = useProductStore(state => state.getAllProducts());
  
  const currentTier = tiers.find(tier => tier.id === currentSubscription?.tierId);
  const productCount = products.length;
  const remainingProducts = currentTier ? currentTier.productLimit - productCount : 0;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
          </div>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            {currentTier?.name || 'Free'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Products */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-purple-600" />
              <h3 className="font-medium text-gray-900">Products</h3>
            </div>
            <p className="text-2xl font-bold text-purple-700">{productCount}</p>
            <p className="text-sm text-gray-500 mt-1">
              {remainingProducts} remaining
            </p>
          </div>

          {/* Boards */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Grid className="w-5 h-5 text-indigo-600" />
              <h3 className="font-medium text-gray-900">Boards</h3>
            </div>
            <p className="text-2xl font-bold text-indigo-700">
              {currentTier?.features.find(f => f.includes('Board'))?.split(' ')[0] || '1'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Maximum allowed
            </p>
          </div>

          {/* Lists */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <List className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-gray-900">Lists per Board</h3>
            </div>
            <p className="text-2xl font-bold text-blue-700">
              {currentTier?.features.find(f => f.includes('List'))?.split(' ')[0] || '5'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Maximum per board
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}