import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Package } from 'lucide-react';
import { CountrySettingsData } from '../../../services/serviceProviders/types';

interface DetailedAnalysisProps {
  results: {
    totalSales: number;
    grossProfit: number;
    profitPerUnit: number;
    totalCosts: number;
    shippingCosts: number;
    returnCosts: number;
    callCenterFees: { lead: number; confirmation: number; delivered: number } | null;
    codFee: number;
    monthlyCharges: number;
  };
  settings: {
    stock: number;
    productType: 'cosmetic' | 'gadget';
    serviceType: 'with' | 'without';
  };
  salePrice: number;
  sourcingPrice: number;
  countrySettings: CountrySettingsData | undefined;
}

export function DetailedAnalysis({
  results,
  settings,
  salePrice,
  sourcingPrice,
  countrySettings,
}: DetailedAnalysisProps) {
  const sections = {
    revenue: {
      title: 'Revenue Analysis',
      icon: DollarSign,
      color: 'purple',
      formula: `Total Sales = Sale Price × Stock\n${salePrice} × ${
        settings.stock
      } = ${results.totalSales.toFixed(2)}`,
      details: [
        { label: 'Sale Price', value: `$${salePrice.toFixed(2)}` },
        { label: 'Stock', value: settings.stock },
        { label: 'Total Sales', value: `$${results.totalSales.toFixed(2)}` },
      ],
    },
    grossProfit: {
      title: 'Gross Profit Analysis',
      icon: TrendingUp,
      color: 'green',
      formula: `Gross Profit = (Sale Price - Sourcing Price) × Stock\n(${salePrice.toFixed(
        2
      )} - ${sourcingPrice.toFixed(2)}) × ${settings.stock} = ${results.grossProfit.toFixed(2)}`,
      details: [
        { label: 'Sale Price', value: `$${salePrice.toFixed(2)}` },
        { label: 'Sourcing Price', value: `$${sourcingPrice.toFixed(2)}` },
        { label: 'Profit per Unit', value: `$${results.profitPerUnit.toFixed(2)}` },
        { label: 'Stock', value: settings.stock },
        { label: 'Total Gross Profit', value: `$${results.grossProfit.toFixed(2)}` },
      ],
    },
    profitPerUnit: {
      title: 'Unit Economics',
      icon: Package,
      color: 'blue',
      formula: `Profit per Unit = Sale Price - (Sourcing Price + Shipping + COD Fee)\n${salePrice.toFixed(
        2
      )} - (${sourcingPrice.toFixed(2)} + ${results.shippingCosts.toFixed(2)} + ${(
        salePrice *
        (results.codFee / 100)
      ).toFixed(2)}) = ${results.profitPerUnit.toFixed(2)}`,
      details: [
        { label: 'Sale Price', value: `$${salePrice.toFixed(2)}` },
        { label: 'Sourcing Cost', value: `$${sourcingPrice.toFixed(2)}` },
        { label: 'Shipping Cost', value: `$${results.shippingCosts.toFixed(2)}` },
        { label: 'COD Fee', value: `${results.codFee}%` },
        { label: 'Net Profit per Unit', value: `$${results.profitPerUnit.toFixed(2)}` },
      ],
    },
    totalCosts: {
      title: 'Total Costs Breakdown',
      icon: BarChart2,
      color: 'red',
      formula: `Total Costs = (Sourcing + Shipping + Returns + Call Center + COD) × Stock + Monthly Charges\n(${sourcingPrice.toFixed(
        2
      )} + ${results.shippingCosts.toFixed(2)} + ${results.returnCosts.toFixed(2)} + ${(
        results.callCenterFees?.delivered || 0
      ).toFixed(2)} + ${(salePrice * (results.codFee / 100)).toFixed(2)}) × ${
        settings.stock
      } + ${results.monthlyCharges.toFixed(2)} = ${results.totalCosts.toFixed(2)}`,
      details: [
        { label: 'Sourcing Costs', value: `$${(sourcingPrice * settings.stock).toFixed(2)}` },
        {
          label: 'Shipping Costs',
          value: `$${(results.shippingCosts * settings.stock).toFixed(2)}`,
        },
        { label: 'Return Costs', value: `$${(results.returnCosts * settings.stock).toFixed(2)}` },
        ...(settings.serviceType === 'with'
          ? [
              {
                label: 'Call Center Fees',
                value: `$${((results.callCenterFees?.delivered || 0) * settings.stock).toFixed(2)}`,
              },
            ]
          : []),
        {
          label: 'COD Fees',
          value: `$${(results.totalSales * (results.codFee / 100)).toFixed(2)}`,
        },
        { label: 'Monthly Charges', value: `$${results.monthlyCharges.toFixed(2)}` },
        { label: 'Total Costs', value: `$${results.totalCosts.toFixed(2)}` },
      ],
    },
  };

  return (
    <div className="space-y-4">
      {Object.entries(sections).map(([key, section]) => (
        <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <section.icon size={24} className={`text-${section.color}-600`} />
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>

            {/* Formula Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Formula</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800">
                  {section.formula}
                </pre>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Breakdown</h4>
              <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                {section.details.map((detail, index) => (
                  <div key={index} className="flex justify-between p-3">
                    <span className="text-gray-600">{detail.label}</span>
                    <span className="font-medium text-gray-900">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
