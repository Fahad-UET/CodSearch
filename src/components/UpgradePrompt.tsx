import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useProductStore } from '../store/productStore';

export function UpgradePrompt() {
  const { tiers, currentSubscription } = useSubscriptionStore();
  const { products } = useProductStore();
  
  if (!currentSubscription) return null;
  
  const currentTier = tiers.find(tier => tier.id === currentSubscription.tierId);
  if (!currentTier) return null;

  const productCount = products.length;
  const remainingProducts = currentTier.productLimit - productCount;

  if (remainingProducts > 5) return null;

  if (remainingProducts <= 0) {
    return (
      <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
        <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-800">Product limit reached</h3>
          <p className="mt-1 text-sm text-red-700">
            You've reached your plan's limit of {currentTier.productLimit} products.
            Upgrade your plan to add more products.
          </p>
          <button
            onClick={() => {}} // Open subscription modal
            className="mt-3 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
      <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="font-medium text-yellow-800">Running low on product slots</h3>
        <p className="mt-1 text-sm text-yellow-700">
          You have {remainingProducts} product {remainingProducts === 1 ? 'slot' : 'slots'} remaining.
          Consider upgrading your plan to avoid running out.
        </p>
        <button
          onClick={() => {}} // Open subscription modal
          className="mt-3 px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
        >
          View Plans
        </button>
      </div>
    </div>
  );
}