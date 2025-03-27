import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalesPriceTab } from '../SalesPriceTab';
import { useServiceProviderStore } from '../../../../store/serviceProviderStore';
import { useKpiStore } from '../../../../store/kpiStore';

// Mock the stores
jest.mock('../../../../store/serviceProviderStore');
jest.mock('../../../../store/kpiStore');

// Mock the currency display hook
jest.mock('../../../../hooks/useCurrencyDisplay', () => ({
  useCurrencyDisplay: () => ({
    formatLocalPrice: (price: number) => `$${price.toFixed(2)}`,
    convertToUSD: (price: number) => price,
    convertFromUSD: (price: number) => price,
    currencySymbol: '$',
    currency: 'USD',
    rate: 1
  })
}));

// describe('SalesPriceTab', () => {
//   const mockOnPriceCalculated = jest.fn();

//   beforeEach(() => {
//     // Setup store mocks
//     (useServiceProviderStore as jest.Mock).mockReturnValue({
//       providers: [
//         {
//           id: 'cod-network',
//           name: 'COD NETWORK',
//           isDefault: true,
//           countries: {
//             SAR: {
//               shippingCosts: {
//                 withCallCenter: { shipping: 5, return: 3 },
//                 withoutCallCenter: { shipping: 6, return: 0 }
//               },
//               codFee: 5,
//               callCenterFees: {
//                 gadget: { lead: 0.5, confirmation: 1, delivered: 2 },
//                 cosmetic: { lead: 0.5, confirmation: 2, delivered: 3 }
//               }
//             }
//           }
//         }
//       ],
//       selectedProviderId: 'cod-network',
//       setSelectedProvider: jest.fn()
//     });

//     (useKpiStore as jest.Mock).mockReturnValue({
//       getCountrySettings: () => ({
//         cpc: { low: 0.5, medium: 1, high: 2 },
//         cpl: { low: 2, medium: 4, high: 6 },
//         cpm: { low: 5, medium: 10, high: 15 },
//         roas: { low: 1.5, medium: 2.5, high: 3.5 },
//         ctr: { low: 0.5, medium: 1.5, high: 2.5 },
//         confirmationRate: { low: 30, medium: 50, high: 70 },
//         deliveryRate: { low: 50, medium: 70, high: 85 },
//         profitMargin: { low: 15, medium: 30, high: 45 }
//       })
//     });
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('renders without crashing', () => {
//     render(
//       <SalesPriceTab
//         selectedCountry="SAR"
//         onPriceCalculated={mockOnPriceCalculated}
//       />
//     );

//     expect(screen.getByText('Sale Price')).toBeInTheDocument();
//     expect(screen.getByText('Calculate Price')).toBeInTheDocument();
//   });

//   it('opens calculator when calculate button is clicked', () => {
//     render(
//       <SalesPriceTab
//         selectedCountry="SAR"
//         onPriceCalculated={mockOnPriceCalculated}
//       />
//     );

//     const calculateButton = screen.getByText('Calculate Price');
//     fireEvent.click(calculateButton);

//     expect(screen.getByText('Sourcing Price Calculator')).toBeInTheDocument();
//   });

//   it('updates sale price when input changes', async () => {
//     render(
//       <SalesPriceTab
//         selectedCountry="SAR"
//         onPriceCalculated={mockOnPriceCalculated}
//       />
//     );

//     const input = screen.getByPlaceholderText('0.00');
//     await userEvent.type(input, '100');

//     expect(input).toHaveValue(100);
//   });

//   it('updates settings when dropdowns change', async () => {
//     render(
//       <SalesPriceTab
//         selectedCountry="SAR"
//         onPriceCalculated={mockOnPriceCalculated}
//       />
//     );

//     // Change product type
//     const productTypeSelect = screen.getByLabelText('Product Type');
//     await userEvent.selectOptions(productTypeSelect, 'gadget');
//     expect(productTypeSelect).toHaveValue('gadget');

//     // Change service type
//     const serviceTypeSelect = screen.getByLabelText('Service Type');
//     await userEvent.selectOptions(serviceTypeSelect, 'without');
//     expect(serviceTypeSelect).toHaveValue('without');
//   });

//   it('displays detailed analysis with correct calculations', async () => {
//     render(
//       <SalesPriceTab
//         selectedCountry="SAR"
//         onPriceCalculated={mockOnPriceCalculated}
//       />
//     );

//     // Set sale price
//     const salePriceInput = screen.getByPlaceholderText('0.00');
//     await userEvent.type(salePriceInput, '100');

//     // Check if analysis sections are rendered
//     expect(screen.getByText('Revenue Analysis')).toBeInTheDocument();
//     expect(screen.getByText('Gross Profit Analysis')).toBeInTheDocument();
//     expect(screen.getByText('Unit Economics')).toBeInTheDocument();
//     expect(screen.getByText('Total Costs Breakdown')).toBeInTheDocument();

//     // Verify formulas are displayed
//     const formulas = screen.getAllByText(/Formula/);
//     expect(formulas.length).toBeGreaterThan(0);

//     // Check detailed breakdowns
//     expect(screen.getByText('Sale Price')).toBeInTheDocument();
//     expect(screen.getByText('Stock')).toBeInTheDocument();
//     expect(screen.getByText('Total Sales')).toBeInTheDocument();
//   });

//   it('handles currency conversion correctly', async () => {
//     render(
//       <SalesPriceTab
//         selectedCountry="SAR"
//         onPriceCalculated={mockOnPriceCalculated}
//       />
//     );

//     const salePriceInput = screen.getByPlaceholderText('0.00');
//     await userEvent.type(salePriceInput, '100');

//     // Check if USD conversion is displayed
//     expect(screen.getByText('USD Conversion')).toBeInTheDocument();
//     expect(screen.getByText('$100.00')).toBeInTheDocument();
//   });

//   it('shows sourcing calculator and updates price', async () => {
//     render(
//       <SalesPriceTab
//         intialCountry="SAR"
//         onPriceCalculated={mockOnPriceCalculated}
//         product={product}
//         productId={productId}
//       />
//     );

//     const openCalculatorButton = screen.getByText('Open Calculator');
//     fireEvent.click(openCalculatorButton);

//     // Verify calculator is shown
//     expect(screen.getByText('Sourcing Price Calculator'));
//     // expect(screen.getByText('Sourcing Price Calculator')).toBeInTheDocument();

//     // Simulate price calculation
//     const calculateButton = screen.getByText('Calculate Total Price');
//     fireEvent.click(calculateButton);

//     // Verify price update callback is called
//     await waitFor(() => {
//       expect(mockOnPriceCalculated).toHaveBeenCalled();
//     });
//   });
// });