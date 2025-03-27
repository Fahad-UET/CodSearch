import React, { useState } from 'react';
import { Calculator, X, ArrowRight, ToggleLeft, ToggleRight, Settings, Sliders } from 'lucide-react';
import { PricingSection } from './components/PricingSection';
import { PerformanceSection } from './components/PerformanceSection';
import { ServiceProviderSection } from './components/ServiceProviderSection';
import { ResultsSection } from './components/ResultsSection';
import { MonthlyChargesSection } from './components/MonthlyChargesSection';
import { SummaryCharts } from './components/SummaryCharts';
import { ServiceSettingsModal } from './components/ServiceSettingsModal';
import { KpiSettingsModal } from '../KpiSettings/KpiSettingsModal';
import { ProductSelector } from './components/ProductSelector';
import { countries } from './constants';
import { useCalculatorStore } from '../../store/calculatorStore';
import { Product } from '../../types';

interface ProfitabilityCalculatorProps {
  onClose: () => void;
}

export function ProfitabilityCalculator({ onClose }: ProfitabilityCalculatorProps) {
  const [showServiceSettings, setShowServiceSettings] = useState(false);
  const [showKpiSettings, setShowKpiSettings] = useState(false);
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const [includeChargePerProduct, setIncludeChargePerProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const {
    purchasePrice,
    salePrice,
    numberOfLeads,
    confirmationRate,
    deliveryRate,
    selectedCountry,
    productType,
    serviceType,
    monthlyCharges,
    setPurchasePrice,
    setSalePrice,
    setNumberOfLeads,
    setConfirmationRate,
    setDeliveryRate,
    setSelectedCountry,
    setProductType,
    setServiceType,
    setMonthlyCharges,
  } = useCalculatorStore();

  // ... rest of the component remains the same until the header section

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full max-w-[95vw] h-[95vh] mx-4 bg-gradient-to-br from-white via-purple-50 to-indigo-50 rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        <div className="flex items-center justify-between px-6 py-3 bg-white/90 backdrop-blur-sm border-b border-purple-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Calculator size={24} className="text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-900">Profitability Calculator</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowKpiSettings(true)}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Sliders size={16} />
                KPI Settings
              </button>
              <button
                onClick={() => setShowAdvancedView(!showAdvancedView)}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
              >
                {showAdvancedView ? 'Simple View' : 'Advanced View'}
                <ArrowRight size={16} className={`transform transition-transform ${showAdvancedView ? 'rotate-180' : ''}`} />
              </button>
              <button
                onClick={() => setShowServiceSettings(true)}
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings size={16} />
                Service Settings
              </button>
              <button
                onClick={() => setIncludeChargePerProduct(!includeChargePerProduct)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                {includeChargePerProduct ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                Include Charge Per Product
                {includeChargePerProduct && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {/* ${Math.round(results.chargePerProduct || 0)} */} 0
                  </span>
                )}
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Rest of the component remains the same */}

        {/* Add KPI Settings Modal */}
        {showKpiSettings && (
          <KpiSettingsModal onClose={() => setShowKpiSettings(false)} />
        )}

        {/* Service Settings Modal */}
        {showServiceSettings && (
          <ServiceSettingsModal onClose={() => setShowServiceSettings(false)} />
        )}
      </div>
    </div>
  );
}