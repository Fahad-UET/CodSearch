import React, { useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { PricingSection } from './ProfitabilityCalculator/components/PricingSection';
import { PerformanceSection } from './ProfitabilityCalculator/components/PerformanceSection';
import { ServiceProviderSection } from './ProfitabilityCalculator/components/ServiceProviderSection';
import { ResultsSection } from './ProfitabilityCalculator/components/ResultsSection';
import { CompetitorPricesSection } from './ProfitabilityCalculator/components/CompetitorPricesSection';
import { shippingCosts } from './ProfitabilityCalculator/constants';

interface ProfitabilityCalculatorProps {
  onClose: () => void;
}

export function ProfitabilityCalculator({ onClose }: ProfitabilityCalculatorProps) {
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [numberOfLeads, setNumberOfLeads] = useState<number>(100);
  const [confirmationRate, setConfirmationRate] = useState<number>(60);
  const [deliveryRate, setDeliveryRate] = useState<number>(45);
  const [selectedCountry, setSelectedCountry] = useState<string>('KSA');
  const [productType, setProductType] = useState<'cosmetic' | 'gadget'>('cosmetic');
  const [serviceType, setServiceType] = useState<'with' | 'without'>('with');
  const [competitorPrices, setCompetitorPrices] = useState([
    { id: '1', name: 'AliExpress', value: 0 },
    { id: '2', name: 'Alibaba', value: 0 },
    { id: '3', name: 'Amazon', value: 0 },
    { id: '4', name: 'Noon', value: 0 }
  ]);

  const handleAddPrice = () => {
    const newId = `${competitorPrices.length + 1}`;
    setCompetitorPrices(prev => [...prev, { id: newId, name: 'Other', value: 0 }]);
  };

  const handleUpdatePrice = (id: string, value: number) => {
    setCompetitorPrices(prev => prev.map(price => 
      price.id === id ? { ...price, value } : price
    ));
  };

  const handleDeletePrice = (id: string) => {
    setCompetitorPrices(prev => prev.filter(price => price.id !== id));
  };

  const calculateResults = () => {
    // Calculate confirmed and delivered orders
    const confirmedOrders = numberOfLeads * (confirmationRate / 100);
    const deliveredOrders = confirmedOrders * (deliveryRate / 100);
    const returnedOrders = confirmedOrders - deliveredOrders;

    // Calculate total sales
    const totalSales = deliveredOrders * salePrice;

    // Get shipping costs based on country and service type
    const costs = shippingCosts[selectedCountry as keyof typeof shippingCosts][serviceType];
    const shippingCostPerOrder = costs.shipping;
    const returnCostPerOrder = costs.return;

    // Calculate shipping and return costs
    const shippingCost = confirmedOrders * shippingCostPerOrder;
    const returnCost = returnedOrders * returnCostPerOrder;

    return {
      productsReturned: Math.round(returnedOrders),
      productsDelivered: Math.round(deliveredOrders),
      totalSales,
      shippingCost,
      returnCost,
      totalShippingCost: shippingCost + returnCost,
      numberOfLeads,
      confirmationRate,
      deliveryRate,
      salePrice,
      shippingCostPerOrder,
      returnCostPerOrder
    };
  };

  const results = calculateResults();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full max-w-[95vw] h-[95vh] mx-4 bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm border-b border-purple-100">
          <div className="flex items-center gap-3">
            <Calculator size={24} className="text-purple-600" />
            <h2 className="text-xl font-semibold text-purple-900">Profitability Calculator</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="space-y-4">
            <PricingSection
              purchasePrice={purchasePrice}
              salePrice={salePrice}
              onPurchasePriceChange={setPurchasePrice}
              onSalePriceChange={setSalePrice}
            />
            <PerformanceSection
              numberOfLeads={numberOfLeads}
              confirmationRate={confirmationRate}
              deliveryRate={deliveryRate}
              onNumberOfLeadsChange={setNumberOfLeads}
              onConfirmationRateChange={setConfirmationRate}
              onDeliveryRateChange={setDeliveryRate}
            />
          </div>

          <div className="space-y-4">
            <ServiceProviderSection
              selectedCountry={selectedCountry}
              productType={productType}
              serviceType={serviceType}
              onCountryChange={setSelectedCountry}
              onProductTypeChange={setProductType}
              onServiceTypeChange={setServiceType}
              // to resolve build issue please check this
              onOpenSettings={()=>{}}
            />
          </div>

          <div className="space-y-4">
            <ResultsSection results={results} />
          </div>

          <div className="space-y-4">
            <CompetitorPricesSection
              prices={competitorPrices}
              onAddPrice={handleAddPrice}
              onUpdatePrice={handleUpdatePrice}
              onDeletePrice={handleDeletePrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}