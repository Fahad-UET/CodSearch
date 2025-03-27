import { useState, useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { CountrySettingsData } from '@/services/serviceProviders/types';

interface SalesPriceAnalysisProps {
  salePrice: number;
  sourcingPrice: number;
  settings: {
    confirmationRate: number;
    deliveryRate: number;
    cpl: number;
    chargePerProduct: number;
    stock: number;
    productType: 'cosmetic' | 'gadget';
    serviceType: 'withCallCenter' | 'withoutCallCenter';
    monthlyProductCharges?: any;
  };
  countrySettings?: CountrySettingsData;
  product: any;
  comission?: any;
  setProfit?: any;
  grosstitleBase?: any;
}

export interface CostBreakdown {
  label: string;
  value: number;
  formula: string;
  details: { label: string; value: string }[];
  comission?: any;
  setProfit?: any;
  grosstitleBase?: any;
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
export function RoiSimulatorAnaylsis({
  salePrice,
  sourcingPrice,
  settings,
  countrySettings,
  comission,
  setProfit,
  grosstitleBase,
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
    const totalCosts = productCosts + totalShipping + totalCallCenter + codFees;
    const totalProfit = totalSales - totalCosts;
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    const profitPerUnit = settings.stock > 0 ? totalProfit / settings.stock : 0;

    // Advertising Cost calculation using CPL from settings
    const advertisingCost = requiredLeads * settings.cpl;

    // to be used is gross profit
    const operatingExpense = settings.stock * settings.monthlyProductCharges;
    const grossProfit = totalSales - advertisingCost - totalCosts;
    const netProfit = settings.stock * comission - advertisingCost;

    // const grossProfitBreakDown: Record<string, CostBreakdown> = {
    //   grossProfit: {
    //     label: 'Gross Profit',
    //     value: grossProfit,
    //     formula: `Gross Profit = (Stock × Comission) - Advertising Cost \n(${settings.stock} × ${comission})- ${advertisingCost} = ${netProfit}`,
    //     details: [
    //       { label: 'Stock', value: `${Math.round(settings.stock)}` },
    //       { label: 'comission', value: `$${Math.round(comission)}` },
    //       { label: 'Advertising Cost', value: `$${Math.round(advertisingCost)}` },
    //     ],
    //   },
    // };
    const grossProfitBreakDown: Record<string, CostBreakdown> = {
      grossProfit: {
        label: 'Gross Profit',
        value: netProfit,
        formula: `Gross Profit = (${grosstitleBase} × Comission) - Advertising Cost \n(${
          settings.stock
        } × ${comission})- ${advertisingCost} = ${settings.stock * comission - advertisingCost}`,
        details: [
          { label: `${grosstitleBase}`, value: `${Math.round(settings.stock)}` },
          { label: 'comission', value: `$${Math.round(comission)}` },
          { label: 'Advertising Cost', value: `$${Math.round(advertisingCost)}` },
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
            value: `$${settings?.monthlyProductCharges.toFixed(2)}`,
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
      requiredLeads,
      netProfit,
      grossProfitBreakDown,
      grossProfit,
      operatingExpense,
    };
  }, [settings, countrySettings, salePrice, sourcingPrice]);

  const cards = [
    {
      id: 'revenue',
      title: 'Total Sale',
      icon: DollarIcon,
      color: 'purple',
      value: salePrice && comission ? metrics.totalSales : 0,
      formula: `Total Sales = Sale Price × Stock\n${salePrice.toFixed(2)} × ${
        settings.stock
      } = ${Math.round(metrics.totalSales)}`,
      details: [
        { label: 'Sale Price', value: `$${Math.round(salePrice)}` },
        { label: 'Stock', value: settings.stock },
        { label: 'Total Sales', value: `$${Math.round(metrics.totalSales)}` },
      ],
    },

    {
      id: 'advertisingCost',
      title: 'Advertising Cost',
      icon: MegaphoneIcon,
      color: 'purple',
      value: salePrice && comission ? metrics.advertisingCost : 0,
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
      title: 'Gross Profit',
      icon: WalletIcon,
      color: 'green',
      value: salePrice && comission ? metrics.netProfit - metrics.operatingExpense : 0, // Updated to reflect netProfit
      formula: `Net Profit = Gross Profit - Operating Expense\n${Math.round(
        settings.stock * comission - metrics.advertisingCost
      )} - ${metrics.operatingExpense?.toFixed(2) || 0} = ${Math.round(
        metrics.netProfit - metrics.operatingExpense || 0
      )}`,
      details: Object.entries(metrics.grossProfitBreakDown).map(([key, breakdown]) => ({
        id: key,
        ...breakdown,
        value: breakdown.value || 0, // Default to 0 for each breakdown value
      })),
    },
  ];

  useEffect(() => {
    setProfit(Math.round(metrics.netProfit));
  }, [salePrice, comission]);
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
        <div>
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
                <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-200">
                  ${Math.round(card.value)}
                </div>
              </div>
            </div>
          </div>
          {expandedCard === card.id && (
            <div
              className={`w-full mt-2 px-5 relative bg-gradient-to-br from-white to-gray-50/95 rounded-xl shadow-lg border-2 border-indigo-100 hover:border-purple-200 transition-all duration-200 group
            ${expandedCard === card.id ? 'ring-2 ring-purple-200' : ''}`}
            >
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
                    <div className="rounded-lg divide-y divide-gray-200">
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
                                      <h5 className="text-sm font-medium text-purple-600">
                                        Formula
                                      </h5>
                                      <pre className="bg-white p-3 rounded-lg text-sm font-mono whitespace-pre-wrap text-gray-800">
                                        {detail.formula}
                                      </pre>
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-medium text-purple-600">
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
          )}
        </div>
      ))}
    </div>
  );
}
