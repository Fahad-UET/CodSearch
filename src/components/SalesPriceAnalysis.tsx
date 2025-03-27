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
    // to resolve build issue please check this
    monthlyProductCharges: any;

  };
  countrySettings?: CountrySettingsData;
  // to resolve build issue please check this
  // setNetProfit: any;
  // setProfitPerProduct: any;
  setNetProfit?: any;
  setProfitPerProduct?: any;
  setProfit?: any;
}

interface CostBreakdown {
  label: string;
  value: number;
  formula: string;
  details: { label: string; value: string }[];
}

export function SalesPriceAnalysis({
  salePrice,
  sourcingPrice,
  settings,
  countrySettings,
  setProfit,
  setProfitPerProduct,
}: SalesPriceAnalysisProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [expandedCost, setExpandedCost] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // Handler to toggle the checkbox state
  const toggleHandler = () => {
    setIsChecked(!isChecked);
  };

  const metrics = useMemo(() => {
    const requiredLeads = Math.ceil(
      settings.stock / (settings.confirmationRate / 100) / (settings.deliveryRate / 100)
    );

    // Updated Confirmed Orders formula
    const confirmedOrders = Math.round(requiredLeads * (settings.confirmationRate / 100));

    const deliveredOrder =
      Math.round(requiredLeads * (settings.confirmationRate / 100)) * (settings.deliveryRate / 100);

    // Updated Returned Orders formula
    const returnedOrders = Math.round(
      requiredLeads * (settings.confirmationRate / 100) * (settings.deliveryRate / 100)
    );

    const deliveredOrders = confirmedOrders - returnedOrders;

    const shippingCosts = countrySettings?.shippingCosts?.[settings.serviceType] || {
      shipping: 0,
      return: 0,
    };

    const callCenterFees = countrySettings?.callCenterFees?.[settings.productType] || {
      lead: 0,
      confirmation: 0,
      delivered: 0,
    };

    const shippingCost = Math.round(deliveredOrder * shippingCosts.shipping);
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
    const netProfit = grossProfit - operatingExpense;
    setProfitPerProduct(netProfit);
    const costBreakdowns: Record<string, CostBreakdown> = {
      productCosts: {
        label: 'Product Costs',
        value: productCosts,
        formula: `Product Costs = Sourcing Price × Stock\n${sourcingPrice} × ${
          settings.stock
        } = ${Math.round(productCosts)}`,
        details: [
          { label: 'Sourcing Price', value: `$${Math.round(sourcingPrice)}` },
          { label: 'Stock', value: settings.stock.toString() },
          { label: 'Total Product Costs', value: `$${Math.round(productCosts)}` },
        ],
      },
      shippingCosts: {
        label: 'Shipping Costs',
        value: Math.round(shippingCost),
        formula: `Shipping Costs = Delivered Orders × Shipping Rate\n${Math.round(
          deliveredOrder
        )} × ${shippingCosts.shipping} = ${Math.round(shippingCost)}`,
        details: [
          { label: 'Delivered Orders', value: deliveredOrder.toString() },
          { label: 'Shipping Rate', value: `$${shippingCosts.shipping}` },
          { label: 'Total Shipping Costs', value: `$${Math.round(shippingCost)}` },
        ],
      },
      returnCosts: {
        label: 'Total Return Costs',
        value: returnCost,
        formula: `Total Return Costs = Returned Orders × Shipping Rate\n${returnedOrders} × ${
          shippingCosts.return
        } = ${Math.round(returnCost)}`,
        details: [
          { label: 'Returned Orders', value: returnedOrders.toString() },
          { label: 'Shipping Rate', value: `$${shippingCosts.return}` },
          { label: 'Total Return Costs', value: `$${Math.round(returnCost)}` },
        ],
      },
      callCenterFees: {
        label: 'Call Center Fees',
        value: totalCallCenter,
        formula: `Call Center Fees = Lead Fees + Confirmation Fees + Delivery Fees\n(${requiredLeads} × ${
          callCenterFees.lead
        }) + (${requiredLeads} × (${settings.confirmationRate}% × ${
          callCenterFees.confirmation
        })) + (${requiredLeads} × (${settings.confirmationRate}% × ${settings.deliveryRate}% × ${
          callCenterFees.delivered
        })) = ${Math.round(totalCallCenter)}`,
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
        formula: `COD Fees = (Sale Price × Stock × COD Fee Rate)\n(${salePrice.toFixed(2)} × ${
          settings.stock
        } × ${codFee}%) = ${Math.round(codFees)}`,
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
        formula: `Gross Profit = Total Sales - Advertising Cost - Total Costs\n${totalSales} - ${advertisingCost} - ${totalCosts} = ${Math.round(
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
            value: `$${Math.round(settings.monthlyProductCharges)}`,
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
    };
  }, [settings, countrySettings, salePrice, sourcingPrice]);

  const cards = [
    {
      id: 'revenue',
      title: 'Total Sale',
      icon: DollarSign,
      color: 'purple',
      value: metrics.totalSales,
      formula: `Total Sales = Sale Price × Stock\n${salePrice} × ${settings.stock} = ${Math.round(
        metrics.totalSales
      )}`,
      details: [
        { label: 'Sale Price', value: `$${Math.round(salePrice)}` },
        { label: 'Stock', value: settings.stock },
        { label: 'Total Sales', value: `$${Math.round(metrics.totalSales)}` },
      ],
    },
    {
      id: 'totalCosts',
      title: 'Company Service Fees',
      icon: BarChart2,
      color: 'red',
      value: metrics.totalCosts,
      formula: `Company Service Cost = Product Costs + Shipping + Returns + Call Center + COD Fees`,
      details: Object.entries(metrics.costBreakdowns).map(([key, breakdown]) => ({
        id: key,
        ...breakdown,
      })),
    },

    {
      id: 'advertisingCost',
      title: 'Advertising Cost',
      icon: BarChart2,
      color: 'purple',
      value: metrics.advertisingCost,
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
      icon: TrendingUp,
      color: 'green',
      value: metrics.netProfit, // Updated to reflect netProfit
      formula: `Net Profit = Gross Profit - Operating Expense\n${Math.round(
        metrics.totalProfit
      )} - ${settings.stock * settings.monthlyProductCharges} = ${Math.round(metrics.netProfit)}`,
      details: Object.entries(metrics.grossProfitBreakDown).map(([key, breakdown]) => ({
        id: key,
        ...breakdown,
      })),
    },
  ];

  useEffect(() => {
    setProfit(Math.round(metrics.netProfit));
  }, [salePrice, sourcingPrice]);

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
                <card.icon className={`text-${card.color}-600`} size={24} />
                <h3 className="font-semibold text-gray-900">{card.title}</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900">${Math.floor(card.value)}</div>
            </div>

            {expandedCard === card.id && (
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Formula</h4>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap text-gray-800">
                    {card.formula}
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Breakdown</h4>
                  <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
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
                                <span className="font-medium text-gray-900">
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
                                      {detail.formula}
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
                                          <span className="font-medium text-gray-900">
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
                            <span className="font-medium text-gray-900">{detail.value}</span>
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
