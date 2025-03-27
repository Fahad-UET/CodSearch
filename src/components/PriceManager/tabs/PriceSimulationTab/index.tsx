import React, { useState } from 'react';
import { useServiceProviderStore } from '../../../../store/serviceProviderStore';
import { useKpiStore } from '../../../../store/kpiStore';
import { useProductStore } from '../../../../store';
import { updateProduct } from '../../../../services/firebase';
import { Calculator, History, Settings, TrendingUp, Eye } from 'lucide-react';
import { SourcingCalculator, PriceDisplaySection, ServiceSettings, AnalyticsDiagrams, SimulationsTab } from '../SalesPriceTab/components';
import { SavedPricesModal } from '../SalesPriceTab/components/SavedPricesModal';

interface PriceSimulationTabProps {
  selectedCountry: string;
  onPriceCalculated: (price: number) => void;
  productId?: string;
}

type TabType = 'calculator' | 'simulations' | 'settings' | 'analytics';

export function PriceSimulationTab({
  selectedCountry: initialCountry,
  onPriceCalculated,
  productId,
}: PriceSimulationTabProps) {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSavedPrices, setShowSavedPrices] = useState(false);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [sourcingPrice, setSourcingPrice] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('calculator');

  const { providers, selectedProviderId } = useServiceProviderStore();
  const { getCountrySettings } = useKpiStore();
  const { user, products } = useProductStore();
  const product = products.find(p => p.id === productId);

  const [settings, setSettings] = useState({
    confirmationRate: 60,
    deliveryRate: 45,
    cpl: 2.5,
    chargePerProduct: 2.45,
    stock: 100,
    productType: 'cosmetic' as 'cosmetic' | 'gadget',
    serviceType: 'with' as 'with' | 'without',
    shippingCost: 0,
    codFee: 0,
    callCenterFee: 0,
  });

  const selectedProvider = providers.find(p => p.id === selectedProviderId);
  const countrySettings = selectedProvider?.countries[selectedCountry];
  const kpiSettings = getCountrySettings(selectedCountry);

  const handleSavePrice = async () => {
    if (!productId) return;

    setIsSaving(true);
    try {
      const results = calculateResults();
      const savedPrice = {
        id: `price-${Date.now()}`,
        salePrice,
        settings: {
          ...settings,
          country: selectedCountry
        },
        metrics: {
          totalSales: results.totalSales,
          totalCosts: results.totalCosts,
          totalProfit: results.totalSales - results.totalCosts,
          profitMargin: ((results.totalSales - results.totalCosts) / results.totalSales) * 100,
          profitPerUnit: (results.totalSales - results.totalCosts) / settings.stock
        },
        createdAt: new Date()
      };

      const updatedProduct = await updateProduct(productId, {
        salePrice,
        purchasePrice: sourcingPrice,
        savedPrices: [...(product?.savedPrices || []), savedPrice]
      });

      setIsSaving(false);
      setTimeout(() => {
        onPriceCalculated(salePrice);
      }, 1500);
    } catch (error) {
      console.error('Failed to save price:', error);
      setIsSaving(false);
    }
  };

  const calculateResults = () => {
    const confirmedOrders = Math.round((settings.stock * settings.confirmationRate) / 100);
    const deliveredOrders = Math.round((confirmedOrders * settings.deliveryRate) / 100);
    const returnedOrders = confirmedOrders - deliveredOrders;

    const shippingCosts = countrySettings?.shippingCosts[settings.serviceType];
    const callCenterFees = countrySettings?.callCenterFees[settings.productType];

    const totalSales = deliveredOrders * salePrice;
    const totalCosts = deliveredOrders * sourcingPrice;

    const shippingCost = confirmedOrders * (shippingCosts?.shipping || 0);
    const returnCost = returnedOrders * (shippingCosts?.return || 0);
    const totalShipping = shippingCost + returnCost;

    const leadFees = settings.stock * (callCenterFees?.lead || 0);
    const confirmationFees = confirmedOrders * (callCenterFees?.confirmation || 0);
    const deliveryFees = deliveredOrders * (callCenterFees?.delivered || 0);
    const totalCallCenter =
      settings.serviceType === 'with' ? leadFees + confirmationFees + deliveryFees : 0;

    const codFees = (totalSales * (countrySettings?.codFee || 5)) / 100;

    return {
      totalSales,
      totalCosts: totalCosts + totalShipping + totalCallCenter + codFees,
      shippingCost,
      returnCost,
      totalShipping,
      totalCallCenter,
      leadFees,
      confirmationFees,
      deliveryFees,
      codFees,
      confirmedOrders,
      deliveredOrders,
      returnedOrders,
      profitMargin: totalSales > 0 ? ((totalSales - totalCosts) / totalSales) * 100 : 0,
      monthlyCharges: 0,
    };
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-4 bg-white rounded-xl p-2 border border-purple-100">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'calculator'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-purple-50'
            }`}
        >
          <Calculator size={20} />
          Price Calculator
        </button>
        <button
          onClick={() => setActiveTab('simulations')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'simulations'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-purple-50'
            }`}
        >
          <History size={20} />
          Saved Simulations
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'settings'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-purple-50'
            }`}
        >
          <Settings size={20} />
          Settings
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'analytics'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-purple-50'
            }`}
        >
          <TrendingUp size={20} />
          Analytics
        </button>
      </div>

      {/* View Saved Prices Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowSavedPrices(true)}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center gap-2"
        >
          <Eye size={20} />
          View Saved Prices
        </button>
      </div>

      {activeTab === 'calculator' ? (
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Price Display and Service Settings */}
          <div className="col-span-8 space-y-6">
            <PriceDisplaySection
              salePrice={salePrice}
              sourcingPrice={sourcingPrice}
              onSalePriceChange={setSalePrice}
              onCalculateClick={() => setShowCalculator(true)}
              // onSavePrice={productId ? handleSavePrice : undefined}
              // isSaving={isSaving}
              selectedCountry={selectedCountry}
            />
            <ServiceSettings
              // selectedCountry={selectedCountry}
              settings={settings}
              onUpdateSettings={(updates: any)=>setSettings(updates)}
            />
          </div>

          {/* Right Column - Analytics */}
          <div className="col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-600 mb-1">Profit Margin</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {(((salePrice - sourcingPrice) / salePrice) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-600 mb-1">Markup</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {(((salePrice - sourcingPrice) / sourcingPrice) * 100).toFixed(1)}%
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-600 mb-1">Profit per Unit</div>
                  <div className="text-2xl font-bold text-green-900">
                    ${(salePrice - sourcingPrice).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <AnalyticsDiagrams results={calculateResults()} />
          </div>
        </div>
      ) : activeTab === 'simulations' ? (
        <SimulationsTab
          savedPrices={product?.savedPrices || []}
          onSelectPrice={(price) => {
            setSalePrice(price.salePrice);
            setSettings(price.settings);
            setActiveTab('calculator');
          }}
        />
      ) : activeTab === 'settings' ? (
        <ServiceSettings
          // selectedCountry={selectedCountry}
          settings={settings}
          onUpdateSettings={(updates: any)=>setSettings(updates)}
        />
      ) : (
        <AnalyticsDiagrams results={calculateResults()} />
      )}

      {/* Modals */}
      {showCalculator && (
        <SourcingCalculator
          // userId={user?.uid}
          onClose={() => setShowCalculator(false)}
          onPriceCalculated={price => {
            setSourcingPrice(price);
            setShowCalculator(false);
          }}
          productId={product?.id}
        />
      )}

      {showSavedPrices && product?.savedPrices && (
        <SavedPricesModal
          savedPrices={product.savedPrices}
          onClose={() => setShowSavedPrices(false)}
          onSelectPrice={(price: any) => {
            setSalePrice(price.salePrice);
            setSettings(price.settings);
            setShowSavedPrices(false);
            setActiveTab('calculator');
          }}
        />
      )}
    </div>
  );
}