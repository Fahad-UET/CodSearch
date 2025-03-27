import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart2, Package, Calculator, Building, Settings } from 'lucide-react';
import { ResultsSection } from './components/ResultsSection';
import { useKpiStore } from '../../store/kpiStore';
import { KpiThresholdCircles } from './components/KpiThresholdCircles';
import { useServiceProviderStore } from '../../store/serviceProviderStore';
import { COUNTRIES } from '../../services/codNetwork/constants';

interface ProfitabilityTabProps {
  purchasePrice: number;
  salePrice: number;
  selectedCountry: string;
  unitCount: number;
  productType: 'cosmetic' | 'gadget';
  serviceType: 'with' | 'without';
  onCountryChange?: (country: string) => void;
  onProductTypeChange?: (type: 'cosmetic' | 'gadget') => void;
  onServiceTypeChange?: (type: 'with' | 'without') => void;
}

export function ProfitabilityTab({
  purchasePrice,
  salePrice,
  selectedCountry,
  unitCount,
  productType,
  serviceType,
  onCountryChange,
  onProductTypeChange,
  onServiceTypeChange
}: ProfitabilityTabProps) {
  const [useRealData, setUseRealData] = useState(false);
  const [simulatorValues, setSimulatorValues] = useState({
    cpl: 0,
    confirmationRate: 0,
    deliveryRate: 0,
    stock: unitCount,
    leads: 0
  });

  const { getCountrySettings } = useKpiStore();
  const { providers, selectedProviderId } = useServiceProviderStore();
  const kpiSettings = getCountrySettings(selectedCountry);
  const selectedProvider = providers.find(p => p.id === selectedProviderId);

  // Update simulator values when KPI settings change
  useEffect(() => {
    if (!useRealData) {
      setSimulatorValues(prev => ({
        ...prev,
        cpl: kpiSettings.cpl.medium,
        confirmationRate: kpiSettings.confirmationRate.medium,
        deliveryRate: kpiSettings.deliveryRate.medium
      }));
    }
  }, [selectedCountry, useRealData, kpiSettings]);

  const calculateResults = () => {
    // Get values based on mode
    const effectiveValues = useRealData ? {
      cpl: kpiSettings.cpl.medium,
      confirmationRate: kpiSettings.confirmationRate.medium,
      deliveryRate: kpiSettings.deliveryRate.medium
    } : simulatorValues;

    // Calculate orders
    const confirmedOrders = Math.round((simulatorValues.leads * effectiveValues.confirmationRate) / 100);
    const deliveredOrders = Math.round((confirmedOrders * effectiveValues.deliveryRate) / 100);
    const returnedOrders = confirmedOrders - deliveredOrders;

    // Get shipping costs based on country and service type
    const countrySettings = selectedProvider?.countries[selectedCountry];
    const shippingCosts = countrySettings?.shippingCosts[serviceType === 'with' ? 'withCallCenter' : 'withoutCallCenter'];
    const callCenterFees = countrySettings?.callCenterFees[productType];

    // Calculate revenue and costs
    const totalSales = deliveredOrders * salePrice;
    const totalCosts = deliveredOrders * purchasePrice;

    // Calculate fees
    const shippingCost = confirmedOrders * (shippingCosts?.shipping || 0);
    const returnCost = returnedOrders * (shippingCosts?.return || 0);
    const totalShipping = shippingCost + returnCost;

    // Calculate call center costs
    const leadFees = simulatorValues.leads * (callCenterFees?.lead || 0);
    const confirmationFees = confirmedOrders * (callCenterFees?.confirmation || 0);
    const deliveryFees = deliveredOrders * (callCenterFees?.delivered || 0);
    const totalCallCenter = serviceType === 'with' ? (leadFees + confirmationFees + deliveryFees) : 0;

    // Calculate COD fees
    const codFees = totalSales * (countrySettings?.codFee || 5) / 100;

    // Calculate totals
    const totalCostsWithFees = totalCosts + totalShipping + totalCallCenter + codFees;
    const totalProfit = totalSales - totalCostsWithFees;
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    return {
      totalSales,
      totalCosts: totalCostsWithFees,
      totalProfit,
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
      profitMargin,
      monthlyCharges: 0,
      expenses: 0
    };
  };

  return (
    <div className="space-y-6">
      {/* Simulator Controls */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Top Row - Mode Toggle and Service Settings */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setUseRealData(!useRealData)}
              className={`relative inline-flex h-8 w-36 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                useRealData ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                  useRealData ? 'translate-x-28' : 'translate-x-1'
                }`}
              />
              <span className={`absolute left-3 text-xs font-medium ${useRealData ? 'text-white/0' : 'text-gray-900'}`}>
                Simulated
              </span>
              <span className={`absolute right-3 text-xs font-medium ${useRealData ? 'text-white' : 'text-gray-900/0'}`}>
                Real Data
              </span>
            </button>

            <div className="flex items-center gap-4 text-sm">
              {/* Service Provider */}
              <div className="flex items-center gap-2">
                <Building size={16} className="text-gray-400" />
                <select
                  value={selectedProviderId}
                  disabled
                  className="h-8 text-sm rounded-lg border-gray-200 bg-gray-50"
                >
                  <option value="cod-network">COD NETWORK</option>
                </select>
              </div>

              {/* Country */}
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-gray-400" />
                <select
                  value={selectedCountry}
                  onChange={(e) => onCountryChange(e.target.value)}
                  className="h-8 text-sm rounded-lg border-gray-200"
                >
                  {Object.entries(COUNTRIES).map(([code, { name }]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Row - Simulator Controls */}
          {!useRealData && (
            <div className="grid grid-cols-5 gap-4 pt-4 border-t">
              {/* Stock & Leads */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Target Stock</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={simulatorValues.stock}
                      onChange={(e) => setSimulatorValues(prev => ({
                        ...prev,
                        stock: parseInt(e.target.value)
                      }))}
                      className="w-full pl-7 h-8 text-sm rounded-lg border-gray-200"
                    />
                    <Package size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Required Leads</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={simulatorValues.leads}
                      onChange={(e) => setSimulatorValues(prev => ({
                        ...prev,
                        leads: parseInt(e.target.value)
                      }))}
                      className="w-full pl-7 h-8 text-sm rounded-lg border-gray-200"
                    />
                    <Calculator size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* CPL */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">CPL</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={simulatorValues.cpl}
                      onChange={(e) => setSimulatorValues(prev => ({
                        ...prev,
                        cpl: parseFloat(e.target.value)
                      }))}
                      className="w-full pl-6 h-8 text-sm rounded-lg border-gray-200"
                    />
                    <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  <KpiThresholdCircles
                    threshold={kpiSettings.cpl}
                    currentValue={simulatorValues.cpl}
                    onSelect={(value) => setSimulatorValues(prev => ({ ...prev, cpl: value }))}
                    unit="$"
                  />
                </div>
              </div>

              {/* Confirmation Rate */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Confirmation Rate</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={simulatorValues.confirmationRate}
                      onChange={(e) => setSimulatorValues(prev => ({
                        ...prev,
                        confirmationRate: parseFloat(e.target.value)
                      }))}
                      className="w-full pr-6 h-8 text-sm rounded-lg border-gray-200"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
                  </div>
                  <KpiThresholdCircles
                    threshold={kpiSettings.confirmationRate}
                    currentValue={simulatorValues.confirmationRate}
                    onSelect={(value) => setSimulatorValues(prev => ({ ...prev, confirmationRate: value }))}
                    unit="%"
                  />
                </div>
              </div>

              {/* Delivery Rate */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Delivery Rate</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={simulatorValues.deliveryRate}
                      onChange={(e) => setSimulatorValues(prev => ({
                        ...prev,
                        deliveryRate: parseFloat(e.target.value)
                      }))}
                      className="w-full pr-6 h-8 text-sm rounded-lg border-gray-200"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">%</span>
                  </div>
                  <KpiThresholdCircles
                    threshold={kpiSettings.deliveryRate}
                    currentValue={simulatorValues.deliveryRate}
                    onSelect={(value) => setSimulatorValues(prev => ({ ...prev, deliveryRate: value }))}
                    unit="%"
                  />
                </div>
              </div>

              {/* Product Type & Service Type */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Product Type</label>
                  <select
                    value={productType}
                    onChange={(e) => onProductTypeChange(e.target.value as 'cosmetic' | 'gadget')}
                    className="w-full h-8 text-sm rounded-lg border-gray-200"
                  >
                    <option value="cosmetic">Cosmetic</option>
                    <option value="gadget">Gadget</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => onServiceTypeChange(e.target.value as 'with' | 'without')}
                    className="w-full h-8 text-sm rounded-lg border-gray-200"
                  >
                    <option value="with">With Call Center</option>
                    <option value="without">Without Call Center</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <ResultsSection results={calculateResults()} />
    </div>
  );
}