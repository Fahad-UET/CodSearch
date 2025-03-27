import React from 'react';
import { DollarSign, TrendingUp, BarChart2, Package2, Users, Truck } from 'lucide-react';

interface VariablesSectionProps {
  product: {
    purchasePrice?: number;
    salePrice?: number;
    metrics?: {
      cpl?: number;
      ctr?: number;
      confirmationRate?: number;
      deliveryRate?: number;
    };
  };
}

export function VariablesSection({ product }: VariablesSectionProps) {
  // Calculate profit margin if both prices exist
  const profitMargin = product.purchasePrice && product.salePrice
    ? ((product.salePrice - product.purchasePrice) / product.salePrice) * 100
    : undefined;

  return (
    <div className="flex flex-wrap gap-1.5">
      {/* Price Variables */}
      {product.purchasePrice !== undefined && (
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
          <DollarSign size={12} />
          <span>Buy: ${product.purchasePrice.toFixed(2)}</span>
        </div>
      )}
      
      {product.salePrice !== undefined && (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs">
          <DollarSign size={12} />
          <span>Sell: ${product.salePrice.toFixed(2)}</span>
        </div>
      )}

      {profitMargin !== undefined && (
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
          <TrendingUp size={12} />
          <span>Margin: {profitMargin.toFixed(1)}%</span>
        </div>
      )}

      {/* Performance Metrics */}
      {product.metrics?.cpl !== undefined && (
        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs">
          <Users size={12} />
          <span>CPL: ${product.metrics.cpl.toFixed(2)}</span>
        </div>
      )}

      {product.metrics?.ctr !== undefined && (
        <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs">
          <BarChart2 size={12} />
          <span>CTR: {product.metrics.ctr.toFixed(1)}%</span>
        </div>
      )}

      {/* Delivery Metrics */}
      {product.metrics?.confirmationRate !== undefined && (
        <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs">
          <Package2 size={12} />
          <span>Conf: {product.metrics.confirmationRate.toFixed(1)}%</span>
        </div>
      )}

      {product.metrics?.deliveryRate !== undefined && (
        <div className="flex items-center gap-1 px-2 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs">
          <Truck size={12} />
          <span>Del: {product.metrics.deliveryRate.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}