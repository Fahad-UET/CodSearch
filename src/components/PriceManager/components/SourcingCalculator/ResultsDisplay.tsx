import React from 'react';
import { DollarSign, Package, Truck, FileText, Plane, Ship, Calculator } from 'lucide-react';

interface ResultsDisplayProps {
  results: {
    shippingCost: number;
    customsDuty: number;
    vat: number;
    totalPrice: number;
    ratePerKg: number;
    formula: {
      volumetricWeight: string;
      shippingCost: string;
      customsDuty: string;
      vat: string;
      total: string;
    };
  };
  volumetricWeight: number;
  chargeableWeight: number;
}

export function ResultsDisplay({ results, volumetricWeight, chargeableWeight }: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Formulas */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
          <Calculator size={16} />
          Calculation Formulas
        </h3>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">Volumetric Weight:</span>
            <span className="text-blue-900 font-mono ml-2">{results.formula.volumetricWeight}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">Shipping Cost:</span>
            <span className="text-blue-900 font-mono ml-2">{results.formula.shippingCost}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">Customs Duty:</span>
            <span className="text-blue-900 font-mono ml-2">{results.formula.customsDuty}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">VAT:</span>
            <span className="text-blue-900 font-mono ml-2">{results.formula.vat}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">Total Price:</span>
            <span className="text-blue-900 font-mono ml-2">{results.formula.total}</span>
          </div>
        </div>
      </div>

      {/* Weight Information */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
          <Package size={16} />
          Weight Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white/80 rounded-lg">
            <div className="text-sm text-blue-700">Volumetric Weight</div>
            <div className="font-medium text-blue-900">{volumetricWeight.toFixed(2)} kg</div>
          </div>
          <div className="p-3 bg-white/80 rounded-lg">
            <div className="text-sm text-blue-700">Chargeable Weight</div>
            <div className="font-medium text-blue-900">{chargeableWeight.toFixed(2)} kg</div>
          </div>
        </div>
      </div>

      {/* Shipping Rates */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
          <Truck size={16} />
          Shipping Rates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
            <Plane size={16} className="text-blue-600" />
            <div>
              <div className="text-sm text-blue-700">Air Freight</div>
              <div className="font-medium text-blue-900">${results.ratePerKg}/kg</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
            <Ship size={16} className="text-blue-600" />
            <div>
              <div className="text-sm text-blue-700">Sea Freight</div>
              <div className="font-medium text-blue-900">${results.ratePerKg}/kg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-blue-900 flex items-center gap-2">
          <FileText size={16} />
          Cost Breakdown
        </h3>

        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-blue-600" />
              <span className="text-blue-900">Shipping Cost</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm text-blue-600">
                ({chargeableWeight.toFixed(2)} kg × ${results.ratePerKg}/kg)
              </span>
              <span className="font-medium text-blue-900">${results.shippingCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <span className="text-blue-900">Customs Duty</span>
            </div>
            <span className="font-medium text-blue-900">${results.customsDuty.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-blue-600" />
              <span className="text-blue-900">VAT</span>
            </div>
            <span className="font-medium text-blue-900">${results.vat.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg mt-4">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-blue-200" />
            <span className="font-medium">Total Sourcing Price</span>
          </div>
          <span className="text-xl font-bold">
            ${results.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}