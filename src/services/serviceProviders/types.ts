export interface ShippingCosts {
  withCallCenter: {
    shipping: number;
    return: number;
  };
  withoutCallCenter: {
    shipping: number;
    return: number;
  };
}

export interface CallCenterFees {
  lead: number;
  confirmation: number;
  delivered: number;
}

export interface ServiceFees {
  gadget: CallCenterFees;
  cosmetic: CallCenterFees;
}

export interface CountrySettingsData {
  shippingCosts: ShippingCosts;
  codFee: number;
  callCenterFees: ServiceFees;
}

export interface ServiceProviderData {
  id: string;
  name: string;
  isDefault?: boolean;
  countries: {
    [key: string]: CountrySettingsData;
  };
}