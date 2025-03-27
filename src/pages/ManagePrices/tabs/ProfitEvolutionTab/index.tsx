import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { ProfitChart } from './components/ProfitChart';
import { ProfitTrends } from './components/ProfitTrends';
import { ProfitMetrics } from './components/ProfitMetrics';
import { RoiChart } from './components/RoiChart';

export function ProfitEvolutionTab() {
  const [data, setData] = useState([]);
  const [roiData, setRoiData] = useState([]);
  
  useEffect(() => {
    // Fetch profit evolution data
    // fetchProfitData().then(setData);
    // fetchRoiData().then(setRoiData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-purple-200" />
            <h3 className="font-medium">Current Profit</h3>
          </div>
          <p className="text-3xl font-bold">$0.00</p>
          <div className="flex items-center gap-1 mt-2 text-sm">
            <ChevronUp className="text-green-300" />
            <span className="text-green-300">+0.0%</span>
            <span className="text-purple-200 ml-1">vs previous</span>
          </div>
        </div>

        <ProfitMetrics profitHistory={data} />
        <ProfitTrends profitHistory={data} />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Profit Evolution</h2>
          </div>
        </div>
        
        <div className="h-[400px]">
          <ProfitChart profitHistory={data} />
        </div>
      </div>

      <RoiChart data={roiData} />
    </div>
  );
}