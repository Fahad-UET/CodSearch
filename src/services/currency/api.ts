import { DEFAULT_RATES } from './constants';

interface ExchangeRateResponse {
  success: boolean;
  rates: Record<string, number>;
}

export async function fetchExchangeRates(currencies: string[]): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      'https://api.exchangerate.host/latest?' + new URLSearchParams({
        base: 'USD',
        symbols: currencies.join(',')
      })
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data: ExchangeRateResponse = await response.json();
    
    if (!data?.rates || Object.keys(data.rates).length === 0) {
      throw new Error('Invalid exchange rate data');
    }

    // Validate rates before returning
    const validRates = Object.entries(data.rates).reduce((acc, [code, rate]) => {
      if (typeof rate === 'number' && !isNaN(rate) && rate > 0) {
        acc[code] = rate;
      } else {
        acc[code] = DEFAULT_RATES[code] || 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return validRates;
  } catch (error) {
    console.error('Failed to fetch rates:', error);
    return DEFAULT_RATES;
  }
}