import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ShoppingBag, Store, Box, Globe, Globe2, ChevronDown } from 'lucide-react';

interface shopDropdownProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  product: any;
  showCredits: boolean;
}
export default function ShopDropdown({
  activeTab,
  setActiveTab,
  product,
  showCredits,
}: shopDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shopItems = [
    {
      value: 'aliexpress',
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'AliExpress',
      count: product?.aliExpress?.length || 0,
    },
    {
      value: 'alibaba',
      icon: <Store className="w-5 h-5" />,
      label: 'Alibaba',
      count: product.aliBabaLink?.length || 0,
    },
    {
      value: '1688',
      icon: <Box className="w-5 h-5" />,
      label: '1688.com',
      count: product?.oneSix?.length || 0,
    },
    {
      value: 'amazon',
      icon: <Globe className="w-5 h-5" />,
      label: 'Amazon',
      count: product.amazon?.length || 0,
    },
    {
      value: 'other',
      icon: <Globe2 className="w-5 h-5" />,
      label: 'Other Sites',
      count: product.otherSite?.length || 0,
    },
  ];

  const calculateTab = useMemo(() => {
    const totalTabs =
      product?.aliExpress?.length ||
      0 + product.aliBabaLink?.length ||
      0 + product?.oneSix?.length ||
      0 + product.amazon?.length ||
      0 + product.otherSite?.length ||
      0;

    return totalTabs;
  }, [product]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${!showCredits ? 'relative' : ''} pl-4`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 transition-all duration-200 flex-1 justify-center text-white/90 hover:text-white hover:bg-white/10"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-sm font-medium">Reference Sites</span>
        <span className="px-2 text-sm rounded-full bg-white/10 text-white min-w-[1.75rem] text-center">
          {calculateTab}
        </span>
        <ChevronDown className="w-5 h-5" />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-1 w-48 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-md shadow-lg py-1 border border-white/10"
        >
          {shopItems.map(item => (
            <button
              key={item.label}
              onClick={() => {
                setActiveTab(item.value);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full px-3 py-1.5 ${
                activeTab !== item.value
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'bg-white text-black'
              } `}
            >
              <div className="flex items-center space-x-2.5">
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm bg-white/10 text-white px-2 rounded-full min-w-[1.75rem] text-center">
                {item.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
