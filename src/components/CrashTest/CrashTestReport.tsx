import React from 'react';
import { Download, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Product } from '../../types';

interface CrashTestReportProps {
  product: Product;
  testData: any;
  onClose: () => void;
}

export function CrashTestReport({ product, testData, onClose }: CrashTestReportProps) {
  const calculateMetrics = () => {
    const profitMargin = ((testData.salePrice - testData.purchasePrice) / testData.salePrice) * 100;
    
    let conversionRate = 0;
    let costPerAcquisition = 0;
    let roi = 0;

    if (testData.hasAdTest) {
      conversionRate = (testData.results.sales / testData.results.leads) * 100;
      costPerAcquisition = testData.adBudget / testData.results.sales;
      roi = ((testData.salePrice * testData.results.sales - testData.adBudget) / testData.adBudget) * 100;
    }

    return {
      profitMargin,
      conversionRate,
      costPerAcquisition,
      roi
    };
  };

  const metrics = calculateMetrics();

  const handleDownload = () => {
    const report = {
      product: {
        title: product.title,
        purchasePrice: testData.purchasePrice,
        salePrice: testData.salePrice
      },
      service: {
        provider: testData.serviceProvider,
        country: testData.country,
        productType: testData.productType,
        hasCallCenter: testData.hasCallCenter
      },
      adTest: testData.hasAdTest ? {
        duration: testData.testDuration,
        budget: testData.adBudget,
        results: testData.results,
        metrics: testData.metrics
      } : null,
      analysis: metrics
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crash-test-report-${product.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Crash Test Report</h3>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100"
        >
          <Download size={16} />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-purple-200" />
            <h4 className="font-medium">Profit Margin</h4>
          </div>
          <p className="text-3xl font-bold">{metrics.profitMargin.toFixed(1)}%</p>
        </div>

        {testData.hasAdTest && (
          <>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-green-200" />
                <h4 className="font-medium">Conversion Rate</h4>
              </div>
              <p className="text-3xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={20} className="text-blue-200" />
                <h4 className="font-medium">Cost Per Acquisition</h4>
              </div>
              <p className="text-3xl font-bold">${metrics.costPerAcquisition.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-amber-200" />
                <h4 className="font-medium">ROI</h4>
              </div>
              <p className="text-3xl font-bold">{metrics.roi.toFixed(1)}%</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={onClose}
          className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Close Report
        </button>
      </div>
    </div>
  );
}