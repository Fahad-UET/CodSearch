import axios from 'axios';
import { API_CONFIG } from './config';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('codNetworkToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(new Error(error.message));
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('codNetworkToken');
      localStorage.removeItem('codNetworkWebhookKey');
      window.location.reload();
    }
    return Promise.reject(new Error(error.message));
  }
);

export const codNetworkApi = {
  async validateToken(token: string) {
    try {
      const response = await axios.get(`${API_CONFIG.baseUrl}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  async getExchangeRates() {
    try {
      const response = await api.get('/exchange-rates');
      return {
        success: true,
        data: response.data || API_CONFIG.defaultRates,
      };
    } catch (error) {
      return {
        success: false,
        data: API_CONFIG.defaultRates,
        error: error instanceof Error ? error.message : 'Failed to fetch exchange rates',
      };
    }
  },

  async getOrders(params = {}) {
    try {
      const response = await api.get('/seller/orders', { params });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      };
    }
  },

  async getWebhookStatus() {
    try {
      const response = await api.get('/webhook/status');
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch webhook status',
      };
    }
  },
};
