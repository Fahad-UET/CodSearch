import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import {
  X,
  Save,
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart2,
  Building,
  Package,
  Users,
  AlertCircle,
  Sigma,
  LineChart,
  PieChart,
  Briefcase,
  Target,
} from 'lucide-react';

import { PricesTab } from './PriceManager/PricesTab';
import { KpiTab } from './PriceManager/KpiTab';
import { ProfitabilityTab } from './PriceManager/ProfitabilityTab';
import { CustomFormulasTab } from './PriceManager/CustomFormulasTab';
// import { StockAnalysisSection } from './PriceManager/components/StockAnalysisSection';
// import { ServiceControls } from './PriceManager/components/ServiceControls';
import { useServiceProviderStore } from '../store/serviceProviderStore';
import { useKpiStore } from '../store/kpiStore';
// import { COUNTRIES } from '../services/codNetwork/constants';
import { AdTestingTab } from './PriceManager/AdTestingTab';
import { SalesPriceTab } from './PriceManager/tabs/SalesPriceTab';
import { RoiSimulator } from './PriceManager/tabs/RoiSimulator/RoiSimulator';
import { SellingPriceTab } from './PriceManager/tabs/SellingPriceTab';
import { ProfitCalculator } from '../pages/ProfitCalculator';
import { AnalysisTab } from '../pages/ManagePrices/Analysis/Analysis';
import { EcomPriceTab } from './PriceManager/tabs/EcomPriceTab';
import { useLanguageStore } from '@/store/languageStore';
import { FunnelChart } from '@/pages/ManagePrices/Analysis/FunnelChart';
import { ROICharts } from '@/pages/ManagePrices/Analysis/RoiCharts';
import { MonthlyROIChart } from '@/pages/ManagePrices/Analysis/MonthlyROIChart';
import { NORTH_AFRICA_COUNTRIES } from '@/services/codNetwork';

interface PriceManagerProps {
  productId: string;
  purchasePrice: number;
  salePrice: number;
  product: any;
  competitorPrices?: {
    aliexpress?: number;
    alibaba?: number;
    amazon?: number;
    noon?: number;
    other?: { name: string; price: number }[];
  };
  onUpdatePrices: (updates: {
    purchasePrice?: number;
    salePrice?: number;
    competitorPrices?: any;
  }) => Promise<void>;
  onClose: () => void;
  tabOnly: any;
  setTabOnly: any;
}

type TabType =
  | 'prices'
  | 'kpi'
  | 'profitability'
  | 'analysis'
  | 'calculations'
  | 'salesPrice'
  | 'ROISimulator'
  | 'SellingPriceSimulator'
  | 'break-even'
  | 'roi'
  | 'funnel'
  | 'monthly'
  | 'breakdown'
  | 'EcomPriceSimulator';
    // add EcomPriceSimulator as we are setting it below if this is invalid the check it
const selectInintalTab = {
  PRODUCT_SELLER: 'salesPrice',
  PRODUCT_AFFILIATE: 'ROISimulator',
  PRODUCT_DROP: 'SellingPriceSimulator',
  ECOM_LOCAL: 'EcomPriceSimulator',
};

export function PriceManager({
  productId,
  purchasePrice,
  salePrice,
  competitorPrices = {},
  onUpdatePrices,
  onClose,
  product,
  tabOnly,
  setTabOnly,
}: PriceManagerProps) {
  const [activeTab, setActiveTab] = useState<TabType>(
    selectInintalTab[product?.category] || 'calculations'
  );
  useEffect(() => {
    setActiveTab(selectInintalTab[product?.category]);
  }, []);

  const [prices, setPrices] = useState({
    purchasePrice,
    salePrice,
    aliexpress: competitorPrices.aliexpress || 0,
    alibaba: competitorPrices.alibaba || 0,
    amazon: competitorPrices.amazon || 0,
    noon: competitorPrices.noon || 0,
    other: competitorPrices.other || [],
  });

  const [selectedCountry, setSelectedCountry] = useState('KSA');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stockQuantity, setStockQuantity] = useState(100);
  const [productType, setProductType] = useState<'cosmetic' | 'gadget'>('cosmetic');
  const [serviceType, setServiceType] = useState<'with' | 'without'>('with');
  const { providers, selectedProviderId, setSelectedProvider } = useServiceProviderStore();
  const { getCountrySettings } = useKpiStore();
  const selectedProvider = providers.find(p => p.id === selectedProviderId);
  const countrySettings = selectedProvider?.countries[selectedCountry];
  const kpiSettings = getCountrySettings(selectedCountry);
  // Calculate variables for custom formulas
  const formulaVariables = {
    purchasePrice: prices.purchasePrice,
    salePrice: prices.salePrice,
    aliexpressPrice: prices.aliexpress,
    alibabaPrice: prices.alibaba,
    amazonPrice: prices.amazon,
    noonPrice: prices.noon,
    cpc: kpiSettings.cpc.high,
    cpl: kpiSettings.cpl.high,
    cpm: kpiSettings.cpm.high,
    roas: kpiSettings.roas.high,
    ctr: kpiSettings.ctr.high,
    confirmationRate: kpiSettings.confirmationRate.high,
    deliveryRate: kpiSettings.deliveryRate.high,
    profitMargin: kpiSettings.profitMargin.high,
    chargePerProduct: 2.45, // Example value
    totalMonthlyExpenses: stockQuantity * 2.45, // Example calculation
  };
  // state that we are using in analysis tabs for nested cal
  const { t } = useLanguageStore();
  const [serviceCompanyShare, setServiceCompanyShare] = useState(30);
  const stockInvestment = product?.price?.sourcingPrice * product?.price?.stock;
  const serviceCompanyInvestment = stockInvestment * (serviceCompanyShare / 100);
  const personalInvestment = stockInvestment - serviceCompanyInvestment;
  const totalRevenue = product?.price?.salePrice * product?.price?.stock || 0;
  const personalCapitalROI = useMemo(() => {
    const divisible = (product?.price?.advertisingCost ?? 0) + personalInvestment;
    const divided = (product?.price?.totalProfit ?? 0) / divisible;
    return divided * 100;
  }, [product, serviceCompanyInvestment]);
  const advertisingCosts = product?.price?.advertisement?.totalAdvertisementCost || 0;
  const stockCosts = product?.price?.companyServicesFee?.totalProductCost || 0;
  const callCenterCosts = product?.price?.companyServicesFee?.totalCallCenterFees || 0;
  const deliveryCosts = product?.price?.companyServicesFee?.shippingCost || 0;
  const returnCosts = product?.price?.companyServicesFee?.totalReturnCost || 0;
  const codFees = product?.price?.companyServicesFee?.totalCodFees || 0;
  const totalReturnCost = product?.price?.companyServicesFee?.totalReturnCost | 0;
  const totalProductCost = product?.price?.companyServicesFee?.totalProductCost || 0;
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
    const monthlyCharges = product?.price?.monthlyProductCharges;
    const cpd =
      product?.price?.cpl /
      ((product?.price?.confirmationRate / 100) * (product?.price?.deliveryRate / 100));
    const cod = codFees ? Number(codFees / stock || 0) : 0;
    const callCenter = callCenterCosts ? Number(callCenterCosts / stock) : 0;
    const delivery = deliveryCosts ? Number(totalShippingPerCostPerdelivered.toFixed(2)) : 0;
    return monthlyCharges + cpd + cod + callCenter + delivery;
  }, [product, advertisingCosts, codFees, callCenterCosts, deliveryCosts]);
  const getCurrencyLogo =
    product.category === 'ECOM_LOCAL' ? NORTH_AFRICA_COUNTRIES[product?.country]?.currency : '';
  const checkEcom = useMemo(() => {
    return product.category === 'ECOM_LOCAL';
  }, [product]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-md flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl w-[98%] h-[98vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-end px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-purple-100">
          <button
            onClick={() => {
              setTabOnly({ status: false, tab: '' });
              onClose();
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        {/* Messages */}
        {(error || success) && (
          <div className="px-6 py-3 bg-white/50 border-b border-purple-100">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-600 rounded-lg flex items-center gap-2">
                <Save size={20} />
                {success}
              </div>
            )}
          </div>
        )}
        {/* Tabs */}
        {!tabOnly.status && (
          <div className="flex border-b border-purple-100">
            {/* <button
            onClick={() => setActiveTab('prices')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'prices'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            Prices
          </button>
          <button
            onClick={() => setActiveTab('kpi')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'kpi'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            KPI Values
          </button>
          <button
            onClick={() => setActiveTab('profitability')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'profitability'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calculator size={16} />
              Profitability Analysis
            </div>
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sigma size={16} />
              Custom Formulas
            </div>
          </button> */}
            {/* <button
            onClick={() => setActiveTab('calculations')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'calculations'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">Adoc</div>
          </button> */}
            {product.category === 'PRODUCT_SELLER' && (
              <button
                onClick={() => setActiveTab('salesPrice')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'salesPrice'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">Sales Price</div>
              </button>
            )}
            {product.category === 'PRODUCT_AFFILIATE' && (
              <button
                onClick={() => setActiveTab('ROISimulator')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'ROISimulator'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">ROI Simulator</div>
              </button>
            )}
            {product.category === 'PRODUCT_DROP' && (
              <button
                onClick={() => setActiveTab('SellingPriceSimulator')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'SellingPriceSimulator'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  Selling Price Simulator
                </div>
              </button>
            )}
            {product.category === 'ECOM_LOCAL' && (
              <button
                onClick={() => setActiveTab('EcomPriceSimulator')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'EcomPriceSimulator'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">Ecom Price Simulator</div>
              </button>
            )}
            <button
              onClick={() => setActiveTab('funnel')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'funnel'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">Conversion Funnel</div>
            </button>
            <button
              onClick={() => setActiveTab('roi')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'roi'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">RIO Dashboard</div>
              {/* RIO Dashboard or retrun on invertment rio */}
            </button>
            {product.category != 'PRODUCT_AFFILIATE' && (
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'breakdown'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">Cost Breakdown</div>
              </button>
            )}
            {product.category != 'PRODUCT_AFFILIATE' && (
              <button
                onClick={() => setActiveTab('monthly')}
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'monthly'
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">Monthly Evolution</div>
              </button>
            )}
            {/* <button
              onClick={() => setActiveTab('calculations')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'calculations'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">Ad Testing</div>
            </button> */}
            <button
              onClick={() => setActiveTab('break-even')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'break-even'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Calculator size={16} />
                Break-even
              </div>
            </button>{' '}
            {/* <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LineChart size={16} />
                Analysis
              </div>
            </button> */}
          </div>
        )}
        {/* Content Area */}
        {!tabOnly.status && (
          <div
            className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-purple-50"
            style={{ height: 'calc(98vh - 158px)' }}
          >
            <div className="p-6 space-y-6">
              {activeTab === 'prices' && (
                <PricesTab
                  prices={prices}
                  // change it according to props
                  // onPriceSave={async updates => 
                  onPricesChange={async (updates: any) => {
                    setIsLoading(true);
                    setError(null);

                    try {
                      await onUpdatePrices(updates);
                      setSuccess('Changes saved successfully');
                      setTimeout(() => setSuccess(null), 3000);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Failed to save changes');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                />
              )}
              {activeTab === 'kpi' && <KpiTab selectedCountry={selectedCountry} />}
              {activeTab === 'profitability' && (
                <ProfitabilityTab
                  purchasePrice={prices.purchasePrice}
                  salePrice={prices.salePrice}
                  selectedCountry={selectedCountry}
                  unitCount={stockQuantity}
                  productType={productType}
                  serviceType={serviceType}
                />
              )}
              {activeTab === 'break-even' && (
                <ProfitCalculator product={product} onClose={() => setActiveTab('calculations')} />
              )}
              {activeTab === 'analysis' && (
                <>
                  <h1>working</h1>
                  <AnalysisTab product={product} onClose={() => setActiveTab('calculations')} />
                </>
              )}
              {activeTab === 'calculations' && <AdTestingTab productId={productId} />}
              {activeTab === 'roi' && (
                <div className="space-y-6">
                  {/* Row 1: Stock Investment and Total Expenses */}
                  <div
                    className={`grid grid-cols-1 md:${
                      product?.category === 'PRODUCT_AFFILIATE' ||
                      product?.category === 'PRODUCT_DROP' ||
                      product?.category === 'ECOM_LOCAL'
                        ? 'grid-cols-1'
                        : 'grid-cols-2'
                    } gap-6`}
                  >
                    {/* Investment Breakdown */}
                    {product?.category !== 'PRODUCT_AFFILIATE' &&
                      product?.category !== 'PRODUCT_DROP' &&
                      product?.category !== 'ECOM_LOCAL' && (
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
                                {!checkEcom && '$'}
                                {Math.round(stockInvestment || 0).toLocaleString()}{' '}
                                {checkEcom && getCurrencyLogo}
                              </span>
                            </p>
                            <p className="flex justify-between items-center text-sm text-purple-600">
                              <span>{t('Service company stake')}</span>
                              <span className="font-semibold">
                                {!checkEcom && '$'}
                                {Math.round(serviceCompanyInvestment || 0).toLocaleString()}{' '}
                                {checkEcom && getCurrencyLogo}
                              </span>
                            </p>
                            <p className="flex justify-between items-center text-sm text-purple-600">
                              <span>{t('Personal Investment')}</span>
                              <span className="font-semibold">
                                {!checkEcom && '$'}
                                {Math.round(personalInvestment || 0).toLocaleString()}{' '}
                                {checkEcom && getCurrencyLogo}
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
                        <h3 className="text-lg font-semibold text-red-900">
                          {t('Total Expenses')}
                        </h3>
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
                              {!checkEcom && '$'}
                              {Math.round(
                                product?.price?.advertisement?.totalAdvertisementCost || 0
                              ).toLocaleString()}{' '}
                              {checkEcom && getCurrencyLogo}
                            </span>
                          </p>
                          {product?.category != 'PRODUCT_AFFILIATE' && (
                            <p className="flex justify-between text-sm text-red-600">
                              <span>{t('Stock Costs')}:</span>
                              <span className="font-semibold">
                                {!checkEcom && '$'}
                                {Math.round(
                                  product?.price?.companyServicesFee?.totalProductCost || 0
                                ).toLocaleString()}{' '}
                                {checkEcom && getCurrencyLogo}
                              </span>
                            </p>
                          )}
                          {product?.category != 'PRODUCT_AFFILIATE' && (
                            <p className="flex justify-between text-sm text-red-600">
                              <span>{t('Call Center Costs')}:</span>
                              <span className="font-semibold">
                                {!checkEcom && '$'}
                                {Math.round(
                                  product?.price?.companyServicesFee?.totalCallCenterFees || 0
                                ).toLocaleString()}{' '}
                                {checkEcom && getCurrencyLogo}
                              </span>
                            </p>
                          )}
                        </div>

                        {!(product?.category === 'PRODUCT_AFFILIATE') && (
                          <div className="space-y-2">
                            {product?.category != 'PRODUCT_AFFILIATE' && (
                              <p className="flex justify-between text-sm text-red-600">
                                <span>{t('Total Shipping Costs')}:</span>
                                <span className="font-semibold">
                                  {!checkEcom && '$'} {Math.round(totalShippingPerCost) || 0}{' '}
                                  {checkEcom && getCurrencyLogo}
                                </span>
                              </p>
                            )}
                            {product?.category != 'PRODUCT_AFFILIATE' && (
                              <p className="flex justify-between text-sm text-red-600">
                                <span>{t('COD Fees')}:</span>
                                <span className="font-semibold">
                                  {' '}
                                  {!checkEcom && '$'}
                                  {Math.round(
                                    product?.price?.companyServicesFee?.totalCodFees || 0
                                  ).toLocaleString()}{' '}
                                  {checkEcom && getCurrencyLogo}
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <p className="flex justify-between text-lg font-bold text-red-700">
                          <span>{t('Total')}:</span>
                          <span>
                            {!checkEcom && '$'} {Math.round(totalExpenses).toLocaleString()}{' '}
                            {checkEcom && getCurrencyLogo}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Row 2: Revenue, Profit Margin, Personal Capital ROI */}
                  <div
                    className={`grid grid-cols-1 md:${
                      product?.category === 'PRODUCT_AFFILIATE' ||
                      product?.category === 'PRODUCT_DROP' ||
                      product?.category === 'ECOM_LOCAL'
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
                        <h3 className="text-lg font-semibold text-green-900">
                          {t('Profit Margin')}
                        </h3>
                      </div>
                      {/* <div className="text-3xl font-bold text-green-700">{profitMargin.toFixed(1)}%</div> */}
                      <div className="text-3xl font-bold text-green-700">
                        PM: {product?.price?.profitMargin || 0}%
                      </div>
                    </motion.div>

                    {/* Personal Capital ROI */}
                    {product?.category !== 'PRODUCT_AFFILIATE' &&
                      product?.category !== 'PRODUCT_DROP' &&
                      product?.category !== 'ECOM_LOCAL' && (
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
                            <span className="text-sm text-green-600 ml-2">
                              ({t(' % Stock + Ads ')})
                            </span>
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
                        <h3 className="text-lg font-semibold text-green-900">
                          {t('Total Revenue')}
                        </h3>
                      </div>
                      <div className="text-3xl font-bold text-green-700">
                        TR:{' '}
                        {`${Math.round(product?.price?.totalRevenue || 0).toLocaleString()} ${
                          checkEcom ? getCurrencyLogo : '$'
                        }`}
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
                        } ${checkEcom ? getCurrencyLogo : '$'}`}
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
                        <h3 className="text-lg font-semibold text-green-900">
                          {t('Total Profit')}
                        </h3>
                      </div>
                      <div className="text-3xl font-bold text-green-700">
                        {/* ${Math.round(profitPerUnit).toLocaleString()} */}
                        {`TP: ${Math.round(product?.price?.totalProfit) || 0}  ${
                          checkEcom ? getCurrencyLogo : '$'
                        }`}
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
                              <span className="font-bold">MCPD</span> - Monthly Charges Per
                              Delivered :
                            </span>
                            <span className="font-semibold">
                              {!checkEcom && '$'}
                              {product?.price?.monthlyProductCharges} {checkEcom && getCurrencyLogo}
                            </span>
                          </p>
                          <p className="flex justify-between text-sm text-red-600">
                            <span>
                              <span className="font-bold">CPD</span> - Cost Per Delivered (ads) :
                            </span>
                            <span className="font-semibold">
                              {/* ${(advertisingCosts / stock || 0).toFixed(2)} */}
                              {`${!checkEcom ? '$' : ''}${(
                                product?.price?.cpl /
                                ((product?.price?.confirmationRate / 100) *
                                  (product?.price?.deliveryRate / 100))
                              ).toFixed(2)} ${checkEcom ? getCurrencyLogo : ''}`}
                            </span>
                          </p>
                          <p className="flex justify-between text-sm text-red-600">
                            <span>
                              {' '}
                              <span className="font-bold">FPD</span> - Fees Per Delivered :
                            </span>
                            <span className="font-semibold">
                              {!checkEcom && '$'}
                              {(codFees / stock || 0).toFixed(2)} {checkEcom && getCurrencyLogo}
                            </span>
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
                              <span className="font-bold">CCCPD</span> - Call Center Cost Per
                              Delivered :
                            </span>
                            <span className="font-semibold">
                              {!checkEcom && '$'}
                              {(callCenterCosts / stock || 0).toFixed(2)}{' '}
                              {checkEcom && getCurrencyLogo}
                            </span>
                          </p>
                          <p className="flex justify-between text-sm text-red-600">
                            <span>
                              <span className="font-bold">TSCPD</span> - Total Shipping Cost Per
                              Delivered :
                            </span>
                            <span className="font-semibold">
                              {/* ${(deliveryCosts / stock || 0).toFixed(2)} */}
                              {!checkEcom && '$'}
                              {!checkEcom && '$'}
                              {totalShippingPerCostPerdelivered?.toFixed(2) || 0}{' '}
                              {checkEcom && getCurrencyLogo}
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
                          <span>
                            {!checkEcom && '$'}
                            {calculatedValues.toFixed(2) || 0} {checkEcom && getCurrencyLogo}
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
              {activeTab === 'funnel' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <FunnelChart
                    totalLeads={
                      product?.requiredLeads || product?.price?.advertisement?.requiredLeads
                    }
                    confirmationRate={product?.price?.confirmationRate || 0}
                    deliveryRate={product?.price?.deliveryRate || 0}
                    deliveredOrdersTotal={product?.price?.deliveredOrders || 0}
                    cpl={product?.price?.cpl || 0}
                    product={product}
                  />
                </motion.div>
              )}
              {activeTab === 'monthly' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <MonthlyROIChart product={product} />
                </motion.div>
              )}
              {activeTab === 'breakdown' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <ROICharts
                    product={product}
                    revenueData={[{ name: t('Revenue'), value: totalRevenue, color: '#22c55e' }]}
                    expensesData={[{ name: t('Costs'), value: totalExpenses, color: '#ef4444' }]}
                    profitabilityData={[
                      {
                        name: t('Roi'),
                        value: (totalProfit / totalExpenses) * product?.price?.stock,
                        color: '#8b5cf6',
                      },
                      {
                        name: t('Profit Margin'),
                        value: product?.price?.profitMargin,
                        color: '#14b8a6',
                      },
                      {
                        name: t('Personal Capital ROI'),
                        value: personalCapitalROI,
                        color: '#f59e0b',
                      },
                    ]}
                    breakdownData={[
                      {
                        name: t('Advertising Costs'),
                        value: advertisingCosts,
                        color: '#8b5cf6',
                      },
                      { name: t('Stock Costs'), value: stockCosts, color: '#ec4899' },
                      { name: t('Call Center Costs'), value: callCenterCosts, color: '#14b8a6' },
                      { name: t('Delivery Costs'), value: deliveryCosts, color: '#f43f5e' },
                      { name: t('Return Costs'), value: returnCosts, color: '#f59e0b' },
                      { name: t('Cod Fees'), value: codFees, color: '#6366f1' },
                    ]}
                  />
                </motion.div>
              )}
              {activeTab === 'salesPrice' && (
                <SalesPriceTab
                  intialCountry={selectedCountry}
                  onPriceCalculated={() => {}}
                  productId={productId}
                  product={product}
                />
              )}
              {activeTab === 'ROISimulator' && (
                <RoiSimulator
                  intialCountry={selectedCountry}
                  onPriceCalculated={() => {}}
                  productId={productId}
                  product={product}
                />
              )}
              {activeTab === 'SellingPriceSimulator' && (
                <SellingPriceTab
                  intialCountry={selectedCountry}
                  onPriceCalculated={() => {}}
                  productId={productId}
                  product={product}
                />
              )}
              {activeTab === 'EcomPriceSimulator' && (
                <EcomPriceTab
                  intialCountry={selectedCountry}
                  onPriceCalculated={() => {}}
                  productId={productId}
                  product={product}
                />
              )}
            </div>
          </div>
        )}
        <div
          className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-purple-50"
          style={{ height: 'calc(98vh - 158px)' }}
        >
          {tabOnly.tab === 'salesPrice' && (
            <>
              <button
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors text-purple-600 border-b-2 border-purple-600 }`}
              >
                <div className="flex items-center justify-center gap-2 tw-text-2xl">
                  Sales Price
                </div>
              </button>
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-purple-50">
                <SalesPriceTab
                  intialCountry={selectedCountry}
                  onPriceCalculated={() => {}}
                  productId={productId}
                  product={product}
                />
              </div>
            </>
          )}
          {tabOnly.tab === 'ROISimulator' && (
            <>
              <button
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors text-purple-600 border-b-2 border-purple-600 }`}
              >
                <div className="flex items-center justify-center gap-2 tw-text-2xl">
                  ROI Simulator
                </div>
              </button>
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-purple-50">
                <RoiSimulator
                  intialCountry={selectedCountry}
                  onPriceCalculated={() => {}}
                  productId={productId}
                  product={product}
                />
              </div>
            </>
          )}
          {tabOnly.tab === 'SellingPriceSimulator' && (
            <>
              <button
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors text-purple-600 border-b-2 border-purple-600 }`}
              >
                <div className="flex items-center justify-center gap-2 tw-text-2xl">
                  {' '}
                  Selling Price Simulator
                </div>
              </button>
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-purple-50">
                <SellingPriceTab
                  intialCountry={selectedCountry}
                  onPriceCalculated={() => {}}
                  productId={productId}
                  product={product}
                />
              </div>
            </>
          )}
          {tabOnly.tab === 'calculations' && (
            <>
              <button
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors text-purple-600 border-b-2 border-purple-600 }`}
              >
                <div className="flex items-center justify-center gap-2 tw-text-2xl">Ad Testing</div>
              </button>
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-purple-50">
                <AdTestingTab productId={productId} />
              </div>
            </>
          )}
          {tabOnly.tab === 'break-even' && (
            <>
              {/* <button
                className={`flex-1 flex gap-2 px-6 py-3 text-sm font-medium transition-colors text-purple-600 border-b-2 border-purple-600 }`}
              >
                <Calculator size={16} />{' '}
                <div className="flex items-center justify-center gap-2 tw-text-2xl">Break-even</div>
              </button> */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-purple-50">
                <ProfitCalculator
                  product={product}
                  onClose={() => {
                    setTabOnly({ status: false, tab: '' });
                    onClose();
                  }}
                />
              </div>
            </>
          )}
          {tabOnly.tab === 'analysis' && (
            <>
              <button
                className={`flex-1 flex gap-2 px-6 py-3 text-sm font-medium transition-colors text-purple-600 border-b-2 border-purple-600 }`}
              >
                <LineChart />
                <div className="flex items-center justify-center gap-2 tw-text-2xl">Analysis</div>
              </button>
              <div className="flex-1 overflow-y-auto bg-gradient-to-br from-white to-purple-50">
                <AnalysisTab
                  product={product}
                  onClose={() => {
                    setTabOnly({ status: false, tab: '' });
                    onClose();
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
