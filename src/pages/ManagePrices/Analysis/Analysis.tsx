import { X } from 'lucide-react';
import { useState } from 'react';
// import { useLanguageStore } from '../../../store/languageStore';
import { ROICalculationsView } from './RoiCalculationView';
import { ProfitMetrics } from './types/chart';

export function AnalysisTab({ onClose, product }: { onClose: () => void; product: any }) {
  const [metrics, setMetrics] = useState<ProfitMetrics>({
    availableStock: 100,
    sellingPrice: 53,
    purchasePrice: 8,
    baseCPL: 5,
    baseConfirmationRate: 50,
    baseDeliveryRate: 45,
    deliveryServiceCosts: 0, // Removed from UI but kept for calculations
    monthlyFixedCosts: 0, // Removed from UI but kept for calculations
  });
  return (
    <div className="  backdrop-blur-md z-[200] flex items-center justify-center">
      <div className="relative w-full  overflow-hidden bg-white/90 overflow-y-auto">
        {/* Header */}
        {/* <div className="flex justify-between items-center p-6 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-purple-900">Profit Evolution Chart</h2>
          <button
            onClick={onClose}
            className="p-2 text-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div> */}
        <div>
          <ROICalculationsView metrics={metrics} product={product} />
        </div>
      </div>
    </div>
  );
}
