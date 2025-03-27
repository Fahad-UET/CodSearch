import { useState, useEffect, useCallback } from 'react';
import { COUNTRIES, NORTH_AFRICA_COUNTRIES, Countries, Country } from '../services/codNetwork/constants';
import { useExchangeRates } from '../services/codNetwork/hooks';
import { first } from 'node_modules/cheerio/lib/esm/api/traversing';

export function useCurrencyDisplay(countryCode: string, type?: string) {
  const { rates } = useExchangeRates();
  const country: Countries | Country =
    type === 'ECOM_LOCAL'
      ? NORTH_AFRICA_COUNTRIES
      : COUNTRIES[countryCode as keyof typeof COUNTRIES];
  const firstIndex = type ==='ECOM_LOCAL' ? 'MAR' : 'KSA';
  const [localRate, setLocalRate] = useState<number>(country[firstIndex]?.rate);
  const [usdToEurRate, setUsdToEurRate] = useState(0.85);

  useEffect(() => {
    // Update rate when country changes
    const newCountry =
      type === 'ECOM_LOCAL'
        ? NORTH_AFRICA_COUNTRIES
        : COUNTRIES[countryCode as keyof typeof COUNTRIES];
    if (newCountry) {
      setLocalRate(newCountry[firstIndex]?.rate);
    }
    if (rates && rates['EUR']) {
      setUsdToEurRate(rates['EUR']);
    }
  }, [countryCode, rates]);

  const formatLocalPrice = useCallback(
    (usdPrice: number) => {
      const localPrice = usdPrice * localRate;

      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: country[firstIndex]?.currency || 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(localPrice);
    },
    [country?.currency, localRate]
  );

  const convertToUSD = useCallback(
    (localPrice: number) => {
      return localPrice / localRate;
    },
    [localRate]
  );

  const convertFromUSD = useCallback(
    (usdPrice: number) => {
      return usdPrice * localRate;
    },
    [localRate]
  );

  const convertToEUR = useCallback(
    (usdPrice: number) => {
      return usdPrice * usdToEurRate;
    },
    [usdToEurRate]
  );

  const convertEURToUsd = useCallback(
    (eurPrice: number) => {
      return eurPrice / usdToEurRate;
    },
    [usdToEurRate]
  );

  const convertLocalToEuro = useCallback(
    (localPrice: number) => {
      const usdPrice = localPrice / localRate; // Convert local to USD
      return usdPrice * usdToEurRate; // Convert USD to Euro
    },
    [localRate, usdToEurRate]
  );

  return {
    formatLocalPrice,
    convertToUSD,
    convertFromUSD,
    convertToEUR,
    convertEURToUsd,
    convertLocalToEuro,
    currency: country?.currency,
    rate: localRate,
    currencySymbol: new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: country[firstIndex]?.currency || 'USD',
    })
      .format(0)
      .replace(/[\d.,\s]/g, ''),
  };
}
