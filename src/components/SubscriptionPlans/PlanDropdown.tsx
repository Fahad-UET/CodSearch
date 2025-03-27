import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SubscriptionTier } from '../../types';

interface PlanDropdownProps {
  selectedTier: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
  tiers: SubscriptionTier[];
}

export function PlanDropdown({ selectedTier, onSelect, tiers }: PlanDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className="font-medium">{selectedTier.name}</span>
          <span className="text-sm text-gray-500">
            ${selectedTier.price.monthly}/mo
          </span>
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => {
                onSelect(tier);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                tier.id === selectedTier.id ? 'bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{tier.name}</p>
                  <p className="text-sm text-gray-500">
                    Up to {tier.productLimit} products
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-purple-600">
                    ${tier.price.monthly}
                    <span className="text-sm text-gray-500">/mo</span>
                  </p>
                  {tier.price.yearly < tier.price.monthly && (
                    <p className="text-xs text-green-600">
                      Save ${((tier.price.monthly - tier.price.yearly) * 12).toFixed(2)}/yr
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}