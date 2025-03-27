import React, { useState } from 'react';
import { Calculator, X, DollarSign, Package, Truck, FileText, Info } from 'lucide-react';
import { DimensionsInput } from './DimensionsInput';
import { ShippingMethodSelect } from './ShippingMethodSelect';
import { ResultsDisplay } from './ResultsDisplay';
import { calculateVolumetricWeight, calculateSourcingPrice, SHIPPING_RATES } from './calculations';

interface SourcingCalculatorProps {
  onPriceCalculated: (price: number) => void;
  onClose: () => void;
}

export function SourcingCalculator({
  onPriceCalculated,
  onClose,
}: SourcingCalculatorProps) {
  const [formData, setFormData] = useState({
    alibabaPrice: 0,
    realWeight: 0,
    length: 0,
    width: 0,
    height: 0,
    shippingMethod: 'air' as 'air' | 'sea',
    customsDutyRate: 5,
    vatRate: 15,
    declaredValue: 0,
  });

  const volumetricWeight = calculateVolumetricWeight(
    formData.length,
    formData.width,
    formData.height
  );

  const chargeableWeight = Math.max(volumetricWeight, formData.realWeight);

  const results = calculateSourcingPrice({
    ...formData,
    chargeableWeight,
  });

  const handleSubmit = () => {
    onPriceCalculated(results.totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[400]">
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator size={24} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold">Sourcing Price Calculator</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-6">
              {/* Alibaba Price - Prominent Display */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                <label className="block text-lg font-medium mb-2">Alibaba Price</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.alibabaPrice}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        alibabaPrice: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-10 py-3 text-xl bg-white/10 border border-white/20 rounded-lg placeholder-white/50 text-white focus:border-white focus:ring focus:ring-white/20"
                    placeholder="0.00"
                  />
                  <DollarSign
                    size={24}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
                  />
                </div>
              </div>

              {/* Weight & Dimensions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={20} className="text-blue-600" />
                  Weight & Dimensions
                </h3>

                <div className="space-y-4">
                  {/* Real Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Real Weight (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.realWeight}
                        onChange={e =>
                          setFormData(prev => ({
                            ...prev,
                            realWeight: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full pl-8 rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="0.00"
                      />
                      <Package
                        size={16}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Dimensions */}
                  <DimensionsInput
                    dimensions={{
                      length: formData.length,
                      width: formData.width,
                      height: formData.height,
                    }}
                    onChange={dimensions =>
                      setFormData(prev => ({
                        ...prev,
                        ...dimensions,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Shipping Method */}
              <ShippingMethodSelect
                value={formData.shippingMethod}
                onChange={method =>
                  setFormData(prev => ({
                    ...prev,
                    shippingMethod: method,
                  }))
                }
              />

              {/* Tax Settings */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  Tax Settings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customs Duty Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.customsDutyRate}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          customsDutyRate: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      VAT Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.vatRate}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          vatRate: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div>
              <ResultsDisplay
                results={results}
                volumetricWeight={volumetricWeight}
                chargeableWeight={chargeableWeight}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-white/80 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            Use This Price
            <DollarSign size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
