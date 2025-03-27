import React from 'react';
import { Crown } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';

export function SubscriptionBadge() {
  const { tiers, currentSubscription } = useSubscriptionStore();
  
  if (!currentSubscription) return null;
  
  const currentTier = tiers.find(tier => tier.id === currentSubscription.tierId);
  if (!currentTier) return null;

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      currentTier.id === 'unlimited'
        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
        : currentTier.id === 'pro'
        ? 'bg-purple-100 text-purple-700'
        : 'bg-gray-100 text-gray-700'
    }`}>
      <Crown size={12} className={currentTier.id === 'unlimited' ? 'text-yellow-300' : ''} />
      {currentTier.name}
    </div>
  );
}