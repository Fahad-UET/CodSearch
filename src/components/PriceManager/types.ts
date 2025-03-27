export interface PriceFormData {
  purchasePrice: number;
  salePrice: number;
  country: string;
  productType: 'cosmetic' | 'gadget';
  serviceType: 'withCallCenter' | 'withoutCallCenter';
}

export interface PriceCalculationResult {
  profit: number;
  margin: number;
  breakEvenPoint: number;
  roi: number;
}

export interface CustomFormulasTabProps {
  variables: {
    purchasePrice: number;
    salePrice: number;
    stock: number;
    leads: number;
    cpc: number;
    chargePerProduct: number;
    [key: string]: number;
  };
}