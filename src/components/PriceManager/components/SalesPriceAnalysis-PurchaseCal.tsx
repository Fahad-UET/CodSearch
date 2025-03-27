import { useState, useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { CountrySettingsData } from '../../../services/serviceProviders/types';

interface SalesPriceAnalysisProps {
  salePrice: number;
  sourcingPrice: number;
  settings: {
    confirmationRate: number;
    deliveryRate: number;
    cpl: number;
    chargePerProduct?: number;
    stock: number;
    productType: 'cosmetic' | 'gadget';
    serviceType: 'withCallCenter' | 'withoutCallCenter';
    purchasePrice: number;
    monthlyProductCharges?: any;
    fullFillment: any;
  };
  countrySettings?: CountrySettingsData;
  setNetProfit?: any;
  purchasePrice: number;
  product: any;
  setProfit?: any;
}

interface CostBreakdown {
  label: string;
  value: number;
  formula: string;
  details: { label: string; value: string }[];
}
const DollarIcon = () => {
  return (
    <div className="p-2.5 rounded-lg bg-purple-100 ring-2 ring-white/50 shadow-md group-hover:scale-110 transition-transform duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-dollar-sign w-5 h-5 text-purple-600"
      >
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    </div>
  );
};
const BuildingIcon = () => {
  return (
    <div className="p-2.5 rounded-lg bg-blue-100 ring-2 ring-white/50 shadow-md group-hover:scale-110 transition-transform duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-building2 w-5 h-5 text-blue-600"
      >
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
        <path d="M10 6h4"></path>
        <path d="M10 10h4"></path>
        <path d="M10 14h4"></path>
        <path d="M10 18h4"></path>
      </svg>
    </div>
  );
};
const MegaphoneIcon = () => {
  return (
    <div className="p-2.5 rounded-lg bg-orange-100 ring-2 ring-white/50 shadow-md group-hover:scale-110 transition-transform duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-megaphone w-5 h-5 text-orange-600"
      >
        <path d="m3 11 18-5v12L3 14v-3z"></path>
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>
      </svg>
    </div>
  );
};

const WalletIcon = () => {
  return (
    <div className="p-2.5 rounded-lg bg-green-100 ring-2 ring-white/50 shadow-md group-hover:scale-110 transition-transform duration-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-wallet w-5 h-5 text-green-600"
      >
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
      </svg>
    </div>
  );
};
export function SalesPriceAnalysisPurchaseCalculation({
  salePrice,
  sourcingPrice,
  settings,
  countrySettings,
  setProfit,
  purchasePrice,
  product,
}: SalesPriceAnalysisProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedCost, setExpandedCost] = useState<string | null>(null);
  const metrics = useMemo(() => {
    const requiredLeads = Math.ceil(
      settings.stock / (settings.confirmationRate / 100) / (settings.deliveryRate / 100)
    );

    // Updated Confirmed Orders formula
    const confirmedOrders = Math.round(requiredLeads * (settings.confirmationRate / 100));

    // Updated Returned Orders formula
    const returnedOrders = Math.round(
      requiredLeads * (settings.confirmationRate / 100) * (settings.deliveryRate / 100)
    );
    const getReturnedOrders = Math.round(
      requiredLeads * (settings.confirmationRate / 100) - settings.stock
    );
    const deliveredOrders = confirmedOrders - returnedOrders;

    const shippingCosts = countrySettings?.shippingCosts?.[settings.serviceType] || {
      shipping: 0,
      return: 0,
    };
    const productTypeLowerCase = product.productType.toLowerCase();
    const callCenterFees = countrySettings?.callCenterFees?.[productTypeLowerCase] || {
      lead: 0,
      confirmation: 0,
      delivered: 0,
    };

    const shippingCost = confirmedOrders * shippingCosts.shipping;
    const returnCost = returnedOrders * shippingCosts.return;
    const totalShipping = shippingCost + returnCost;
    const getTotalReturnCost = getReturnedOrders * shippingCosts?.return;

    const leadFees = requiredLeads * callCenterFees.lead;

    // Confirmation Fees
    const confirmationFees =
      requiredLeads * (settings.confirmationRate / 100) * callCenterFees.confirmation;

    // Delivery Fees
    const deliveryFees =
      requiredLeads *
      (settings.confirmationRate / 100) *
      (settings.deliveryRate / 100) *
      callCenterFees.delivered;

    const totalCallCenter =
      settings.serviceType === 'withCallCenter' ? leadFees + confirmationFees + deliveryFees : 0;

    const codFee = countrySettings?.codFee || 5;
    const codFees = (salePrice * settings.stock * codFee) / 100;

    const totalSales = salePrice * settings.stock;
    const productCosts = sourcingPrice * settings.stock;
    const purchaseCost = Math.round(purchasePrice) * settings.stock;
    const shippingCostUpdated = settings?.stock * shippingCosts.shipping;

    const totalCosts =
      Math.round(purchaseCost) +
      Math.round(shippingCostUpdated) +
      Math.round(totalCallCenter) +
      Math.round(codFees) +
      Math.round(getTotalReturnCost);

    const totalProfit = totalSales - totalCosts;
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    const profitPerUnit = settings.stock > 0 ? totalProfit / settings.stock : 0;

    // Advertising Cost calculation using CPL from settings
    const advertisingCost = requiredLeads * settings.cpl;

    // to be used is gross profit
    const operatingExpense = settings.stock * settings.monthlyProductCharges;
    const grossProfit = totalSales - advertisingCost - totalCosts;
    const netProfit = grossProfit - operatingExpense;
    // const shippingCostUpdated = settings?.stock * shippingCosts.shipping;

    const costBreakdowns: Record<string, CostBreakdown> = {
      productCosts: {
        label: 'Product Costs',
        value: purchaseCost,
        formula: `Product Costs = Purchase Price × Stock\n${Number(purchasePrice)?.toFixed(2)} × ${
          settings.stock
        } = ${purchaseCost.toFixed(2)}`,
        details: [
          { label: 'Purchase Price', value: `$${Math.round(purchasePrice)}` },
          { label: 'Stock', value: settings.stock.toString() },
          { label: 'Total Product Costs', value: `$${Math.round(purchaseCost)}` },
        ],
      },
      shippingCosts: {
        label: 'Shipping Costs',
        value: Math.round(shippingCostUpdated),
        formula: `Total Shipping Costs = Delivered Orders × Shipping Cost Delivered\n${
          settings.stock
        } × ${shippingCosts.shipping} = ${shippingCostUpdated.toFixed(2)}`,
        details: [
          { label: 'Delivered Orders', value: settings.stock.toString() },
          { label: 'Shipping Cost Delivered', value: `$${shippingCosts.shipping}` },
          { label: 'Total Shipping Costs', value: `$${shippingCostUpdated.toFixed(2)}` },
        ],
      },
      returnCosts: {
        label: 'Total Return Costs',
        value: getTotalReturnCost,
        formula: `Total Return Costs = Returned Orders × Shipping Cost Returned\n${getReturnedOrders} × ${
          shippingCosts.return
        } = ${getTotalReturnCost.toFixed(2)}`,
        details: [
          { label: 'Returned Orders', value: getReturnedOrders.toString() },
          { label: 'Return Rate', value: `$${shippingCosts.return}` },
          { label: 'Total Return Costs', value: `$${Math.round(getTotalReturnCost)}` },
        ],
      },
      callCenterFees: {
        label: 'Call Center Fees',
        value: totalCallCenter,
        formula: `Call Center Fees = Lead Fees + Confirmation Fees + Delivery Fees\n(${requiredLeads} × ${
          callCenterFees.lead
        }$) + ((${requiredLeads} × ${settings.confirmationRate}%) × ${
          callCenterFees.confirmation
        }$) + ((${requiredLeads} × ${settings.confirmationRate}% × ${settings.deliveryRate}%) * ${
          callCenterFees.delivered
        }$)) = ${totalCallCenter.toFixed(2)}`,
        details: [
          { label: 'Lead Fees', value: `$${Math.round(leadFees)}` },
          {
            label: 'Confirmation Fees',
            value: `$${Math.round(confirmationFees)}`,
          },
          {
            label: 'Delivery Fees',
            value: `$${Math.round(deliveryFees)}`,
          },
          { label: 'Total Call Center Fees', value: `$${Math.round(totalCallCenter)}` },
        ],
      },
      codFees: {
        label: 'COD Fees',
        value: codFees,
        formula: `COD Fees = (Sale Price × Stock × COD Fee Rate)\n(${Math.floor(salePrice)} × ${
          settings.stock
        } × ${codFee}%) = ${codFees.toFixed(2)}`,
        details: [
          { label: 'Sale Price', value: `$${Math.round(salePrice)}` },
          { label: 'Stock', value: settings.stock.toString() },
          { label: 'COD Fee Rate', value: `${codFee}%` },
          { label: 'Total COD Fees', value: `$${Math.round(codFees)}` },
        ],
      },
    };

    const grossProfitBreakDown: Record<string, CostBreakdown> = {
      grossProfit: {
        label: 'Gross Profit',
        value: grossProfit,
        formula: `Gross Profit = Total Sales - Advertising Cost - Total Costs\n${Math.round(
          totalSales
        )} - ${Math.round(advertisingCost)} - ${Math.round(totalCosts)} = ${Math.round(
          grossProfit
        )}`,
        details: [
          { label: 'Total Sales', value: `$${Math.round(totalSales)}` },
          { label: 'Advertising Cost', value: `$${Math.round(advertisingCost)}` },
          { label: 'Total Cost', value: `$${Math.round(totalCosts)}` },
        ],
      },
      operatingExpense: {
        label: 'Opertaing Expense',
        value: operatingExpense,
        formula: `Opertaing Expense = Stocks × Monthly Product Charges\n${settings.stock} × ${
          settings.monthlyProductCharges
        } = ${Math.round(operatingExpense)}`,
        details: [
          { label: 'Stocks', value: `$${Math.round(settings.stock)}` },
          {
            label: 'Monthly Product Charges',
            value: `$${settings.monthlyProductCharges.toFixed(2)}`,
          },
        ],
      },
    };

    // Adding advertising cost to metrics

    return {
      confirmedOrders,
      deliveredOrders,
      returnedOrders,
      totalSales,
      totalCosts,
      totalProfit,
      profitMargin,
      profitPerUnit,
      advertisingCost,
      costBreakdowns,
      requiredLeads,
      netProfit,
      grossProfitBreakDown,
      grossProfit,
      operatingExpense,
    };
  }, [settings, countrySettings, salePrice, sourcingPrice, purchasePrice]);
  const cards = [
    {
      id: 'revenue',
      title: 'Total Sale',
      icon: DollarIcon,
      color: 'purple',
      value: salePrice && purchasePrice ? metrics.totalSales : 0,
      formula: `Total Sales = Sale Price × Stock\n${salePrice.toFixed(2)} × ${Math.round(
        settings.stock
      )} = ${Math.round(metrics.totalSales)}`,
      details: [
        { label: 'Sale Price', value: `$${Math.round(salePrice)}` },
        { label: 'Stock', value: settings.stock },
        { label: 'Total Sales', value: `$${Math.round(metrics.totalSales)}` },
      ],
    },
    {
      id: 'totalCosts',
      title: 'Company Service Fees',
      icon: BuildingIcon,
      color: 'red',
      value: salePrice && purchasePrice ? metrics.totalCosts : 0,
      formula: `Total Costs = Product Costs + Shipping + Returns + Call Center + COD Fees`,
      details: Object.entries(metrics.costBreakdowns).map(([key, breakdown]) => ({
        id: key,
        ...breakdown,
      })),
    },

    {
      id: 'advertisingCost',
      title: 'Advertising Cost',
      icon: MegaphoneIcon,
      color: 'purple',
      value: salePrice && purchasePrice ? metrics.advertisingCost : 0,
      formula: `Advertising Cost = Required Leads × Cost Per Lead (CPL)\n${
        metrics.requiredLeads
      } × ${settings.cpl} = ${Math.round(metrics.advertisingCost)}`,
      details: [
        { label: 'Required Leads', value: metrics.requiredLeads },
        { label: 'Cost Per Lead (CPL)', value: `$${Math.round(settings.cpl)}` },
        { label: 'Advertising Cost', value: `$${Math.round(metrics.advertisingCost)}` },
      ],
    },
    {
      id: 'grossProfit',
      title: 'Net Profit',
      icon: WalletIcon,
      color: 'green',
      value: salePrice && purchasePrice ? metrics.netProfit : 0, // Updated to reflect grossProfit
      formula: `Net Profit = Gross Profit - Operating Expense\n${Math.round(
        metrics.grossProfit
      )} - ${metrics?.operatingExpense.toFixed(2)} = ${Math.round(metrics.netProfit)}`,
      details: Object.entries(metrics.grossProfitBreakDown).map(([key, breakdown]) => ({
        id: key,
        ...breakdown,
      })),
    },
  ];

  useEffect(() => {
    setProfit(Math.round(metrics.netProfit));
  }, [salePrice, sourcingPrice]);
  const highlightFormula = formula => {
    const [before, after] = formula.split('\n');
    return (
      <span>
        {before}
        <br />
        <span className="text-purple-600 font-bold"> {after}</span>
      </span>
    );
  };
  return (
    <div className="space-y-4">
      {cards.map(card => (
        <div
          key={card.id}
          className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all ${
            expandedCard === card.id ? 'ring-2 ring-purple-200' : ''
          }`}
          onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <card.icon />
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
              </div>
              <div className="flex justify-between items-center gap-1">
                <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                  {Math.round(card.value)} $
                </div>
                <ChevronDown size={20} className="text-gray-400 mt-1" />
              </div>
            </div>

            {expandedCard === card.id && (
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-purple-600">Formula</h4>
                  <pre className="bg-purple-50/50 rounded-lg p-3">
                    {highlightFormula(card.formula)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-purple-600">Detailed Breakdown</h4>
                  <div className=" rounded-lg divide-y divide-gray-200">
                    {card.id === 'totalCosts' || card.id === 'grossProfit'
                      ? card.details.map((detail: any) => (
                          <div key={detail.id} className="divide-y divide-gray-100">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setExpandedCost(expandedCost === detail.id ? null : detail.id);
                              }}
                              className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-gray-600">{detail.label}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-purple-600">
                                  ${Math.round(detail.value)}
                                </span>
                                {expandedCost === detail.id ? (
                                  <ChevronUp size={16} className="text-gray-400" />
                                ) : (
                                  <ChevronDown size={16} className="text-gray-400" />
                                )}
                              </div>
                            </button>

                            {expandedCost === detail.id && (
                              <div className="p-4 bg-white/50">
                                <div className="space-y-4">
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                                      Formula
                                    </h5>
                                    <pre className="bg-white p-3 rounded-lg text-sm font-mono whitespace-pre-wrap text-gray-800">
                                      {highlightFormula(detail.formula)}
                                    </pre>
                                  </div>
                                  <div>
                                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                                      Components
                                    </h5>
                                    <div className="bg-white rounded-lg divide-y divide-gray-100">
                                      {detail.details.map((item: any, index: number) => (
                                        <div
                                          key={index}
                                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                                        >
                                          <span className="text-gray-600">{item.label}</span>
                                          <span className="text-sm font-medium text-purple-600">
                                            {item.value}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      : card.details.map(detail => (
                          <div
                            key={detail.label}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-gray-600">{detail.label}</span>
                            <span className="text-sm font-medium text-purple-600">
                              {detail.value}
                            </span>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
