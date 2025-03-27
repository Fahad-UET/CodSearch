import React from 'react';
import { Package, Grid, List, Crown, ArrowRight } from 'lucide-react';
import { Product, SubscriptionTier } from '../../types';

interface SubscriptionUsageProps {
  products: Product[];
  currentTier?: SubscriptionTier;
}

export function SubscriptionUsage({ products, currentTier }: SubscriptionUsageProps) {
  const productCount = products.length;
  const productLimit = currentTier?.productLimit || 0;
  const remainingProducts = Math.max(0, productLimit - productCount);
  
  const boardLimit = parseInt(currentTier?.features.find(f => f.includes('Board'))?.split(' ')[0] || '1');
  const listLimit = parseInt(currentTier?.features.find(f => f.includes('List'))?.split(' ')[0] || '5');

  return (
    <>
      {/* Plan Overview */}
      <div className="col-span-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {currentTier?.name || 'Free'} Plan
              </span>
              <button className="flex items-center gap-1 px-3 py-1 text-sm text-purple-600 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors">
                Upgrade
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-purple-600" />
          <h3 className="font-medium text-gray-900">Products</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Used</span>
            <span className="font-medium text-gray-900">{productCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 rounded-full h-2 transition-all"
              style={{ width: `${(productCount / productLimit) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium text-gray-900">{remainingProducts}</span>
          </div>
        </div>
      </div>

      {/* Board Limits */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Grid className="w-5 h-5 text-indigo-600" />
          <h3 className="font-medium text-gray-900">Boards</h3>
        </div>
        <p className="text-3xl font-bold text-indigo-600">{boardLimit}</p>
        <p className="text-sm text-gray-500 mt-1">Maximum boards allowed</p>
      </div>

      {/* List Limits */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <List className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900">Lists per Board</h3>
        </div>
        <p className="text-3xl font-bold text-blue-600">{listLimit}</p>
        <p className="text-sm text-gray-500 mt-1">Maximum lists per board</p>
      </div>
    </>
  );
}