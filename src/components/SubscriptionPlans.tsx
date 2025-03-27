import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { PromoCodeInput } from './PromoCodeInput';
import { PlanDropdown } from './SubscriptionPlans/PlanDropdown';
import { useLanguageStore } from '../store/languageStore';
import { PricingComparisonTable } from './PricingComparisonTable';

export function SubscriptionPlans() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const { tiers } = useSubscriptionStore();
  const { language } = useLanguageStore();

  const handleApplyPromo = async (code: string) => {
    // Simulate promo code validation
    if (code === 'WELCOME20') {
      setPromoCode(code);
      setDiscount(20);
      return true;
    }
    return false;
  };

  const handleClearPromo = () => {
    setPromoCode('');
    setDiscount(0);
  };

  const getPrice = (tier: typeof tiers[0]) => {
    const basePrice = tier.price[billingPeriod];
    if (discount) {
      return basePrice * (1 - discount / 100);
    }
    return basePrice;
  };
// to resolve build issue please check this
  // const handleStartTrial = async () => {
  //   if (!user) return;
  //   try {
  //     const subscription = await startTrial(user.uid);
  //     setCurrentSubscription(subscription);
  //     // Redirect to app
  //     navigate('/');
  //   } catch (error) {
  //     // Handle error
  //   }
  // };

  // const handleUpgrade = async (tierId: string) => {
  //   if (!user) return;
  //   try {
  //     const subscription = await upgradeSubscription(user.uid, tierId);
  //     setCurrentSubscription(subscription);
  //     // Redirect to app
  //     navigate('/');
  //   } catch (error) {
  //     // Handle error
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Plan Selection Dropdown */}
        <div className="max-w-md mx-auto mb-8">
          <PlanDropdown
            selectedTier={tiers[1]} // Default to Pro plan
            onSelect={(tier) => console.log('Selected tier:', tier)}
            tiers={tiers}
          />
        </div>

        {/* Billing Toggle */}
        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 p-1 rounded-xl">
            <div className="flex">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-purple-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingPeriod === 'yearly'
                    ? 'bg-white text-purple-600'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 mt-16">
          {tiers.map((tier: any) => (
            <div
              key={tier.id}
              className={`relative bg-white rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105 ${
                tier.isPopular ? 'ring-4 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {tier?.isPopular && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Name */}
                <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ${getPrice(tier).toFixed(2)}
                  </span>
                  <span className="text-xl font-medium text-gray-500 ml-1">
                    /{billingPeriod === 'yearly' ? 'mo' : 'mo'}
                  </span>
                </div>

                {billingPeriod === 'yearly' && (
                  <p className="mt-2 text-sm text-green-600">
                    Save {((tier.price.monthly - tier.price.yearly) * 12).toFixed(2)}$ per year
                  </p>
                )}

                {/* Features */}
                <ul className="mt-8 space-y-4 text-sm text-gray-600">
                  {tier.features.map((feature, index) => (
                    <li key={index} className={feature.startsWith('────') ? 'font-semibold text-purple-700 mt-6' : 'flex items-start'}>
                      {!feature.startsWith('────') && (
                        <span className="text-purple-400 flex-shrink-0 mr-2">•</span>
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <div className="mt-8">
                  {tier.id === 'starter' ? (
                    <button className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-purple-700 transition-colors">
                      Start 7-Day Free Trial
                    </button>
                  ) : (
                    <button className="w-full bg-purple-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-purple-700 transition-colors">
                      Upgrade Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code */}
        {/* Promo Code */}
        <div className="max-w-md mx-auto mb-12">
          <PromoCodeInput
            onApply={handleApplyPromo}
            onClear={handleClearPromo}
            isValid={!!promoCode}
            discount={discount}
          />
        </div>

        {/* Detailed Feature Comparison */}
        <div className="mb-12"><PricingComparisonTable language={language} /></div>
      </div>
    </div>
  );
}