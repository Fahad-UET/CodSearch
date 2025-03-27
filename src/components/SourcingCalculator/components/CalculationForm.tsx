import React, { useState } from 'react';
import { DollarSign, Plane, Ship } from 'lucide-react';
import { SourcingFormData } from '../types';
import { VolumetricWeightCalculator } from './VolumetricWeightCalculator';

interface CalculationFormProps {
  formData: SourcingFormData;
  onChange: (data: Partial<SourcingFormData>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  setVolumetricWeight: any;
  handleInputChange: any;
  inputValue: any;
  setDimensions: any;
  dimensions: any;
}

export function CalculationForm({
  formData,
  onChange,
  onSubmit,
  isLoading,
  setVolumetricWeight,
  handleInputChange,
  inputValue,
  setDimensions,
  dimensions,
}: CalculationFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alibaba Price</label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.alibabaPrice || ''}
            onChange={e => onChange({ alibabaPrice: parseFloat(e.target.value) })}
            className="w-full pl-8 rounded-lg border-[1px] border-black  focus:border-purple-500 focus:ring focus:ring-purple-200"
            placeholder="0.00"
          />
          <DollarSign
            size={16}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Add Volumetric Weight Calculator */}
      <VolumetricWeightCalculator
        dimensions={dimensions}
        setDimensions={setDimensions}
        onWeightCalculated={weight => setVolumetricWeight(weight)}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Actual Weight</label>
        <input
          required
          type="number"
          // min="0"
          step="0.1"
          value={formData.chargeableWeight || 0}
          onChange={e => onChange({ chargeableWeight: parseFloat(e.target.value) })}
          className="border-[1px] border-black w-full rounded-lg ps-2 focus:border-purple-500 focus:ring focus:ring-purple-200"
          placeholder="Enter weight in kg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onChange({ shippingMethod: 'air' })}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
              formData.shippingMethod === 'air'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-200'
            }`}
          >
            <Plane
              size={24}
              className={formData.shippingMethod === 'air' ? 'text-purple-500' : 'text-gray-400'}
            />
            <div className="text-left">
              <div className="font-medium">Air Freight</div>
              <div className="text-sm text-gray-500">7-15 days</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ shippingMethod: 'sea' })}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
              formData.shippingMethod === 'sea'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-200'
            }`}
          >
            <Ship
              size={24}
              className={formData.shippingMethod === 'sea' ? 'text-purple-500' : 'text-gray-400'}
            />
            <div className="text-left">
              <div className="font-medium">Sea Freight</div>
              <div className="text-sm text-gray-500">30-45 days</div>
            </div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Price</label>
        <input
          type="number"
          min="0"
          step="0.1"
          value={formData.shippingRate || ''}
          onChange={e => onChange({ shippingRate: parseFloat(e.target.value) })}
          className="w-full rounded-lg  border-[1px] border-black  focus:border-purple-500 focus:ring focus:ring-purple-200"
          placeholder="Enter weight in kg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customs Duty Rate (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.customsDutyRate || ''}
            onChange={e => onChange({ customsDutyRate: parseFloat(e.target.value) })}
            className="border-[1px] border-black w-full rounded-lg  focus:border-purple-500 focus:ring focus:ring-purple-200"
            placeholder="Enter rate %"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">VAT Rate (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.vatRate || ''}
            onChange={e => onChange({ vatRate: parseFloat(e.target.value) })}
            className="border-[1px] border-black w-full rounded-lg  focus:border-purple-500 focus:ring focus:ring-purple-200"
            placeholder="Enter rate %"
          />
        </div>
      </div>
    </form>
  );
}
