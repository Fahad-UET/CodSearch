export const inputClasses = "w-full pl-8 rounded-lg bg-purple-50/50 border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 placeholder-purple-300 text-purple-900";
export const rangeClasses = "w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600";
export const selectClasses = "w-full rounded-lg bg-purple-50/50 border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-200 text-purple-900";

interface ShippingCosts {
  with: { shipping: number; return: number };
  without: { shipping: number; return: number };
}

interface CallCenterFees {
  gadget: {
    lead: number;
    confirmation: number;
    delivered: number;
  };
  cosmetic: {
    lead: number;
    confirmation: number;
    delivered: number;
  };
}

interface CountryData {
  code: string;
  name: string;
  shippingCosts: ShippingCosts;
  codFee: number;
  callCenterFees: CallCenterFees;
}

export const countries: CountryData[] = [
  {
    code: 'KSA',
    name: 'Saudi Arabia',
    shippingCosts: {
      with: { shipping: 4.99, return: 2.99 },
      without: { shipping: 6.99, return: 0 }
    },
    codFee: 5,
    callCenterFees: {
      gadget: { lead: 0.50, confirmation: 1.00, delivered: 2.00 },
      cosmetic: { lead: 0.50, confirmation: 2.00, delivered: 3.00 }
    }
  },
  {
    code: 'UAE',
    name: 'United Arab Emirates',
    shippingCosts: {
      with: { shipping: 5.99, return: 4.99 },
      without: { shipping: 6.99, return: 0 }
    },
    codFee: 5,
    callCenterFees: {
      gadget: { lead: 0.50, confirmation: 1.00, delivered: 2.00 },
      cosmetic: { lead: 0.50, confirmation: 2.00, delivered: 3.00 }
    }
  },
  // ... rest of the countries with the same structure
];

// Export shipping costs for backward compatibility
export const shippingCosts = countries.reduce((acc, country) => {
  acc[country.code] = {
    with: country.shippingCosts.with,
    without: country.shippingCosts.without
  };
  return acc;
}, {} as Record<string, { with: { shipping: number; return: number }; without: { shipping: number; return: number } }>);