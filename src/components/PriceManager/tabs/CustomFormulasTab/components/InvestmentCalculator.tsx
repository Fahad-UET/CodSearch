import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, Package2 } from 'lucide-react';

interface InvestmentCalculatorProps {
  stock: number;
  sourcingPrice: number;
  onCalculate: (investment: number) => void;
}

export function InvestmentCalculator({ stock, sourcingPrice, onCalculate }: InvestmentCalculatorProps) {
  const [serviceParticipation, setServiceParticipation] = useState(0);
  const [investment, setInvestment] = useState(0);

  useEffect(() => {
    const totalInvestment = stock * sourcingPrice;
    const serviceAmount = (totalInvestment * serviceParticipation) / 100;
    const personalInvestment = totalInvestment - serviceAmount;
    setInvestment(personalInvestment);
    onCalculate(personalInvestment);
  }, [stock, sourcingPrice, serviceParticipation]);

  return (
    <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Calculator size={24} className="text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Investment Share Calculator</h3>
      </div>

      <div className="space-y-6">
        {/* Stock and Sourcing Price Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Package2 size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Stock</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{stock}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">Sourcing Price</span>
            </div>
            <p className="text-2xl font-bold text-green-900">${sourcingPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Service Participation Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Company Participation
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              value={serviceParticipation}
              onChange={(e) => setServiceParticipation(Number(e.target.value))}
              className="w-full pl-10 pr-12 py-2 rounded-lg border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
              placeholder="Enter participation percentage"
            />
            <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
            <h4 className="text-sm font-medium text-purple-100 mb-2">Total Investment Required</h4>
            <p className="text-3xl font-bold">${(stock * sourcingPrice).toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6 text-white">
            <h4 className="text-sm font-medium text-green-100 mb-2">Service Company Share</h4>
            <p className="text-3xl font-bold">
              ${((stock * sourcingPrice * serviceParticipation) / 100).toFixed(2)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
            <h4 className="text-sm font-medium text-blue-100 mb-2">Your Investment Share</h4>
            <p className="text-3xl font-bold">${investment.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}