import React from 'react';
import { Users, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
import { MetricCard } from './MetricCard';

interface SalesPriceMetricsProps {
  requiredLeads: number;
  salePrice: number;
  sourcingPrice: number;
  profitPerProduct: number;
}

export function SalesPriceMetrics({
  requiredLeads,
  salePrice,
  sourcingPrice,
  profitPerProduct
}: SalesPriceMetricsProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Price Analysis</h3>
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Required Leads"
          value={requiredLeads}
          icon={<Users />}
          format="number"
          color="blue"
        />
        
        <MetricCard
          title="Sale Price"
          value={salePrice}
          icon={<DollarSign />}
          format="currency"
          color="green"
        />
        
        <MetricCard
          title="Sourcing Price"
          value={sourcingPrice}
          icon={<ShoppingBag />}
          format="currency"
          color="purple"
        />
        
        <MetricCard
          title="Profit Per Product"
          value={profitPerProduct}
          icon={<TrendingUp />}
          format="currency"
          color="emerald"
        />
      </div>
    </div>
  );
}