import React, { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { useLanguageStore } from '../store/languageStore';
import { PricingComparisonTable } from '../components/PricingComparisonTable';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { PromoCodeInput } from '../components/PromoCodeInput';

interface GroupedFeatures {
  [key: string]: string[];
}

interface PromoCode {
  code: string;
  discount: number;
}

const VALID_PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', discount: 10 },
  { code: 'SAVE20', discount: 20 },
  { code: 'VIP30', discount: 30 }
];

const groupFeatures = (features: string[]): GroupedFeatures => {
  const groups: GroupedFeatures = {};
  let currentGroup = '';

  features.forEach(feature => {
    if (feature.startsWith('────')) {
      currentGroup = feature.replace(/────/g, '').trim();
      groups[currentGroup] = [];
    } else if (currentGroup) {
      groups[currentGroup].push(feature);
    }
  });

  return groups;
};

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const { language } = useLanguageStore();
  const { tiers } = useSubscriptionStore();

  const handlePromoCode = (code: string) => {
    const promo = VALID_PROMO_CODES.find(p => p.code === code);
    if (promo) {
      setActivePromo(promo);
    }
  };

  const clearPromoCode = () => {
    setActivePromo(null);
  };

  const getDiscountedPrice = (price: number) => {
    if (!activePromo) return price;
    return price * (1 - activePromo.discount / 100);
  };

  const startTrial = async () => {
    try {
      // Here you would integrate with your backend
      // For now, just show success message
      setShowTrialModal(true);
    } catch (error) {
      console.error('Failed to start trial:', error);
    }
  };

  const t = {
    startTrial: language === 'ar' ? 'ابدأ الإصدار التجريبي' : 'Start 7-Day Trial',
    getStarted: language === 'ar' ? 'ابدأ الآن' : 'Get Started',
    monthly: language === 'ar' ? 'شهري' : 'Monthly',
    yearly: language === 'ar' ? 'سنوي' : 'Yearly',
    yearlyDiscount: language === 'ar' ? 'وفر 20٪' : 'Save 20%',
    close: language === 'ar' ? 'إغلاق' : 'Close'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-24 px-4 sm:px-6 lg:px-8">
      {/* Close Button */}
      <button
        onClick={() => window.history.back()}
        className="fixed top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
      >
        <X size={24} />
      </button>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-center items-center gap-4 bg-white/5 backdrop-blur-sm p-2 rounded-xl inline-block mx-auto">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {t.monthly}
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              billingPeriod === 'yearly'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {t.yearly}
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
              {t.yearlyDiscount}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
        {tiers.map((tier, index) => {
          const groupedFeatures = groupFeatures(tier.features);
          
          return (
            <div
              key={tier.id}
              className={`relative bg-white/5 backdrop-blur-sm rounded-2xl border ${
                index === 1
                  ? 'border-purple-500 shadow-xl shadow-purple-500/20'
                  : 'border-white/10'
              } overflow-hidden transform hover:scale-105 transition-all duration-300`}
            >
              {index === 1 && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-b-lg">
                  Most Popular
                </div>
              )}

              <div className="p-8 h-full flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <h3 className="text-2xl font-bold text-white mb-4">{tier.name}</h3>

                {/* Price */}
                <p className="mt-8" dir="ltr">
                  <span className={`text-4xl font-extrabold text-white ${activePromo ? 'line-through text-gray-400' : ''}`}>
                    ${Math.floor(tier.price[billingPeriod])}
                  </span>
                  <span className="text-sm align-top text-gray-300">99</span>
                  <span className="text-base font-medium text-gray-300">
                    /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                  </span>
                  {activePromo && (
                    <span className="text-4xl font-extrabold text-green-600 ml-4">
                      ${Math.floor(getDiscountedPrice(tier.price[billingPeriod]))}
                      <span className="text-sm align-top text-gray-300">99</span>
                    </span>
                  )}
                  {billingPeriod === 'yearly' && (
                    <span className="block text-sm text-gray-300 mt-1">
                      {language === 'ar' 
                        ? `${Math.floor(tier.price.yearly)} درهم/شهر عند الدفع سنوياً`
                        : `$${Math.floor(tier.price.yearly)}/mo when paid annually`
                      }
                    </span>
                  )}
                </p>

                {/* Features */}
                <div className="mt-8 flex-grow space-y-8">
                  {Object.entries(groupedFeatures).map(([group, features]) => (
                    <div key={group}>
                      <h4 className="text-sm font-semibold text-purple-400 border-b border-purple-400/20 pb-2 mb-4">
                        {group}
                      </h4>
                      <ul className="space-y-3">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-300">
                            <Check size={18} className="text-purple-400 flex-shrink-0 mt-1" />
                            <span>{feature.replace('• ', '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  <button
                    onClick={() => tier.id === 'starter' ? startTrial() : null}
                    className={`w-full rounded-lg px-6 py-3 text-center text-sm font-semibold transition-all ${
                      language === 'ar' ? 'font-arabic' : ''
                    } ${
                      index === 1
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {index === 0 ? (
                      <div className="flex items-center justify-center gap-2">
                        {t.startTrial}
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {language === 'ar' ? '7 أيام مجاناً' : '7 Days Free'}
                        </span>
                      </div>
                    ) : t.getStarted}
                    <ArrowRight className="inline-block ml-2" size={16} />
                  </button>
                  
                  <PromoCodeInput
                    onApply={handlePromoCode}
                    onClear={clearPromoCode}
                    isValid={!!activePromo}
                    discount={activePromo?.discount}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Detailed Feature Comparison Table */}
      <PricingComparisonTable language={language} />

      {/* Trial Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Trial Started!</h3>
            <p className="text-gray-600">
              Your 7-day free trial of the Starter Plan has begun. Enjoy full access to all features!
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTrialModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}