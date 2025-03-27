import React from 'react';
import { Package2, Users } from 'lucide-react';
import { useKpiStore } from '../../../store/kpiStore';
import { calculateRequiredLeads } from '../../../utils/stockCalculations';

interface StockAnalysisSectionProps {
  selectedCountry: string;
  initialStock?: number;
  initialLeads?: number;
  onStockChange: (stock: number) => void;
  onLeadsChange: (leads: number) => void;
}

export function StockAnalysisSection({
  selectedCountry,
  initialStock = 100,
  initialLeads,
  onStockChange,
  onLeadsChange
}: StockAnalysisSectionProps) {
  const { getCountrySettings } = useKpiStore();
  const kpiSettings = getCountrySettings(selectedCountry);

  // Get rates from KPI settings
  const deliveryRate = kpiSettings.deliveryRate.high / 100;
  const confirmationRate = kpiSettings.confirmationRate.high / 100;

  // Calculate initial required leads if not provided
  const defaultLeads = initialLeads ?? calculateRequiredLeads(
    initialStock,
    kpiSettings.deliveryRate.high,
    kpiSettings.confirmationRate.high
  );

  const handleStockChange = (value: string) => {
    const stock = parseInt(value) || 0;
    onStockChange(stock);

    // Calculate required leads based on target stock
    const requiredLeads = calculateRequiredLeads(
      stock,
      kpiSettings.deliveryRate.high,
      kpiSettings.confirmationRate.high
    );
    onLeadsChange(requiredLeads);
  };

  const handleLeadsChange = (value: string) => {
    const leads = parseInt(value) || 0;
    onLeadsChange(leads);

    // Calculate expected stock based on leads
    const expectedStock = Math.floor(leads * confirmationRate * deliveryRate);
    onStockChange(expectedStock);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Stock
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={initialStock}
            onChange={(e) => handleStockChange(e.target.value)}
            className="w-full pl-10 h-16 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 bg-white/50 text-lg"
            placeholder="Enter target stock"
          />
          <Package2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Required Leads
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={defaultLeads}
            onChange={(e) => handleLeadsChange(e.target.value)}
            className="w-full pl-10 h-16 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 bg-white/50 text-lg"
            placeholder="Enter number of leads"
          />
          <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
}