import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ROICharts } from './RoiCharts';
import { MonthlyROIChart } from './MonthlyROIChart';
import { FunnelChart } from './FunnelChart';
import {
  TrendingUp,
  DollarSign,
  Package,
  PieChart,
  Calculator,
  Briefcase,
  Target,
} from 'lucide-react';
import { ProfitMetrics } from './types/chart';

import { useLanguageStore } from '../../../store/languageStore';

interface ROICalculationsViewProps {
  metrics: ProfitMetrics;
  product: any;
}

export function ROICalculationsView({ metrics, product }: ROICalculationsViewProps) {
  const { t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'roi' | 'funnel' | 'monthly' | 'breakdown'>('roi');
  const [serviceCompanyShare, setServiceCompanyShare] = useState(30);

  const stockInvestment = product?.price?.sourcingPrice * product?.price?.stock;
  const serviceCompanyInvestment = stockInvestment * (serviceCompanyShare / 100);
  const personalInvestment = stockInvestment - serviceCompanyInvestment;

  const totalRevenue = product?.price?.salePrice * product?.price?.stock;

  const personalCapitalROI = useMemo(() => {
    const divisible = (product?.price?.advertisingCost ?? 0) + personalInvestment;
    const divided = (product?.price?.totalProfit ?? 0) / divisible;
    return divided * 100;
  }, [product, serviceCompanyInvestment]);

  const advertisingCosts = product?.price?.advertisement?.totalAdvertisementCost;
  const stockCosts = product?.price?.companyServicesFee?.totalProductCost;
  const callCenterCosts = product?.price?.companyServicesFee?.totalCallCenterFees;
  const deliveryCosts = product?.price?.companyServicesFee?.shippingCost;
  const returnCosts = product?.price?.companyServicesFee?.totalReturnCost;
  const codFees = product?.price?.companyServicesFee?.totalCodFees;
  const totalReturnCost = product?.price?.companyServicesFee?.totalReturnCost;
  const totalProductCost = product?.price?.companyServicesFee?.totalProductCost;

  const shippingCost = Math.round(product?.price?.companyServicesFee?.shippingCost || 0);
  const stock = product?.price?.stock || 1;

  // const totalShippingPerCost = stock > 0 ? (totalReturnCost + shippingCost) / stock : 0;
  const totalShippingPerCost = (totalReturnCost || 0) + (shippingCost || 0);
  const totalShippingPerCostPerdelivered = totalShippingPerCost / stock;

  const totalExpenses =
    (product?.price?.advertisement?.totalAdvertisementCost || 0) +
    (product?.price?.companyServicesFee?.totalProductCost || 0) +
    (product?.price?.companyServicesFee?.totalCallCenterFees || 0) +
    totalShippingPerCost +
    (product?.price?.companyServicesFee?.totalCodFees || 0);

  const totalProfit = totalRevenue - totalExpenses;

  const calculatedValues = useMemo(() => {
    if (!product?.price?.stock || product?.price?.stock <= 0) return 0;

    const stock = product.price.stock;

    const monthlyCharges = product.price.monthlyProductCharges;

    const advertising = advertisingCosts ? Number((advertisingCosts / stock).toFixed(2)) : 0;

    const cod = codFees ? Number((codFees / stock).toFixed(2)) : 0;

    const callCenter = callCenterCosts ? Number((callCenterCosts / stock).toFixed(2)) : 0;

    const delivery = deliveryCosts ? Number((deliveryCosts / stock).toFixed(2)) : 0;
    return monthlyCharges + advertising + cod + callCenter + delivery;
  }, [product, advertisingCosts, codFees, callCenterCosts, deliveryCosts]);

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'roi', label: 'Return on Investment (ROI)' },
          { id: 'funnel', label: 'Conversion Funnel' },
          { id: 'monthly', label: 'Monthly ROI Evolution' },
          { id: 'breakdown', label: 'Cost Breakdown' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-violet-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6">
        {/* ROI Tab Content */}
        {activeTab === 'roi' && (
          <div className="space-y-6">
            {/* Row 1: Stock Investment and Total Expenses */}
            <div
              className={`grid grid-cols-1 md:${
                product?.category === 'PRODUCT_AFFILIATE' || product?.category === 'PRODUCT_DROP'
                  ? 'grid-cols-1'
                  : 'grid-cols-2'
              } gap-6`}
            >
              {/* Investment Breakdown */}
              {product?.category !== 'PRODUCT_AFFILIATE' &&
                product?.category !== 'PRODUCT_DROP' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-50 p-6 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-semibold text-purple-900">
                        {t('Stock Investment')}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-purple-600 ">
                        {t('Service company investment share')}
                      </p>
                      <div className="flex-1 text-right">
                        <input
                          type="number"
                          value={serviceCompanyShare}
                          onChange={e => {
                            const value = Math.min(100, Math.max(0, Number(e.target.value)));
                            setServiceCompanyShare(value);
                          }}
                          className="w-20 px-2 py-1 text-right rounded border border-purple-200 bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                          min="0"
                          max="100"
                          step="1"
                        />
                        <span className="ml-1 text-purple-600">%</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="flex justify-between items-center text-sm text-purple-600 border-b border-purple-100 pb-2">
                        <span>{t('Total Stock Investment')}</span>
                        <span className="font-semibold">
                          ${Math.round(stockInvestment || 0).toLocaleString()}
                        </span>
                      </p>
                      <p className="flex justify-between items-center text-sm text-purple-600">
                        <span>{t('Service company stake')}</span>
                        <span className="font-semibold">
                          ${Math.round(serviceCompanyInvestment || 0).toLocaleString()}
                        </span>
                      </p>
                      <p className="flex justify-between items-center text-sm text-purple-600">
                        <span>{t('Personal Investment')}</span>
                        <span className="font-semibold">
                          ${Math.round(personalInvestment || 0).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
              {/* ROAS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">{t('Total Expenses')}</h3>
                </div>
                <div
                  className={`grid ${
                    product?.category === 'PRODUCT_AFFILIATE' ? 'grid-cols-1' : 'grid-cols-2'
                  } gap-4`}
                >
                  <div className="space-y-2">
                    <p className="flex justify-between text-sm text-red-600">
                      <span>{t('Advertising Costs')}:</span>
                      <span className="font-semibold">
                        $
                        {Math.round(
                          product?.price?.advertisement?.totalAdvertisementCost || 0
                        ).toLocaleString()}
                      </span>
                    </p>
                    {product?.category != 'PRODUCT_AFFILIATE' && (
                      <p className="flex justify-between text-sm text-red-600">
                        <span>{t('Stock Costs')}:</span>
                        <span className="font-semibold">
                          $
                          {Math.round(
                            product?.price?.companyServicesFee?.totalProductCost || 0
                          ).toLocaleString()}
                        </span>
                      </p>
                    )}
                    {product?.category != 'PRODUCT_AFFILIATE' && (
                      <p className="flex justify-between text-sm text-red-600">
                        <span>{t('Call Center Costs')}:</span>
                        <span className="font-semibold">
                          $
                          {Math.round(
                            product?.price?.companyServicesFee?.totalCallCenterFees || 0
                          ).toLocaleString()}
                        </span>
                      </p>
                    )}
                  </div>

                  {!(product?.category === 'PRODUCT_AFFILIATE') && (
                    <div className="space-y-2">
                      {/* {product?.category != 'PRODUCT_AFFILIATE' && (
                        <p className="flex justify-between text-sm text-red-600">
                          <span>{t('Delivered Shipping Costs')}:</span>
                          <span className="font-semibold">
                            $
                            {Math.round(
                              product?.price?.companyServicesFee?.shippingCost || 0
                            ).toLocaleString()}
                          </span>
                        </p>
                      )}
                      {product?.category != 'PRODUCT_AFFILIATE' && (
                        <p className="flex justify-between text-sm text-red-600">
                          <span>{t('Returned Shipping Costs')}:</span>
                          <span className="font-semibold">
                            $
                            {Math.round(
                              product?.price?.companyServicesFee?.totalReturnCost || 0
                            ).toLocaleString()}
                          </span>
                        </p>
                      )} */}
                      {product?.category != 'PRODUCT_AFFILIATE' && (
                        <p className="flex justify-between text-sm text-red-600">
                          <span>{t('Total Shipping Costs')}:</span>
                          <span className="font-semibold">${totalShippingPerCost || 0}</span>
                        </p>
                      )}
                      {product?.category != 'PRODUCT_AFFILIATE' && (
                        <p className="flex justify-between text-sm text-red-600">
                          <span>{t('COD Fees')}:</span>
                          <span className="font-semibold">
                            {' '}
                            $
                            {Math.round(
                              product?.price?.companyServicesFee?.totalCodFees || 0
                            ).toLocaleString()}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-red-200">
                  <p className="flex justify-between text-lg font-bold text-red-700">
                    <span>{t('Total')}:</span>
                    <span>${Math.round(totalExpenses).toLocaleString()}</span>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Row 2: Revenue, Profit Margin, Personal Capital ROI */}
            <div
              className={`grid grid-cols-1 md:${
                product?.category === 'PRODUCT_AFFILIATE' || product?.category === 'PRODUCT_DROP'
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              } gap-6`}
            >
              {/* Return on Investment */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">
                    {t('Return On Investment')}
                  </h3>
                  <span className="text-sm text-green-600 ml-2">({t('Total Expenses')})</span>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {/* {((totalProfit / totalExpenses) * 100).toFixed(1)}% */}
                  ROI: {product?.price?.roiPercentage || 0}%
                </div>
              </motion.div>

              {/* Profit Margin */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">{t('Profit Margin')}</h3>
                </div>
                {/* <div className="text-3xl font-bold text-green-700">{profitMargin.toFixed(1)}%</div> */}
                <div className="text-3xl font-bold text-green-700">
                  PM: {product?.price?.profitMargin || 0}%
                </div>
              </motion.div>

              {/* Personal Capital ROI */}
              {product?.category !== 'PRODUCT_AFFILIATE' &&
                product?.category !== 'PRODUCT_DROP' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 p-6 rounded-xl shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">
                        {t('Return On Investment Personal')}
                      </h3>
                      <span className="text-sm text-green-600 ml-2">({t(' % Stock + Ads ')})</span>
                    </div>
                    <div className="text-3xl font-bold text-green-700">
                      ROIP: {personalCapitalROI ? personalCapitalROI.toFixed(1) : 0}%
                    </div>
                  </motion.div>
                )}
            </div>

            {/* Row 3: ROI and Profit per Delivered Unit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
              {/* Total Revenue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">{t('Total Revenue')}</h3>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  TR: {`${Math.round(product?.price?.totalRevenue || 0).toLocaleString()} $`}
                </div>
              </motion.div>

              {/* Profit per Delivered Unit */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">
                    {t('Profit Per Delivered')}
                  </h3>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {/* ${Math.round(profitPerUnit).toLocaleString()} */}
                  {`PPD: ${
                    product?.price?.costPerDelivered
                      ? product?.price?.costPerDelivered?.toFixed(1)
                      : 0
                  } $`}
                </div>
              </motion.div>
              {/* total profit*/}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">{t('Total Profit')}</h3>
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {/* ${Math.round(profitPerUnit).toLocaleString()} */}
                  {`TP: ${Math.round(product?.price?.totalProfit) || 0} $`}
                </div>
              </motion.div>
            </div>

            {/* Cost per Delivered Unit Breakdown */}
            {product?.category !== 'PRODUCT_AFFILIATE' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-6 h-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-red-900">
                    Total Cost Per Delivered (without stock)
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="flex justify-between text-sm text-red-600">
                      <span>
                        <span className="font-bold">MCPD</span> - Monthly Charges Per Delivered :
                      </span>
                      <span className="font-semibold">
                        ${product?.price?.monthlyProductCharges}
                      </span>
                    </p>
                    <p className="flex justify-between text-sm text-red-600">
                      <span>
                        <span className="font-bold">CPD</span> - Cost Per Delivered (ads) :
                      </span>
                      <span className="font-semibold">
                        {/* ${(advertisingCosts / stock || 0).toFixed(2)} */}
                        {`${(
                          product?.price?.cpl /
                          (product?.price?.confirmationRate * product?.price?.deliveryRate)
                        ).toFixed(2)}`}
                      </span>
                    </p>
                    <p className="flex justify-between text-sm text-red-600">
                      <span>
                        {' '}
                        <span className="font-bold">FPD</span> - Fees Per Delivered :
                      </span>
                      <span className="font-semibold">${(codFees / stock || 0).toFixed(2)}</span>
                    </p>
                    {/* <p className="flex justify-between text-sm text-red-600">
                    <span>{t('totalProductCost')}:</span>
                    <span className="font-semibold">
                      $
                      {Math.round(totalReturnCost / stock || 0).toLocaleString()}
                    </span>
                  </p> */}
                  </div>
                  <div className="space-y-2">
                    <p className="flex justify-between text-sm text-red-600">
                      <span>
                        <span className="font-bold">CCCPD</span> - Call Center Cost Per Delivered :
                      </span>
                      <span className="font-semibold">
                        ${(callCenterCosts / stock || 0).toFixed(2)}
                      </span>
                    </p>
                    <p className="flex justify-between text-sm text-red-600">
                      <span>
                        <span className="font-bold">TSCPD</span> - Total Shipping Cost Per Delivered
                        :
                      </span>
                      <span className="font-semibold">
                        {/* ${(deliveryCosts / stock || 0).toFixed(2)} */}$
                        {totalShippingPerCostPerdelivered || 0}
                      </span>
                    </p>
                    {/* <p className="flex justify-between text-sm text-red-600">
                      <span>{t('totalProductCost')}:</span>
                      <span className="font-semibold">
                        $
                        {Math.round(
                          totalProductCost / stock || 0
                        ).toLocaleString()}
                      </span>
                    </p> */}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-red-200">
                  <p className="flex justify-between text-lg font-bold text-red-700">
                    <span>{t('TCPD')}:</span>
                    <span>${calculatedValues.toFixed(2) || 0}</span>
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
        {/* Funnel Tab Content */}
        {activeTab === 'funnel' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <FunnelChart
              totalLeads={product?.requiredLeads || product?.price?.advertisement?.requiredLeads}
              confirmationRate={product?.price?.confirmationRate || 0}
              deliveryRate={product?.price?.deliveryRate || 0}
              deliveredOrdersTotal={product?.price?.deliveredOrders || 0}
              cpl={product?.price?.cpl || 0}
              product={product}
            />
          </motion.div>
        )}
        {/* Monthly ROI Tab Content */}
        {activeTab === 'monthly' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <MonthlyROIChart metrics={metrics} product={product} />
          </motion.div>
        )}
        {/* Cost Breakdown Tab Content */}
        {activeTab === 'breakdown' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ROICharts
              revenueData={[{ name: t('Revenue'), value: totalRevenue, color: '#22c55e' }]}
              expensesData={[{ name: t('Costs'), value: totalExpenses, color: '#ef4444' }]}
              profitabilityData={[
                { name: t('Roi'), value: (totalProfit / totalExpenses) * 100, color: '#8b5cf6' },
                { name: t('Profit Margin'), value: product?.price?.profitMargin, color: '#14b8a6' },
                { name: t('Personal Capital ROI'), value: personalCapitalROI, color: '#f59e0b' },
              ]}
              breakdownData={[
                { name: t('Advertising Costs Label'), value: advertisingCosts, color: '#8b5cf6' },
                { name: t('Stock Costs Label'), value: stockCosts, color: '#ec4899' },
                { name: t('Call Center Costs'), value: callCenterCosts, color: '#14b8a6' },
                { name: t('Delivery Costs Label'), value: deliveryCosts, color: '#f43f5e' },
                { name: t('Return Costs Label'), value: returnCosts, color: '#f59e0b' },
                { name: t('Cod Fees Label'), value: codFees, color: '#6366f1' },
              ]}
              product={product}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
