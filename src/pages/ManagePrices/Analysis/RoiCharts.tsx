import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLanguageStore } from '../../../store/languageStore';
import { NORTH_AFRICA_COUNTRIES } from '@/services/codNetwork';
import { useMemo } from 'react';

interface ROIChartsProps {
  revenueData: {
    name: string;
    value: number;
    color: string;
  }[];
  expensesData: {
    name: string;
    value: number;
    color: string;
  }[];
  profitabilityData: {
    name: string;
    value: number;
    color: string;
  }[];
  breakdownData: {
    name: string;
    value: number;
    color: string;
  }[];
  product: any;
}

export function ROICharts({ breakdownData, product }: ROIChartsProps) {
  const { t } = useLanguageStore();
  const getCurrencyLogo =
    product.category === 'ECOM_LOCAL' ? NORTH_AFRICA_COUNTRIES[product?.country]?.currency : '';

  const checkEcom = useMemo(() => {
    return product.category === 'ECOM_LOCAL';
  }, [product]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Cost Breakdown Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-lg col-span-2">
        <h3 className="text-lg font-semibold mb-4">{t('Cost Breakdown')}</h3>
        <div className="h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value, percent }) =>
                  `${name}: ${!checkEcom ? '$' : ''}${Math.round(value).toLocaleString()} ${
                    checkEcom ? getCurrencyLogo : ''
                  } (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
              >
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `${!checkEcom ? '$' : ''} ${Math.round(value).toLocaleString()} ${
                    checkEcom ? getCurrencyLogo : ''
                  }`
                }
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {breakdownData.map(item => (
            <div
              key={item.name}
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: item.color }}>
                  {item.name}
                </div>
                <div className="text-xs text-gray-600">
                  {!checkEcom && '$'} {Math.round(item.value).toLocaleString()}{' '}
                  {checkEcom && getCurrencyLogo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
