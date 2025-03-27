export const DEFAULT_SHIPPING_COSTS = {
  withCallCenter: { shipping: 5, return: 3 },
  withoutCallCenter: { shipping: 6, return: 0 }
};

export const DEFAULT_CALL_CENTER_FEES = {
  gadget: { lead: 0.5, confirmation: 1, delivered: 2 },
  cosmetic: { lead: 0.5, confirmation: 2, delivered: 3 }
};

export const DEFAULT_COUNTRY_SETTINGS = {
  shippingCosts: DEFAULT_SHIPPING_COSTS,
  codFee: 5,
  callCenterFees: DEFAULT_CALL_CENTER_FEES
};