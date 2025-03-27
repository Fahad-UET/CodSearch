import useSWR from 'swr';
import { codNetworkApi } from './api';
import { API_CONFIG } from './config';

export function useOrders(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
}) {
  const token = localStorage.getItem('codNetworkToken');

  const { data, error, mutate } = useSWR(
    token ? ['orders', params] : null,
    async () => {
      const response = await codNetworkApi.getOrders(params);
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    {
      refreshInterval: 30000 // 30 seconds
    }
  );

  return {
    orders: data?.data || [],
    // meta: data?.meta?.pagination,
    isLoading: !error && !data,
    error: error?.message,
    mutate
  };
}

export function useWebhookStatus() {
  const token = localStorage.getItem('codNetworkToken');

  const { data, error } = useSWR(
    token ? 'webhook-status' : null,
    async () => {
      const response = await codNetworkApi.getWebhookStatus();
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    },
    {
      refreshInterval: 60000 // 1 minute
    }
  );

  return {
    status: data?.data,
    isLoading: !error && !data,
    error: error?.message
  };
}

export function useExchangeRates() {
  const { data, error, mutate } = useSWR(
    'exchange-rates',
    async () => {
      const response = await codNetworkApi.getExchangeRates();
      if (!response.success && response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    {
      refreshInterval: 3600000, // 1 hour
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
      fallbackData: API_CONFIG.defaultRates
    }
  );

  return {
    rates: data || API_CONFIG.defaultRates,
    isLoading: !error && !data,
    error: error?.message,
    refresh: mutate
  };
}