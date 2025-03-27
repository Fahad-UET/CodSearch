import React, { useState } from 'react';
import { Calculator, X, ArrowRight, ToggleLeft, ToggleRight, Settings, Sliders, Sigma } from 'lucide-react';
import { BreakEvenTab } from './tabs/BreakEvenTab';
import { ServiceProviderSection } from './components/ServiceProviderSection';
import { ResultsSection } from './components/ResultsSection';
import { CustomFormulasTab } from './CustomFormulasTab';
import { ServiceSettingsModal } from './components/ServiceSettingsModal';
import { PricesTab } from './PricesTab';
import { Product } from '@/types';

export function ProductAnalytics() {
  const [showAdvancedView, setShowAdvancedView] = useState(false);
  const [includeChargePerProduct, setIncludeChargePerProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // const [activeTab, setActiveTab] = useState<'prices' | 'kpi' | 'profitability' | 'formulas' | 'calculations' | 'breakeven' | 'salesPrice' | 'ROISimulator' | 'SellingPriceSimulator'>(initialTab === 'breakeven' ? 'breakeven' : 'calculations');

  return(<></>);

  // return (
  //   <div>
  //     {/* Tabs Navigation */}
  //     <div className="flex border-b border-purple-100">
  //       {/* ... other tab buttons ... */}
  //       <button
  //         onClick={() => setActiveTab('calculations')}
  //         className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
  //           activeTab === 'calculations'
  //             ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
  //             : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
  //         }`}
  //       >
  //         <div className="flex items-center justify-center gap-2">Ad Testing</div>
  //       </button>
  //       {/* Break Even Tab */}
  //       <button
  //         onClick={() => setActiveTab('breakeven')}
  //         className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
  //           activeTab === 'breakeven'
  //             ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
  //             : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
  //         }`}
  //       >
  //         <div className="flex items-center justify-center gap-2">
  //           <Calculator size={16} />
  //           Break Even
  //         </div>
  //       </button>
  //       {product.category === 'PRODUCT_SELLER' && (
  //         <button
  //           onClick={() => setActiveTab('salesPrice')}>
  //           </button>
  //         )}
  //     </div>

  //     {/* Content Area */}
  //     <div className="p-6 max-h-[calc(90vh-129px)] overflow-y-auto">
  //       {activeTab === 'prices' && (
  //         <PricesTab />
  //       )}
  //       {/* ... other tab contents ... */}
  //       {activeTab === 'calculations' && <AdTestingTab />}
  //       {activeTab === 'breakeven' && (
  //         <BreakEvenTab product={product} />
  //       )}
  //       {activeTab === 'salesPrice' && (
  //         <SalesPriceTab
  //           intialCountry={selectedCountry}
  //           // ... rest of the tab content
  //         />
  //       )}
  //       {activeTab === 'formulas' && (
  //         <CustomFormulasTab
  //           product={product}
  //           variables={formulaVariables}
  //         />
  //       )}
  //     </div>
  //   </div>
  // );
}