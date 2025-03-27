import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import { ChartDataPoint } from '../types';
import { NORTH_AFRICA_COUNTRIES } from '@/services/codNetwork';

interface ProfitChartProps {
  data: ChartDataPoint[];
  productPrice: any;
  product: any;
}

export function ProfitChart({ data, productPrice, product }: ProfitChartProps) {
  const formatValue = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return 'N/A';
    return value ? Math.round(Number(value)) : 0;
  };

  const getCurrencyLogo =
    product.category === 'ECOM_LOCAL' ? NORTH_AFRICA_COUNTRIES[product?.country]?.currency : '';

  const checkEcom = useMemo(() => {
    return product.category === 'ECOM_LOCAL';
  }, [product]);

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

          <XAxis dataKey="day" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />

          <YAxis yAxisId="left" label={{ value: 'Profit', angle: -90, position: 'insideLeft' }} />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Break-even Values', angle: 90, position: 'insideRight' }}
          />

          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <Area
            yAxisId="left"
            type="monotone"
            dataKey={d => (d.profit >= 0 ? d.profit : null)}
            stroke="#22c55e"
            fill="url(#profitGradient)"
            fillOpacity={1}
            isAnimationActive={false}
            strokeWidth={2}
          />

          <Area
            yAxisId="left"
            type="monotone"
            dataKey={d => (d.profit < 0 ? d.profit : null)}
            stroke="#ef4444"
            fill="url(#lossGradient)"
            fillOpacity={1}
            isAnimationActive={false}
            strokeWidth={2}
          />

          <Line
            yAxisId="right"
            type="stepAfter"
            dataKey="breakEvenStock"
            stroke="#7c3aed"
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />

          <Line
            yAxisId="right"
            type="stepAfter"
            dataKey="breakEvenPrice"
            stroke="#0891b2"
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />

          <Line
            yAxisId="right"
            type="stepAfter"
            dataKey="breakEvenCPL"
            stroke="#1e40af"
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
          />

          <ReferenceLine y={0} yAxisId="left" stroke="#6b7280" strokeDasharray="3 3" />

          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload || !payload[0]) return null;

              const data = payload?.[0]?.payload as ChartDataPoint;

              return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                  <div className="font-medium text-gray-900 mb-2">Day {label}</div>

                  <div className="space-y-1 mb-4">
                    <div
                      className={`text-sm font-medium ${
                        data?.profit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      Profit: : {!checkEcom ? '$' : ''}
                      {formatValue(data?.profit)} {checkEcom ? getCurrencyLogo : ''}
                    </div>
                    <div className="text-sm">Available Stock: {data?.availableStock} units</div>
                    <div className="text-sm">
                      Selling Price: {!checkEcom ? '$' : ''}
                      {formatValue(data?.sellingPrice)} {checkEcom ? getCurrencyLogo : ''}{' '}
                    </div>
                    <div className="text-sm">
                      CPL Cost: {!checkEcom ? '$' : ''}
                      {formatValue(data?.cpl)} {checkEcom ? getCurrencyLogo : ''}{' '}
                    </div>
                    <div className="text-sm">
                      Confirmation Rate: {formatValue(data?.confirmationRate)}%
                    </div>
                    <div className="text-sm">Delivery Rate: {formatValue(data?.deliveryRate)}%</div>
                    <div className="text-sm">Expected Leads: {Math.round(data?.expectedLeads)}</div>
                    {/* <div className="text-sm">
                      Call Center Cost: ${formatValue(data?.callCenterCost)}
                    </div> */}
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="font-medium text-gray-900 mb-1">Break-even Points</div>
                    <div className="space-y-1 text-sm">
                      <div className="text-purple-600">
                        Break-even Stock :{' '}
                        {data?.sellingPrice
                          ? Math.round(
                              (productPrice?.advertisement?.totalAdvertisementCost +
                                productPrice?.companyServicesFee?.totalCost) /
                                data?.sellingPrice
                            )
                          : 0}{' '}
                        units
                      </div>
                      <div className="text-cyan-600">
                        Break-even Price: {!checkEcom ? '$' : ''}
                        {formatValue(
                          (productPrice?.advertisement?.totalAdvertisementCost +
                            productPrice?.companyServicesFee?.totalCost) /
                            data?.availableStock
                        )}{' '}
                        {checkEcom ? getCurrencyLogo : ''}
                      </div>
                      <div className="text-blue-600">
                        Break-even CPL : {!checkEcom ? '$' : ''}{' '}
                        {formatValue(
                          (productPrice?.netProfit +
                            productPrice?.advertisement?.totalAdvertisementCost) /
                            productPrice?.advertisement?.requiredLeads
                        )}{' '}
                        {checkEcom ? getCurrencyLogo : ''}
                        {/* {formatValue((data?.profit + data?.advertisingCost) / data?.expectedLeads)} */}
                      </div>
                      {/* <div className="text-red-600">
                        Confirmation Rate: {formatValue(data?.breakEvenConfirmationRate)}%
                      </div> */}
                      <div className="text-green-600">
                        Delivery Rate:{' '}
                        {(
                          (productPrice?.netProfit +
                            productPrice?.advertisement?.totalAdvertisementCost) /
                          (productPrice?.salePrice *
                            (productPrice?.confirmationRate / 100) *
                            productPrice?.advertisement?.requiredLeads)
                        ).toFixed(2)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          />

          <Legend
            verticalAlign="top"
            height={36}
            formatter={value => {
              const labels = {
                profit: 'Profit',
                breakEvenStock: 'Break-even Stock',
                breakEvenPrice: 'Break-even Price',
                breakEvenCPL: 'Break-even CPL',
              };
              return <span className="text-sm font-medium">{labels[value] || value}</span>;
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
