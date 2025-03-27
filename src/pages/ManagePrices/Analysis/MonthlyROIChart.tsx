import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ProfitMetrics } from './types/chart';
import { calculateMonthlyData } from './utils/monthlyCalculations';
import { useLanguageStore } from '../../../store/languageStore';
import { NORTH_AFRICA_COUNTRIES } from '@/services/codNetwork';

interface MonthlyROIChartProps {
  metrics?: ProfitMetrics;
  product: any;
}

export function MonthlyROIChart({ metrics, product }: MonthlyROIChartProps) {
  const { t } = useLanguageStore();
  const [cplChangeRate, setCplChangeRate] = useState<number>(0);
  const [deliveryRateChange, setDeliveryRateChange] = useState<number>(0);
  const [confirmationRateChange, setConfirmationRateChange] = useState<number>(0);
  const [stockRateChange, setStockRateChange] = useState<number>(0);
  const [priceRateChange, setPriceRateChange] = useState<number>(0);
  const [cplVariationType, setCplVariationType] = useState<'increase' | 'decrease'>('increase');
  const [deliveryVariationType, setDeliveryVariationType] = useState<'increase' | 'decrease'>(
    'increase'
  );
  const [confirmationVariationType, setConfirmationVariationType] = useState<
    'increase' | 'decrease'
  >('increase');
  const [stockVariationType, setStockVariationType] = useState<'increase' | 'decrease'>('increase');
  const [priceVariationType, setPriceVariationType] = useState<'increase' | 'decrease'>('increase');

  const monthlyData = calculateMonthlyData(
    // metrics,
    product,
    cplVariationType === 'increase' ? cplChangeRate : -cplChangeRate,
    deliveryVariationType === 'increase' ? deliveryRateChange : -deliveryRateChange,
    confirmationVariationType === 'increase' ? confirmationRateChange : -confirmationRateChange,
    stockVariationType === 'increase' ? stockRateChange : -stockRateChange,
    priceVariationType === 'increase' ? priceRateChange : -priceRateChange
  );

  const getCurrencyLogo =
    product.category === 'ECOM_LOCAL' ? NORTH_AFRICA_COUNTRIES[product?.country]?.currency : '';

  const checkEcom = useMemo(() => {
    return product.category === 'ECOM_LOCAL';
  }, [product]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-2xl border border-gray-100">
      <div className="flex flex-col items-start justify-between gap-4 mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Monthly Evolution
          <span className="block text-sm font-normal text-gray-600 mt-1">
            100 products per period | X = Month / week / 15 days
          </span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <div className="flex items-center gap-2 bg-violet-50 p-2 rounded-lg">
            <label className="text-sm font-medium text-violet-700">Monthly CPL Variation:</label>
            <select
              value={cplVariationType}
              onChange={e => setCplVariationType(e.target.value as 'increase' | 'decrease')}
              className="px-2 py-1 rounded border border-violet-200 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            >
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>
            <input
              type="number"
              value={cplChangeRate}
              onChange={e => setCplChangeRate(Number(e.target.value))}
              className="w-20 px-2 py-1 text-right rounded border border-violet-200 bg-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              min="0"
              max="100"
              step="1"
            />
            <span className="text-violet-600">%</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
            <label className="text-sm font-medium text-emerald-700">
              Monthly Delivery Rate Variation:
            </label>
            <select
              value={deliveryVariationType}
              onChange={e => setDeliveryVariationType(e.target.value as 'increase' | 'decrease')}
              className="px-2 py-1 rounded border border-emerald-200 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>
            <input
              type="number"
              value={deliveryRateChange}
              onChange={e => setDeliveryRateChange(Number(e.target.value))}
              className="w-20 px-2 py-1 text-right rounded border border-emerald-200 bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              min="0"
              max="100"
              step="1"
            />
            <span className="text-emerald-600">%</span>
          </div>

          <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-lg">
            <label className="text-sm font-medium text-blue-700">
              Monthly Confirmation Rate Variation:
            </label>
            <select
              value={confirmationVariationType}
              onChange={e =>
                setConfirmationVariationType(e.target.value as 'increase' | 'decrease')
              }
              className="px-2 py-1 rounded border border-blue-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>
            <input
              type="number"
              value={confirmationRateChange}
              onChange={e => setConfirmationRateChange(Number(e.target.value))}
              className="w-20 px-2 py-1 text-right rounded border border-blue-200 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              min="0"
              max="100"
              step="1"
            />
            <span className="text-blue-600">%</span>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-lg">
            <label className="text-sm font-medium text-amber-700">Monthly Stock Variation:</label>
            <select
              value={stockVariationType}
              onChange={e => setStockVariationType(e.target.value as 'increase' | 'decrease')}
              className="px-2 py-1 rounded border border-amber-200 bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            >
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>
            <input
              type="number"
              value={stockRateChange}
              onChange={e => setStockRateChange(Number(e.target.value))}
              className="w-20 px-2 py-1 text-right rounded border border-amber-200 bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              min="0"
              max="100"
              step="1"
            />
            <span className="text-amber-600">%</span>
          </div>

          <div className="flex items-center gap-2 bg-pink-50 p-2 rounded-lg">
            <label className="text-sm font-medium text-pink-700">Monthly Price Variation:</label>
            <select
              value={priceVariationType}
              onChange={e => setPriceVariationType(e.target.value as 'increase' | 'decrease')}
              className="px-2 py-1 rounded border border-pink-200 bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            >
              <option value="increase">Increase</option>
              <option value="decrease">Decrease</option>
            </select>
            <input
              type="number"
              value={priceRateChange}
              onChange={e => setPriceRateChange(Number(e.target.value))}
              className="w-20 px-2 py-1 text-right rounded border border-pink-200 bg-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
              min="0"
              max="100"
              step="1"
            />
            <span className="text-pink-600">%</span>
          </div>
        </div>
      </div>
      <div className="relative h-[500px] p-6 rounded-xl border-2 border-gray-200">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280' }} axisLine={{ stroke: '#d1d5db' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '1rem',
              }}
              formatter={(value: number, name: string, dataKey: any) => {
                const formattedValue = `${!checkEcom ? '$' : ''}${Math.round(
                  value
                ).toLocaleString()} ${checkEcom ? getCurrencyLogo : ''}`;
                if (dataKey?.fill === 'url(#profitGradient)') {
                  return [
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        Profit {formattedValue}
                      </div>
                    </div>,
                    name,
                  ];
                }
                return [formattedValue, name];
              }}
              labelFormatter={(label, payload) => {
                if (!payload?.length) return label;
                const data = payload?.[0]?.payload;
                return `${label} - CPL: ${!checkEcom ? '$' : ''}${data?.cpl} ${
                  checkEcom ? getCurrencyLogo : ''
                } | Delivery: ${Math.round(data?.deliveryRate)}% | Confirmation: ${Math.round(
                  data?.confirmationRate
                )}% | Stock: ${Math.round(data?.stock)} | Price: ${
                  !checkEcom ? '$' : ''
                }${data?.price?.toFixed(2)} ${checkEcom ? getCurrencyLogo : ''}`;
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb',
              }}
            />
            <Bar
              dataKey="advertisingCosts"
              name={t('Advertising Costs')}
              stackId="a"
              fill="#8b5cf6"
              stroke="#ef4444"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
              label={{
                position: 'top',
                content: (props: any) => {
                  const { x, y, width, index } = props;
                  const data = monthlyData[index];
                  return (
                    <g>
                      <text
                        x={x + width / 2}
                        y={y - 10}
                        textAnchor="middle"
                        fill="#6b7280"
                        fontSize="10"
                      >
                        ${data?.cpl || 0}
                      </text>
                    </g>
                  );
                },
              }}
            />
            <Bar
              dataKey="stockCosts"
              name={t('Stock Costs')}
              stackId="a"
              fill="#ec4899"
              stroke="#ef4444"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="callCenterCosts"
              name={t('Call Center Costs')}
              stackId="a"
              fill="#9333ea"
              stroke="#ef4444"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="deliveryCosts"
              name={t('Delivery Costs')}
              stackId="a"
              fill="#f43f5e"
              stroke="#ef4444"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="returnCosts"
              name={t('Return Costs')}
              stackId="a"
              fill="#f59e0b"
              stroke="#ef4444"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="codFees"
              name={t('Cod Fees')}
              stackId="a"
              fill="#6366f1"
              stroke="#ef4444"
              strokeWidth={2}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="profit"
              name={t('Profit')}
              stackId="a"
              fill="url(#profitGradient)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
