import { DollarSign, Truck, FileText } from 'lucide-react';
import { CalculationResult } from '../types';

interface CalculationResultsProps {
  result: CalculationResult;
  onSave: () => void;
  isLoading: boolean;
  isFormValid: boolean;
}

export function CalculationResults({
  result,
  onSave,
  isLoading,
  isFormValid,
}: CalculationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Formulas */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center gap-2">
          <FileText size={16} />
          Calculation Formulas
        </h3>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">Charged Weight:</span>
            <span className="text-blue-900 font-mono ml-2">
              MAX(Volumetric Weight, Chargeable Weight)
            </span>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">Shipping Cost:</span>
            <span className="text-blue-900 font-mono ml-2">{result.formula.shippingCost}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">Customs Duty:</span>
            <span className="text-blue-900 font-mono ml-2">{result.formula.customsDuty}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">VAT:</span>
            <span className="text-blue-900 font-mono ml-2">{result.formula.vat}</span>
          </div>
          <div className="p-2 bg-white/80 rounded-lg">
            <span className="text-blue-700">Total Price:</span>
            <span className="text-blue-900 font-mono ml-2">{result.formula.total}</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown</h3>

        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-blue-600" />
              <span className="text-blue-900">Shipping Cost</span>
            </div>
            <span className="font-medium text-blue-900">${result.shippingCost.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-blue-600" />
              <span className="text-blue-900">Customs Duty</span>
            </div>
            <span className="font-medium text-blue-900">${result.customsDuty.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-blue-600" />
              <span className="text-blue-900">VAT</span>
            </div>
            <span className="font-medium text-blue-900">${result.vat.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg mt-4">
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-blue-200" />
            <span className="font-medium">Total Sourcing Price</span>
          </div>
          <span className="text-xl font-bold">${result.totalPrice.toFixed(2)}</span>
        </div>
        {!isFormValid && (
          <span className="text-red-600 mt-4">Fill Out Complete form to save price</span>
        )}
        <button
          onClick={onSave}
          disabled={isLoading || !isFormValid}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            'Save & Use This Price'
          )}
        </button>
      </div>
    </div>
  );
}
