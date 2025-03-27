import React, { useState } from 'react';
import { X, Calculator, TrendingUp, DollarSign, BarChart2, PieChart } from 'lucide-react';
import { AdsSection } from './components/AdsSection';
import { MonthlyChargesSection } from './components/MonthlyChargesSection';
import { PerformanceSection } from './components/PerformanceSection';
import { PricingSection } from './components/PricingSection';
import { ResultsSection } from './components/ResultsSection';
import { ServiceSettings } from './components/ServiceSettings';
import { SummaryCharts } from './components/SummaryCharts';

interface BusinessCalculatorProps {
  onClose: () => void;
}

export function BusinessCalculator({ onClose }: BusinessCalculatorProps) {
  const [activeTab, setActiveTab] = useState('revenue');
  const [isCosmetic, setIsCosmetic] = useState(true);
  const [withCallCenter, setWithCallCenter] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('KSA');
  const [prices, setPrices] = useState([
    { id: '1', name: 'Purchase Price', value: 0 },
    { id: '2', name: 'Sale Price', value: 0 }
  ]);
  const [adsCpl, setAdsCpl] = useState(0);
  const [adsCpc, setAdsCpc] = useState(0);
  const [adsCpm, setAdsCpm] = useState(0);
  const [monthlyCharges, setMonthlyCharges] = useState(0);
  const [numberOfLeads, setNumberOfLeads] = useState(100);
  const [confirmationRate, setConfirmationRate] = useState(60);
  const [deliveryRate, setDeliveryRate] = useState(45);

  const tabs = [
    { id: 'revenue', label: 'Revenue', icon: <TrendingUp size={20} /> },
    { id: 'costs', label: 'Costs', icon: <DollarSign size={20} /> },
    // to resolve build issue please check this
    // { id: 'metrics', label: 'Metrics', icon:  <boltAction type="file" filePath="src/components/BusinessCalculator/index.tsx">BarChart2 size={20} /> },
    { id: 'metrics', label: 'Metrics', icon:  <BarChart2 size={20} /> },
    { id: 'analysis', label: 'Analysis', icon: <PieChart size={20} /> },
  ];

  const handleAddPrice = () => {
    setPrices([
      ...prices,
      { id: `${prices.length + 1}`, name: '', value: 0 }
    ]);
  };

  const handleUpdatePrice = (id: string, value: number) => {
    setPrices(prices.map(price =>
      price.id === id ? { ...price, value } : price
    ));
  };

  const handleUpdatePriceName = (id: string, name: string) => {
    setPrices(prices.map(price =>
      price.id === id ? { ...price, name } : price
    ));
  };

  const handleDeletePrice = (id: string) => {
    setPrices(prices.filter(price => price.id !== id));
  };

  const calculateResults = () => {
    const purchasePrice = prices.find(p => p.name === 'Purchase Price')?.value || 0;
    const salePrice = prices.find(p => p.name === 'Sale Price')?.value || 0;
    
    const confirmedOrders = numberOfLeads * (confirmationRate / 100);
    const deliveredOrders = confirmedOrders * (deliveryRate / 100);
    const returnedOrders = confirmedOrders - deliveredOrders;

    const totalSales = deliveredOrders * salePrice;
    const productCosts = deliveredOrders * purchasePrice;
    
    const shippingCost = confirmedOrders * 5; // Example shipping cost
    const returnCost = returnedOrders * 3; // Example return cost
    const totalShippingCost = shippingCost + returnCost;

    const callCenterFees = withCallCenter ? confirmedOrders * 2 : 0; // Example call center fee
    const codFees = totalSales * 0.05; // 5% COD fee

    const totalCosts = productCosts + totalShippingCost + callCenterFees + codFees + monthlyCharges;
    const totalProfit = totalSales - totalCosts;
    const profitMargin = (totalProfit / totalSales) * 100;

    return {
      totalSales,
      totalCosts,
      totalProfit,
      shippingCost,
      returnCost,
      totalCallCenterFees: callCenterFees,
      codFees,
      productsDelivered: deliveredOrders,
      productsReturned: returnedOrders,
      profitMargin
    }
  }

  const results = calculateResults();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full max-w-[95vw] h-[95vh] mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calculator size={24} className="text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Business Calculator</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-3 gap-6 p-6 h-[calc(95vh-116px)] overflow-y-auto">
          {/* Left Column - Input Controls */}
          <div className="space-y-6">
            <PricingSection
              prices={prices}
              onAddPrice={handleAddPrice}
              onUpdatePrice={handleUpdatePrice}
              onUpdatePriceName={handleUpdatePriceName}
              onDeletePrice={handleDeletePrice}
            />
            <PerformanceSection
              numberOfLeads={numberOfLeads}
              confirmationRate={confirmationRate}
              deliveryRate={deliveryRate}
              onNumberOfLeadsChange={setNumberOfLeads}
              onConfirmationRateChange={setConfirmationRate}
              onDeliveryRateChange={setDeliveryRate}
            />
            <MonthlyChargesSection
              monthlyCharges={monthlyCharges}
              onMonthlyChargesChange={setMonthlyCharges}
            />
          </div>

          {/* Middle Column - Service Settings & Ads */}
          <div className="space-y-6">
            <ServiceSettings
              isCosmetic={isCosmetic}
              withCallCenter={withCallCenter}
              selectedCountry={selectedCountry}
              onCosmeticChange={setIsCosmetic}
              onCallCenterChange={setWithCallCenter}
              onCountryChange={setSelectedCountry}
            />
            <AdsSection
              adsCpl={adsCpl}
              adsCpc={adsCpc}
              adsCpm={adsCpm}
              onAdsCplChange={setAdsCpl}
              onAdsCpcChange={setAdsCpc}
              onAdsCpmChange={setAdsCpm}
            />
          </div>

          {/* Right Column - Results & Charts */}
          <div className="space-y-6">
            <ResultsSection
              salePrice={prices.find(p => p.name === 'Sale Price')?.value || 0}
              purchasePrice={prices.find(p => p.name === 'Purchase Price')?.value || 0}
              confirmationRate={confirmationRate}
              deliveryRate={deliveryRate}
              adsCpl={adsCpl}
              monthlyCharges={monthlyCharges}
              leadCost={2} // Example lead cost
              withCallCenter={withCallCenter}
              selectedCountry={selectedCountry}
            />
            <SummaryCharts results={results} />
          </div>
        </div>
      </div>
    </div>
  );
}