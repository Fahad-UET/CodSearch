import { useState, useEffect } from 'react';
import { fetchExchangeRates } from '../services/currency/api';
import { CURRENCIES, DEFAULT_RATES } from '../services/currency/constants';

export function useCurrencyRates() {
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_RATES);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newRates = await fetchExchangeRates(Object.keys(CURRENCIES));
      setRates(newRates);
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      setError('Using default rates');
      setRates(DEFAULT_RATES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    updateRates();
    // Update rates every hour
    const interval = setInterval(updateRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  return {
    rates,
    lastUpdated,
    isLoading,
    error,
    updateRates
  };
}