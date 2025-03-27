import React, { useState } from 'react';
import { Calculator, Save, AlertCircle } from 'lucide-react';
import { useServiceProviderStore } from '../../../store/serviceProviderStore';
import { useKpiStore } from '../../../store/kpiStore';
import { useProductStore } from '../../../store';
import { updateProduct as updateProductService } from '../../../services/firebase';
import { SourcingCalculator } from '../../../components/SourcingCalculator';
import { SalesPriceAnalysis } from '../../../components/SalesPriceAnalysis';
import { useCurrencyDisplay } from '../../../hooks/useCurrencyDisplay';

interface SalesPriceTabProps {
  selectedCountry: string;
  onPriceCalculated: (price: number) => void;
  productId: string;
}

export function SalesPriceTab({
  selectedCountry: initialCountry,
  onPriceCalculated,
  productId,
}: SalesPriceTabProps) {
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSimulation, setShowSimulation] = useState(false);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [sourcingPrice, setSourcingPrice] = useState<number>(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const { providers, selectedProviderId } = useServiceProviderStore();
  const { getCountrySettings } = useKpiStore();
  const { user } = useProductStore();

  const [settings, setSettings] = useState({
    confirmationRate: 60,
    deliveryRate: 45,
    cpl: 2.5,
    chargePerProduct: 2.45,
    stock: 100,
    productType: 'cosmetic' as 'cosmetic' | 'gadget',
    serviceType: 'withCallCenter' as 'withCallCenter' | 'withoutCallCenter',
    monthlyProductCharges: ''
  });

  const selectedProvider = providers.find(p => p.id === selectedProviderId);
  const countrySettings = selectedProvider?.countries[selectedCountry];
  const kpiSettings = getCountrySettings(selectedCountry);
  const { formatLocalPrice, convertToUSD, convertFromUSD, currencySymbol } =
    useCurrencyDisplay(selectedCountry);

  return (
    <div>
      {/* Parameters Section */}
      <div className="flex gap-5">
        <div className="w-4/12">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-white">Sale Price</h3>
            </div>
            {!sourcingPrice && (
              <p className="text-white/70 text-lg my-5 text-center">
                Calculate Sourcing Price first to enter sales Price
              </p>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSimulation(true)}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
              >
                Simulation
              </button>
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={convertFromUSD(salePrice)}
                    disabled={!sourcingPrice}
                    onChange={e => {
                      const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                      if (!isNaN(numValue)) {
                        const usdPrice = convertToUSD(numValue);
                        setSalePrice(usdPrice);
                      }
                    }}
                    className="w-full pl-12 h-12 text-2xl font-medium bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/20"
                    placeholder="0.00"
                  />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 text-xl">
                    {currencySymbol}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 shadow-lg mt-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-white">Sourcing Price</h3>
            </div>
            {sourcingPrice ? (
              <p className="text-white text-2xl font-bold my-5 text-center">
                ${`${sourcingPrice}`}
              </p>
            ) : (
              <p className="text-white/70 text-lg my-5 text-center">
                {'No Sourcing Price calculated yet'}
              </p>
            )}
            <div className="flex justify-center">
              <button
                onClick={() => setShowCalculator(true)}
                className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors flex items-center gap-2"
              >
                <Calculator size={20} />
                Calculate Price
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-4 shadow-lg mt-3 mb-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-2xl font-bold text-white">Profit Per Product</h3>
            </div>
            {salePrice && sourcingPrice ? (
              <p className="text-white text-2xl font-bold my-5 text-center">
                $
                {settings.stock !== 0
                  ? ((salePrice - sourcingPrice) / settings.stock).toFixed(2)
                  : 'Error: Stock cannot be zero'}{' '}
                <span className="text-white/70 text-lg ">per unit</span>
              </p>
            ) : (
              <div className="text-white/70 text-lg my-5 text-center">
                Enter Sale Price and calculate sourcing price
              </div>
            )}
          </div>
        </div>

        {/* Rest of the component remains the same */}
        {/* Service Settings */}
        <div className="bg-white rounded-xl p-6 border border-purple-100 h-max shadow-sm mb-6 w-8/12">
          {/* ... existing service settings code ... */}
        </div>
      </div>

      {/* Analysis Section */}
      <div key={forceUpdate} className="mt-8">
        <SalesPriceAnalysis
          salePrice={salePrice}
          sourcingPrice={sourcingPrice}
          settings={settings}
          countrySettings={countrySettings}
        />
      </div>

      {/* Modals */}
      {showCalculator && (
        <SourcingCalculator
          // userId={user?.uid}
          onClose={() => setShowCalculator(false)}
          onPriceCalculated={price => {
            setSourcingPrice(price);
            setShowCalculator(false);
          }}
          productId={productId}
        />
      )}
    </div>
  );
}
