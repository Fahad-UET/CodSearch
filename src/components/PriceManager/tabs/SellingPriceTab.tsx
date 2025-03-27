import React, { useEffect, useMemo, useState } from 'react';
import {
  DollarSign,
  Calculator,
  ArrowRight,
  Settings,
  Building,
  Globe,
  Users,
  Package2,
  Plus,
  X,
  ShoppingCart,
} from 'lucide-react';

import { SourcingCalculator } from '../../SourcingCalculator';
import { useServiceProviderStore } from '../../../store/serviceProviderStore';
import { useKpiStore } from '../../../store/kpiStore';
import { COUNTRIES, countriesDefaultList } from '../../../services/codNetwork/constants';
import { SalesPriceAnalysis } from '../components/SalesPriceAnalysis';
import { useCurrencyDisplay } from '../../../hooks/useCurrencyDisplay';
import { AnalyticsDiagrams } from '../components/AnalyticsDiagrams';
import { useProductStore } from '../../../store';
import { updateProduct as updateProductService } from '../../../services/firebase';
import { MonthlyChargesModal } from '../../MonthlyChargesModal';
import { SalesPriceAnalysisPurchaseCalculation } from '../components/SalesPriceAnalysis-PurchaseCal';
import {
  createOrUpdateDefaultPrice,
  getDefaultPriceByUserIdAndCountry,
} from '@/services/firebase/deafultCountries';
import { useGobalValuesStore } from '@/store/globalValues';
import { getUserMonthlyCharges } from '@/services/firebase/monthlyCharges';
import { getCredits, updateCredits } from '@/services/firebase/credits';
import CreditsInformation from '@/components/credits/CreditsInformation';
import { Product } from '@/types';

// import { createDefaultCountryValues } from '@/services/firebase/deafultCountries';

interface SalesPriceTabProps {
  intialCountry: string;
  onPriceCalculated: (price: number) => void;
  productId: string;
  product: Product;
}

type DefaultItem = {
  value: number;
  id: number;
};

type Country = {
  name: string;
  key: string;
  currency: string;
  default: DefaultItem[];
};

const SettingIcon = ({ onclick }: { onclick: () => void }) => {
  return (
    <div
      className="p-2.5 rounded-lg border-2 border-purple-200/50  ring-white/50 shadow-md group-hover:scale-110 transition-transform duration-200"
      onClick={onclick}
    >
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
        className="lucide lucide-settings w-5 h-5 text-purple-600"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </div>
  );
};

export function SellingPriceTab({
  intialCountry,
  onPriceCalculated,
  productId,
  product,
}: SalesPriceTabProps) {
  const commissionTitles = {
    'Per Lead': 'Target Leads',
    'Per Deliverd': 'Target Orders Delivered',
    'Per Confirmed': 'Target Orders Confirmed',
  };
  const { updateProduct } = useProductStore();
  const {
    monthlyCharge,
    setMonthlyCharge,
    defaultValueComissionType,
    setdefaultValueComissionType,
  } = useGobalValuesStore();

  const comissionTypeTitle = commissionTitles[defaultValueComissionType] || 'Target Stock';
  const [selectedCountry, setSelectedCountry] = useState(product.country);
  const { convertToUSD: convertToUSDLocal, currencySymbol } = useCurrencyDisplay(selectedCountry);
  const { convertToUSD, convertFromUSD, convertToEUR, convertEURToUsd } = useCurrencyDisplay('MAR');

  const [productType, setProductType] = useState(product.productType);

  const [countryDefaultList, setCountryDefaultList] = useState<Country[]>(countriesDefaultList);
  const [showCalculator, setShowCalculator] = useState(false);
  const [salePrice, setSalePrice] = useState<number>(product?.price?.salePrice || 0);
  const [salePriceCountry, setSalePriceCountry] = useState<any>(
    Number(product?.price?.salePriceCountry?.split(' ')[0]) || 0
  );
  const [purchasePrice, setPurchasePrice] = useState<any>(product?.price?.purchasePrice || 0);

  const [showChargesModal, setShowChargesModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [sourcingPrice, setSourcingPrice] = useState<number>(0 || product?.price?.sourcingPrice);
  const [isSaving, setIsSaving] = useState(false);
  const [profit, setProfit] = useState(false);
  const { providers, selectedProviderId, setSelectedProvider } = useServiceProviderStore();
  const { getCountrySettings } = useKpiStore();
  const { user } = useProductStore();
  const { userPackage, setPackage } = useProductStore();
  const [settings, setSettings] = useState({
    confirmationRate: product?.price?.confirmationRate || 60,
    deliveryRate: product?.price?.deliveryRate || 45,
    cpl: product?.price?.cpl || 2.5,
    monthlyProductCharges: product?.price?.monthlyProductCharges || 2.45,
    stock: product?.price?.stock || 100,
    productType: product?.price?.productType || ('cosmetic' as 'cosmetic' | 'gadget'),
    serviceType:
      product?.price?.serviceType || ('withCallCenter' as 'withCallCenter' | 'withoutCallCenter'),
    purchasePrice: purchasePrice || 0,
    fullFillment: product?.price?.fullFillment || 10,
  });
  // country conversion
  const [localCurrency, setLocalCurrency] = useState(convertFromUSD(settings?.cpl).toFixed(2));
  const [usdCurrency, setUsdCurrency] = useState(settings?.cpl);
  const [euroCurrency, setEuroCurrency] = useState(convertToEUR(settings?.cpl).toFixed(2));
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const flag = COUNTRIES[product?.country]?.flag || 'https://flagcdn.com/w320/sa.png';
  const [showCountryList, setShowCountryList] = useState(false);
  const [getDefaultCountryValues, setGetDefaultCountryValues] = useState([]);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: '', type: 'success' });
  const CreditAlert = (show: boolean, message: string, type: 'error' | 'success') => {
    setNotification({
      show,
      message,
      type,
    });
  };

  const handleToglleCountryList = () => {
    setShowCountryList(!showCountryList);
  };
  useEffect(() => {
    setSelectedCountry(product?.country);
  }, [product]);
  useEffect(() => {
    setProductType(product?.productType);
  }, [product]);

  // Handler to toggle the checkbox state
  const toggleHandler = () => {
    setIsChecked(!isChecked);
  };

  const selectedProvider = providers.find(p => p.id === selectedProviderId);
  const countrySettings = selectedProvider?.countries[selectedCountry];

  const kpiSettings = getCountrySettings(selectedCountry);

  // Calculate required leads based on stock and rates
  const requiredLeads = Math.ceil(
    settings.stock / (settings.confirmationRate / 100) / (settings.deliveryRate / 100)
  );

  // Calculate advertising costs
  const adsCosts = settings.cpl * requiredLeads;

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

    const rateCalculations = {
      'Per Lead': requiredLeads,
      'Per Deliverd': confirmedOrders / (settings.confirmationRate * settings.deliveryRate),
      'Per Confirmed': confirmedOrders / settings.confirmationRate,
    };
    const getRequiredsLeads = rateCalculations[defaultValueComissionType] || 0;

    const costBreakdowns: Record<string, any> = {
      productCosts: {
        label: 'Product Costs',
        value: purchaseCost,
        formula: `Product Costs = Purchase Price × Stock\n${Number(purchasePrice)?.toFixed(2)} × ${
          settings.stock
        } = ${Math.round(purchaseCost)}`,
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
        } = ${Math.round(getTotalReturnCost)}`,
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
        }$)) = ${Math.round(totalCallCenter)}`,
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
        } × ${codFee}%) = ${Math.round(codFees)}`,
        details: [
          { label: 'Sale Price', value: `$${Math.round(salePrice)}` },
          { label: 'Stock', value: settings.stock.toString() },
          { label: 'COD Fee Rate', value: `${codFee}%` },
          { label: 'Total COD Fees', value: `$${Math.round(codFees)}` },
        ],
      },
    };

    const grossProfitBreakDown: Record<string, any> = {
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
    const profitPerProduct = netProfit / settings.stock;

    const costPerDelivered = netProfit / settings.stock;
    const getProfitMargin =
      salePrice > 0 && costPerDelivered > 0 ? (costPerDelivered / salePrice) * 100 : 0;

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
      profitPerProduct,
      productCosts,
      shippingCost,
      getTotalReturnCost,
      totalCallCenter,
      codFees,
      purchaseCost,
      getProfitMargin,
      getRequiredsLeads,
    };
  }, [
    settings,
    countrySettings,
    salePrice,
    sourcingPrice,
    purchasePrice,
    defaultValueComissionType,
  ]);

  const handleSaveSalePrice = async () => {
    const credits = await getCredits(user?.uid, 'priceChanges');
    if (!credits) {
      CreditAlert(true, 'You do not have enough credits. Please purchase more.', 'error');
      return;
    }
    try {
      setIsSaving(true);
      const totalExpenses = metrics.advertisingCost + metrics.totalCosts;
      const getCalculateRio = (metrics?.netProfit / totalExpenses) * 100;
      const costPerDelivered = metrics?.netProfit / settings.stock;
      const getProfitMargin =
        salePrice > 0 && costPerDelivered > 0 ? (costPerDelivered / salePrice) * 100 : 0;

      const kpiValues = {
        ...settings,
        // sourcingPrice: sourcingPrice,
        salePrice,
        salePriceCountry: `${salePriceCountry} ${
          salePriceCountry.toString().includes(countryListCurrency.currency)
            ? ''
            : countryListCurrency.currency
        }`,
        purchasePrice,
        profit,
        profitPerProduct: metrics?.profitPerProduct,
        profitMargin: getProfitMargin.toFixed(1),
        roiPercentage: getCalculateRio.toFixed(1),
        totalRevenue: metrics?.totalSales?.toFixed(1),
        totalProfit: metrics?.netProfit.toFixed(1),
        grossProfit: metrics.netProfit,
        deliveredOrders: metrics.deliveredOrders,
        totalExpenses,
        stockInvestment: 30,
        costPerDelivered,
        requiredLeads: metrics.getRequiredsLeads,
        advertisingCost: metrics.advertisingCost,
        totalSales: {
          totalSales: metrics.totalSales,
          salesPrice: salePrice,
          stock: settings.stock,
        },
        advertisement: {
          totalAdvertisementCost: metrics.advertisingCost,
          requiredLeads: metrics.getRequiredsLeads,
          costPerLead: settings.cpl,
        },
        netProfit: {
          totalNetProfit: metrics.netProfit,
          grossprofit: metrics.grossProfit,
          operatingExpenses: metrics.operatingExpense,
        },
        companyServicesFee: {
          totalCost: metrics.totalCosts,
          totalProductCost: metrics.purchaseCost,
          shippingCost: metrics.shippingCost,
          totalReturnCost: metrics.getTotalReturnCost,
          totalCallCenterFees: metrics.totalCallCenter,
          totalCodFees: metrics.codFees,
        },
      };
      const updatedProduct = await updateProductService(productId, { price: kpiValues });
      let userId = user?.uid;
      // const addDeafultCountryValues = await createDefaultCountryValues(userId, selectedCountry, {
      //   default: getDefaultCountryValues,
      // });
      updateProduct(productId, { price: kpiValues });
      const result = await updateCredits(user?.uid, 'priceChanges');
      setPackage(userPackage.plan, result.toString());
    } catch (error) {
      setIsSaving(false);
      console.error('Error saving sale price', error);
    } finally {
      setIsSaving(false);
    }
  };

  const countryListCurrency = useMemo(() => {
    const country = countryDefaultList.find(item => item.key === selectedCountry);
    return country || null;
  }, [selectedCountry, countryDefaultList]);

  useEffect(() => {
    const fetchDefaultPrice = async () => {
      const selectedCountryData = countryDefaultList?.find(item => item?.key === selectedCountry);

      try {
        const data: any = await getDefaultPriceByUserIdAndCountry(user.uid, selectedCountry);

        // Filter out items where value === 0
        const filteredValues = (data?.defaultValues || selectedCountryData?.default || []).filter(
          item => item.value !== 0
        );

        setGetDefaultCountryValues(filteredValues);
      } catch (error) {
        console.error('Error fetching default price:', error);

        // Handle fallback filtering for selectedCountryData default values
        const filteredDefaultValues = (selectedCountryData?.default || []).filter(
          item => item.value !== 0
        );

        setGetDefaultCountryValues(filteredDefaultValues);
      }
    };

    fetchDefaultPrice();
  }, [selectedCountry, countryDefaultList, user.uid]);

  const handleAddItem = async () => {
    if (!countryListCurrency) return;

    try {
      // Get existing data for the selected country
      const data: any = await getDefaultPriceByUserIdAndCountry(user.uid, selectedCountry);

      // Determine the current default values and the new item's ID
      const currentDefaultValues = data?.defaultValues || [];
      const newId = getDefaultCountryValues?.length + 1;

      // Create the new default item
      const newItem = { value: 0, id: newId };

      // Update local state to reflect the added item
      setGetDefaultCountryValues(prevValues => [...prevValues, newItem]);
    } catch (error) {
      console.error('Error adding new item:', error);
    }
  };
  const handleDeleteValue = async (id: number) => {
    try {
      // Filter out the item with the matching ID
      const updatedDefaultValues = getDefaultCountryValues.filter(item => item.id !== id);

      // Update Firestore with the new defaultValues array
      const data = await createOrUpdateDefaultPrice({
        userId: user.uid,
        country: selectedCountry,
        defaultValues: updatedDefaultValues,
      });

      if (data) {
        // Update local state
        setGetDefaultCountryValues(updatedDefaultValues);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveValue = async (id: number) => {
    try {
      if (!tempValue.trim()) return; // Do not save if the input is empty

      const newValue = parseInt(tempValue, 10);
      if (!isNaN(newValue)) {
        // Update Firestore with the new defaultValues array
        const updatedDefaultValues = getDefaultCountryValues.map(item =>
          item.id === id ? { ...item, value: newValue } : item
        );

        const data = await createOrUpdateDefaultPrice({
          userId: user.uid,
          country: selectedCountry,
          defaultValues: updatedDefaultValues,
        });

        if (data) {
          // Update local state
          setGetDefaultCountryValues(updatedDefaultValues);
        }
      }

      setEditingId(null); // Exit edit mode
      setTempValue(''); // Clear the temporary value
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(event.target.value); // Update the temp value as the user types
  };

  const handleInputBlur = (id: number) => {
    handleSaveValue(id); // Save the value when the input loses focus
  };
  const handleDelete = (id: number) => {
    setCountryDefaultList(prevCountries =>
      prevCountries.map(country => {
        if (country.key === selectedCountry) {
          return {
            ...country,
            default: country.default.filter(item => item.id !== id), // Remove item by id
          };
        }
        return country;
      })
    );
  };

  const totalExpenses = metrics.advertisingCost + metrics.totalCosts;

  const getCalculateRoi = useMemo(() => {
    if (totalExpenses > 0 && metrics?.netProfit !== undefined) {
      return (metrics?.netProfit / totalExpenses) * 100;
    }
    return 0; // Return 0 if there's an issue with the expenses or netProfit
  }, [metrics?.netProfit, totalExpenses]);

  useEffect(() => {
    const fetchUserMonthDetails = async () => {
      const MonthlyDetails: any = await getUserMonthlyCharges(user.uid);

      // Ensure settingsState is always a number
      let settingsState = isChecked
        ? MonthlyDetails?.[0]?.chargePerProduct
          ? Number(MonthlyDetails?.[0]?.chargePerProduct).toFixed(2)
          : 2.45
        : 0;

      // Convert settingsState back to a number (if needed)
      setSettings(prev => ({
        ...prev,
        monthlyProductCharges: Number(settingsState),
      }));
    };

    fetchUserMonthDetails();
  }, [isChecked]);

  return (
    <div>
      {/* default price section */}
      <div className="w-full bg-gradient-to-br from-indigo-50/90 via-purple-50/80 to-violet-50/90 backdrop-blur-sm border-2 border-indigo-200/50 rounded-xl p-4 shadow-lg mb-6">
        <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-700">
          Selling price
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-1/4 relative">
            <input
              type="number"
              min="0"
              step="0.01"
              value={Math.floor(salePriceCountry)}
              // disabled={!sourcingPrice}
              onChange={e => {
                setSalePriceCountry(e.target.value);
                const numValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
                if (!isNaN(numValue)) {
                  const usdPrice = convertToUSDLocal(numValue);
                  setSalePrice(usdPrice);
                }
              }}
              className="w-full px-4 py-2.5 text-xl font-medium bg-white/90 border-2 border-indigo-200/50 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 appearance-none focus:appearance-none"
              placeholder="0.00"
            />
            <p className="font-bold text-lg text-indigo-600 absolute right-2 top-2.5">
              {countryListCurrency.currency}
            </p>
          </div>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1">
            {getDefaultCountryValues?.map(item => (
              <div key={item.id} className="flex items-center gap-2">
                {editingId === item.id ? (
                  <input
                    type="number"
                    value={tempValue}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur(item.id)} // Save the value on blur
                    onKeyDown={event => {
                      if (event.key === 'Enter') handleSaveValue(item.id); // Save on Enter
                    }}
                    className="px-2 py-1 border rounded w-24"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => {
                      if (item.value === 0) {
                        setEditingId(item.id); // Enter edit mode for empty values
                        setTempValue(''); // Clear temp value
                      } else {
                        setSalePriceCountry(item.value);
                        const usd = convertToUSDLocal(item.value);
                        setSalePrice(usd);
                      }
                    }}
                    className="px-3 py-2 font-medium text-sm rounded-lg transition-all duration-200 flex-shrink-0 bg-white/80 text-indigo-600 hover:bg-white border border-indigo-200/50 hover:border-indigo-300 relative group" // `group` class here
                  >
                    <button
                      className="absolute right-[1px] top-[0px] opacity-0 group-hover:opacity-100 transition-opacity duration-200" // Hover effect for delete icon
                      onClick={e => {
                        e.stopPropagation(); // Prevent the parent button's onClick from firing
                        handleDeleteValue(item.id);
                      }}
                    >
                      <X size={14} />
                    </button>
                    {item.value === 0
                      ? 'Set Value'
                      : `${item.value} ${countryListCurrency.currency}`}
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleAddItem}
              className="px-3 py-2 rounded-lg bg-white/80 text-indigo-600 hover:bg-white border border-indigo-200/50 hover:border-indigo-300 hover:scale-105 transition-all duration-200 flex-shrink-0"
            >
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-between gap-9 ">
        <div className="w-[40%] bg-gradient-to-br from-violet-50 via-indigo-50/50 to-purple-50/30 rounded-xl p-4 shadow-lg border-2 border-indigo-200/50 backdrop-blur-sm flex flex-col">
          {/* Header with "Parameters" title */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-purple-700">
              Parameters
            </h3>

            {/* Country and gadget info */}
            <div
              onClick={() => handleToglleCountryList()}
              className="relative flex items-center gap-2 bg-white/90 px-5 py-3 rounded-full shadow-sm border border-gray-100"
            >
              <img src={flag} alt="us" className="w-8 h-8 rounded object-cover " />
              <span className="text-sm font-medium capitalize">{selectedCountry}</span>

              <div className="flex items-center gap-2 text-gray-600">
                {/* Smartphone icon */}
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
                  className="lucide lucide-smartphone w-4 h-4"
                >
                  <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                  <path d="M12 18h.01"></path>
                </svg>
                {/* Gadget label */}
                <span className="text-sm font-medium capitalize">{productType}</span>
              </div>
              {showCountryList && (
                <div className="absolute z-20 max-h-[220px] overflow-y-scroll scrollbar-hide left-0 right-0 top-[60px] bg-white/100 px-5 py-3 rounded-lg shadow-sm border border-gray-100">
                  {Object.values(COUNTRIES)?.map(item => {
                    return (
                      <div
                        className="cursor-pointer"
                        onClick={() => handleToglleCountryList()}
                        key={item?.name}
                        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
                      >
                        <img
                          src={item?.flag}
                          alt={`${item?.name} flag`}
                          className="w-8 h-8 rounded object-cover "
                        />
                        <span className="text-sm font-medium capitalize ml-2">{item.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-end gap-2 mb-3">
            {/* Monthly Product Charges */}
            {isChecked ? (
              <div className="w-full ">
                <label className="block text-xs text-gray-500 mb-1">
                  Monthly Charges Per Delivered
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-sm border-2 border-purple-200/50 rounded-lg bg-white/80 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
                  min="0"
                  step="0.01"
                  value={settings.monthlyProductCharges}
                  disabled
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      monthlyProductCharges: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            ) : (
              <div className="w-full">
                <label className="block text-xs text-gray-500 mb-1">
                  Monthly Charges Per Delivered Enabled by toggle
                </label>
              </div>
            )}
            <div className="flex justify-between items-center gap-2">
              <div className="mt-3">
                {/* toggle */}
                <label className="inline-flex items-center cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={toggleHandler}
                    className="sr-only peer"
                  />
                  <div
                    className={`relative w-7 h-4 bg-gray-200 rounded-full transition-all duration-300
      ${isChecked ? '!bg-[#9333EA]' : 'bg-gray-700'}
      peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800`}
                  >
                    <div
                      className={`absolute top-[1px] left-[1px] bg-white border-gray-300 border rounded-full h-3 w-3 transition-all duration-300
        ${isChecked ? 'translate-x-full border-white' : ''}`}
                    />
                  </div>
                </label>
              </div>
              <button onClick={() => setMonthlyCharge(true)}>
                <SettingIcon onclick={() => setShowChargesModal(true)} />
              </button>
            </div>
          </div>
          {/* Cost Per Lead */}
          <div className="space-y-2 border border-purple-500 rounded-lg p-3 mb-3">
            <label className="text-sm font-medium text-purple-600">Cost Per Lead (CPL)</label>
            <div className="bg-purple-50/90 rounded-xl">
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    // step="0.1"
                    className="w-full px-3 py-2 text-sm font-medium border-2 border-purple-200 rounded-lg bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 pr-8"
                    // min="0"
                    value={localCurrency}
                    onChange={e => {
                      setLocalCurrency(e.target.value);
                      const convertedValue = convertToUSD(Number(e.target.value));
                      setUsdCurrency(prev => convertedValue?.toFixed(2));
                      const euroValue = convertToEUR(convertedValue);
                      setEuroCurrency(euroValue?.toFixed(2));
                    }}
                    // value={settings.cpl}
                    // onChange={handleCPLChange}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 font-medium">
                    DH
                  </span>
                </div>
                {/* Cost in USD */}
                <div className="relative">
                  <input
                    type="number"
                    // step="0.1"
                    className="w-full px-3 py-2 text-sm font-medium border-2 border-purple-200 rounded-lg bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 pr-8"
                    value={usdCurrency}
                    onChange={e => {
                      setUsdCurrency(e.target.value);
                      const convertLocal = convertFromUSD(Number(e.target.value));
                      setLocalCurrency(convertLocal?.toFixed(2));
                      const euroValue = convertToEUR(Number(e.target.value));
                      setEuroCurrency(euroValue?.toFixed(2));
                    }} // Update USD value when changed
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 font-medium">
                    $
                  </span>
                </div>
                {/* Cost in EUR */}
                <div className="relative">
                  <input
                    type="number"
                    // step="0.1"
                    className="w-full px-3 py-2 text-sm font-medium border-2 border-purple-200 rounded-lg bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 pr-8"
                    value={euroCurrency}
                    onChange={e => {
                      setEuroCurrency(e.target.value);
                      const usdConvert = convertEURToUsd(Number(e.target.value));
                      setUsdCurrency(() => usdConvert.toFixed(2));
                      const convertLocal = convertFromUSD(usdConvert);
                      setLocalCurrency(convertLocal?.toFixed(2));
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 font-medium">
                    €
                  </span>
                </div>
              </div>
              <p className="text-xs text-purple-500 mt-2">
                Enter the cost per lead in any currency - values will automatically convert
              </p>
            </div>
          </div>
          {/* Service Configuration Section */}
          <div className="flex-1 space-y-3">
            <div className="flex justify-between gap-3">
              <div className="bg-white/80 w-[50%] rounded-xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-purple-600">Service Configuration</h4>
                  <button className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
                    {/* Settings Icon */}
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
                      className="lucide lucide-settings w-4 h-4"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                </div>

                {/* Service Configuration Fields */}
                <div className="space-y-3">
                  {/* Service Provider */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Service Provider</label>

                    <select
                      value={selectedProviderId}
                      onChange={e => setSelectedProvider(e.target.value)}
                      className="w-full px-3 py-2 outline-none text-sm border-2 border-purple-200/50 rounded-lg bg-white/80 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
                    >
                      {providers.map(provider => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Service Type */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Service Type</label>
                    <select
                      className="w-full outline-none px-3 py-2 text-sm border-2 border-purple-200/50 rounded-lg bg-white/80 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
                      value={settings.serviceType}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          serviceType: e.target.value as 'withCallCenter' | 'withoutCallCenter',
                        }))
                      }
                    >
                      <option value="withCallCenter">With Call Center</option>
                      <option value="withoutCallCenter">Without Call Center</option>
                    </select>
                  </div>
                  {/* Target Stock */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">{comissionTypeTitle}</label>
                    <input
                      min="0"
                      type="number"
                      className="w-full px-3 py-2 text-sm border-2 border-purple-200/50 rounded-lg bg-white/80 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
                      value={settings.stock}
                      onChange={e =>
                        setSettings(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                  {/* fulfil */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Fullfilment Cost</label>
                    <input
                      min="0"
                      type="number"
                      className="w-full px-3 py-2 text-sm border-2 border-purple-200/50 rounded-lg bg-white/80 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
                      value={settings.fullFillment}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          fullFillment: parseInt(e.target.value) || 10,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Performance Metrics Section */}
              <div className="bg-white/80 w-[50%] rounded-xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-purple-600">Performance Metrics</h4>
                </div>

                {/* Performance Metrics Fields */}
                <div className="space-y-3">
                  {/* Confirmation Rate */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Confirmation Rate (%)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 text-sm border-2 border-purple-200/50 rounded-lg bg-white/80 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
                      max="100"
                      value={settings.confirmationRate}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          confirmationRate: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>

                  {/* Delivery Rate */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Delivery Rate (%)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 text-sm border-2 border-purple-200/50 rounded-lg bg-white/80 focus:border-purple-300 focus:ring-2 focus:ring-purple-200 focus:ring-opacity-50"
                      min="0"
                      max="100"
                      value={settings.deliveryRate}
                      onChange={e =>
                        setSettings(prev => ({
                          ...prev,
                          deliveryRate: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Required Leads and Advertising Cost */}
          <div className="mt-6 pt-4 border-t border-purple-200/30">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-purple-600 font-medium">Required Leads</span>
              <span className="text-xl font-bold text-purple-600">
                {/* {requiredLeads} */}
                {Math.floor(metrics?.getRequiredsLeads) || 0}
              </span>
            </div>
            {/* <div className="text-xs text-gray-600">
              Advertising Cost:{' '}
              <span className="text-purple-600 font-medium"> ${Math.floor(adsCosts)}</span>
            </div> */}
          </div>
        </div>
        <div className="w-[60%] ">
          <div className="w-full flex justify-between items-stretch gap-4">
            {/* Selling Price Card */}
            <div className="bg-gradient-to-br w-full from-violet-500 to-purple-600 rounded-xl p-4 text-white shadow-lg border border-white/20">
              <h3 className="text-sm font-medium opacity-80 mb-2">Sele Price</h3>
              <div>
                <div className="text-2xl font-medium">SP: ${salePrice.toFixed(2)}</div>
                <div className="text-sm opacity-80 mt-1">
                  {salePriceCountry || 0} {`${''}  ${currencySymbol}`}
                </div>
              </div>
            </div>

            {/* Purchase Price Card */}
            <div className="bg-gradient-to-br w-full from-indigo-500 to-blue-600 rounded-xl p-4 text-white shadow-lg border border-white/20">
              <h3 className="text-sm font-medium opacity-80 mb-2">Purchase Price</h3>
              {/* <div className="text-2xl font-medium mb-3">
                PP: ${`${sourcingPrice.toFixed(2) || 0}`}
              </div> */}
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={purchasePrice}
                  onChange={e => {
                    setPurchasePrice(e.target.value);
                  }}
                  className="w-full pl-7 h-12 outline-none text-2xl font-medium bg-white/10 border-2 border-white/20 rounded-[8px] text-white placeholder-white/50 focus:border-white focus:ring-2 focus:ring-white/20"
                  placeholder="0.00"
                />
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 text-xl">
                  <DollarSign size={18} />
                </span>
              </div>
            </div>

            {/* Profit Per Produc Card */}
            <div className="bg-gradient-to-br w-full from-teal-500 to-emerald-600 rounded-xl p-4 text-white shadow-lg border border-white/20">
              <h3 className="text-sm font-medium opacity-80 mb-2">Profit Per Product</h3>
              <div className="text-2xl font-medium">
                PPP:{' '}
                {salePrice && purchasePrice
                  ? settings.stock !== 0
                    ? (metrics?.netProfit / settings.stock).toFixed(2)
                    : 'Error: Stock cannot be zero'
                  : '$0'}
              </div>
              <div className="flex items-center space-x-2 mt-2">
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
                  className="lucide lucide-trending-up w-4 h-4 opacity-80"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
                <span className="text-sm">
                  PM {salePrice && purchasePrice ? metrics?.getProfitMargin.toFixed(2) : 0}%
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
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
                  className="lucide lucide-trending-up w-4 h-4 opacity-80"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
                <span className="text-sm">
                  ROI {salePrice && purchasePrice ? getCalculateRoi.toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>
          {/* save btn */}
          <div className="py-6">
            <button
              onClick={handleSaveSalePrice}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-[1.02]"
            >
              <span className="text-lg"> {isSaving ? 'Saving' : 'Save Price Changes'}</span>
            </button>
          </div>
          <CreditsInformation
            creditType={'priceChanges'}
            requiredCredits={'Credits required to save prices'}
          />
          <SalesPriceAnalysisPurchaseCalculation
            salePrice={salePrice}
            sourcingPrice={sourcingPrice}
            settings={settings}
            countrySettings={countrySettings}
            setProfit={setProfit}
            purchasePrice={purchasePrice}
            product={product}
          />
        </div>
      </div>
      {/* Analytics Diagrams */}
      {/* <AnalyticsDiagrams results={calculateResults()} /> */}
      {showCalculator && (
        <SourcingCalculator
          onClose={() => setShowCalculator(false)}
          onPriceCalculated={price => {
            setSourcingPrice(price);
            setShowCalculator(false);
          }}
          productId={product?.id}
          product={product}
        />
      )}
      {showChargesModal && <MonthlyChargesModal onClose={() => setShowChargesModal(false)} />}
    </div>
  );

  function calculateResults() {
    // Calculate orders
    const confirmedOrders = Math.round((settings.stock * settings.confirmationRate) / 100);
    const deliveredOrders = Math.round((confirmedOrders * settings.deliveryRate) / 100);
    const returnedOrders = confirmedOrders - deliveredOrders;

    // Get shipping costs based on country and service type
    const shippingCosts = countrySettings?.shippingCosts[settings.serviceType];
    const callCenterFees = countrySettings?.callCenterFees[settings.productType];

    // Calculate revenue and costs
    const totalSales = deliveredOrders * salePrice;
    const totalCosts = deliveredOrders * sourcingPrice;

    // Calculate fees
    const shippingCost = confirmedOrders * (shippingCosts?.shipping || 0);
    const returnCost = returnedOrders * (shippingCosts?.return || 0);
    const totalShipping = shippingCost + returnCost;

    // Calculate call center costs
    const leadFees = settings.stock * (callCenterFees?.lead || 0);
    const confirmationFees = confirmedOrders * (callCenterFees?.confirmation || 0);
    const deliveryFees = deliveredOrders * (callCenterFees?.delivered || 0);
    const totalCallCenter =
      settings.serviceType === 'withCallCenter' ? leadFees + confirmationFees + deliveryFees : 0;

    // Calculate COD fees
    const codFees = (totalSales * (countrySettings?.codFee || 5)) / 100;

    // Calculate totals
    const totalCostsWithFees = totalCosts + totalShipping + totalCallCenter + codFees;
    const totalProfit = totalSales - totalCostsWithFees;
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;

    return {
      totalSales,
      totalCosts: totalCostsWithFees,
      totalProfit,
      shippingCost,
      returnCost,
      totalShipping,
      totalCallCenter,
      leadFees,
      confirmationFees,
      deliveryFees,
      codFees,
      confirmedOrders,
      deliveredOrders,
      returnedOrders,
      profitMargin,
      monthlyCharges: 0,
    };
  }
}

interface SavedPriceData {
  salePrice: number;
  confirmationRate: number;
  deliveryRate: number;
  cpl: number;
  profitPerUnit: number;
}
