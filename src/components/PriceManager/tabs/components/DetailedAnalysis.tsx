import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Package } from 'lucide-react';
import { CountrySettingsData } from '../../../../services/serviceProviders/types';

interface DetailedAnalysisProps {
  results: {
    totalSales: number;
    grossProfit: number;
    profitPerUnit: number;
    totalCosts: number;
    shippingCosts: number;
    returnCosts: number;
    callCenterFees: { lead: number; confirmation: number; delivered: number; } | null;
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

export function DetailedAnalysis({ results, settings, salePrice, sourcingPrice, countrySettings }: DetailedAnalysisProps) {
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const sections = {
    revenue: {
      title: 'Revenue Analysis',
      icon: DollarSign,
      color: 'purple',
      formula: `Total Sales = Sale Price × Stock\n${salePrice} × ${settings.stock} = ${formatCurrency(results.totalSales)}`,
      details: [
        { label: 'Sale Price', value: formatCurrency(salePrice) },
        { label: 'Stock', value: settings.stock },
        { label: 'Total Sales', value: formatCurrency(results.totalSales) }
      ]
    },
    grossProfit: {
      title: 'Gross Profit Analysis',
      icon: TrendingUp,
      color: 'green',
      formula: `Gross Profit = (Sale Price - Sourcing Price) × Stock\n(${salePrice} - ${sourcingPrice}) × ${settings.stock} = ${formatCurrency(results.grossProfit)}`,
      details: [
        { label: 'Sale Price', value: formatCurrency(salePrice) },
        { label: 'Sourcing Price', value: formatCurrency(sourcingPrice) },
        { label: 'Profit per Unit', value: formatCurrency(results.profitPerUnit) },
        { label: 'Stock', value: settings.stock },
        { label: 'Total Gross Profit', value: formatCurrency(results.grossProfit) }
      ]
    },
    profitPerUnit: {
      title: 'Unit Economics',
      icon: Package,
      color: 'blue',
      formula: `Profit per Unit = Sale Price - (Sourcing Price + Shipping + COD Fee)\n${salePrice} - (${sourcingPrice} + ${results.shippingCosts} + ${results.codFee}%) = ${formatCurrency(results.profitPerUnit)}`,
      details: [
        { label: 'Sale Price', value: formatCurrency(salePrice) },
        { label: 'Sourcing Cost', value: formatCurrency(sourcingPrice) },
        { label: 'Shipping Cost', value: formatCurrency(results.shippingCosts) },
        { label: 'COD Fee', value: `${results.codFee}%` },
        { label: 'Net Profit per Unit', value: formatCurrency(results.profitPerUnit) }
      ]
    },
    totalCosts: {
      title: 'Total Costs Breakdown',
      icon: BarChart2,
      color: 'red',
      formula: `Total Costs = (Sourcing + Shipping + Returns + Call Center + COD) × Stock\n(${sourcingPrice} + ${results.shippingCosts} + ${results.returnCosts} + ${results.callCenterFees?.delivered || 0} + ${results.codFee}%) × ${settings.stock} = ${formatCurrency(results.totalCosts)}`,
      details: [
        { label: 'Sourcing Costs', value: formatCurrency(sourcingPrice * settings.stock) },
        { label: 'Shipping Costs', value: formatCurrency(results.shippingCosts * settings.stock) },
        { label: 'Return Costs', value: formatCurrency(results.returnCosts * settings.stock) },
        ...(settings.serviceType === 'with' ? [
          { label: 'Call Center Fees', value: formatCurrency((results.callCenterFees?.delivered || 0) * settings.stock) }
        ] : []),
        { label: 'COD Fees', value: formatCurrency(results.totalSales * (results.codFee / 100)) },
        { label: 'Monthly Charges', value: formatCurrency(results.monthlyCharges) },
        { label: 'Total Costs', value: formatCurrency(results.totalCosts) }
      ]
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(sections).map(([key, section]) => (
        <div
          key={key}
          className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all`}
        >
          <button
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <section.icon className={`text-${section.color}-600`} size={24} />
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {key === 'revenue' && formatCurrency(results.totalSales)}
              {key === 'grossProfit' && formatCurrency(results.grossProfit)}
              {key === 'profitPerUnit' && formatCurrency(results.profitPerUnit)}
              {key === 'totalCosts' && formatCurrency(results.totalCosts)}
            </div>
          </button>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Formula</h4>
                <pre className="bg-white p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                  {section.formula}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Breakdown</h4>
                <div className="bg-white rounded-lg divide-y divide-gray-200">
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
        </div>
      ))}
    </div>
  );
}