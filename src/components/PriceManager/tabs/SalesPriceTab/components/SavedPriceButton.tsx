import React from 'react';
import { DollarSign, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface SavedPriceButtonProps {
  price: {
    salePrice: number;
    settings: {
      confirmationRate: number;
      deliveryRate: number;
      cpl: number;
      stock: number;
      productType: string;
      serviceType: string;
    };
    metrics: {
      totalProfit: number;
      profitMargin: number;
      profitPerUnit?: number;
      totalSales?: number;
      totalCosts?: number;
    };
    createdAt: Date;
  };
  onClick: () => void;
}

export function SavedPriceButton({ price, onClick }: SavedPriceButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-lg hover:shadow-lg transition-all w-40 text-white"
    >
      <div className="flex items-center gap-2">
        <DollarSign size={20} className="text-white/80" />
        <span className="font-bold text-white text-xl">${price.salePrice.toFixed(2)}</span>
      </div>
      <div className="text-xs text-white/70 mt-2 flex items-center gap-1">
        <Clock size={12} />
        {format(new Date(price.createdAt), 'MMM d, HH:mm')}
      </div>
      
      {/* Hover Details */}
      <div className="absolute left-full top-0 ml-2 w-72 p-4 bg-white rounded-lg border border-purple-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} />
            {format(new Date(price.createdAt), 'MMM d, yyyy HH:mm')}
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-purple-600 mb-2">Settings</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Stock:</div>
                <div className="font-medium">{price.settings.stock}</div>
                <div className="text-gray-600">CPL:</div>
                <div className="font-medium">${price.settings.cpl}</div>
                <div className="text-gray-600">Confirmation:</div>
                <div className="font-medium">{price.settings.confirmationRate}%</div>
                <div className="text-gray-600">Delivery:</div>
                <div className="font-medium">{price.settings.deliveryRate}%</div>
                <div className="text-gray-600">Product Type:</div>
                <div className="font-medium capitalize">{price.settings.productType}</div>
                <div className="text-gray-600">Service:</div>
                <div className="font-medium capitalize">{price.settings.serviceType}</div>
              </div>
            </div>
            
            <div>
              <div className="text-xs font-medium text-green-600 mb-2">Results</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Total Profit:</div>
                <div className="font-medium">${price.metrics.totalProfit.toFixed(2)}</div>
                <div className="text-gray-600">Profit Margin:</div>
                <div className="font-medium">{price.metrics.profitMargin.toFixed(1)}%</div>
                <div className="text-gray-600">Per Unit:</div>
                <div className="font-medium">${price.metrics.profitPerUnit.toFixed(2)}</div>
                <div className="text-gray-600">Total Sales:</div>
                <div className="font-medium">${price.metrics.totalSales.toFixed(2)}</div>
                <div className="text-gray-600">Total Costs:</div>
                <div className="font-medium">${price.metrics.totalCosts.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}