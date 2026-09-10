import axios from 'axios';
import { mockAssets, mockAuditLogs } from '../data/mockData';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('truevault_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username: string, password?: string) => {
    try {
      // Use real backend endpoint
      const res = await api.post('/auth/login', { username, password });
      
      // Store JWT token on success
      if (res.data && res.data.token) {
        localStorage.setItem('truevault_token', res.data.token);
      }
      return res.data;
    } catch (e: any) {
      if (e.response && e.response.data) {
        throw new Error(e.response.data.error || 'Login failed');
      }
      throw new Error('Network error during login');
    }
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.warn('Logout API failed, proceeding with local logout');
    } finally {
      localStorage.removeItem('truevault_token');
    }
    return { message: 'Logged out successfully' };
  },

  getCurrentUser: async () => {
    try {
      const res = await api.get('/auth/me');
      return res.data;
    } catch (e) {
      localStorage.removeItem('truevault_token');
      throw e;
    }
  }
};

export const assetService = {
  getAssets: async () => {
    try {
      // Endpoint does not exist in backend yet.
      // [DEMO MODE] Fallback to mock data for demonstration.
      console.info('[DEMO MODE] /api/assets unavailable, using mock data.');
      return mockAssets;
    } catch (e) {
      return mockAssets;
    }
  },
  
  getAuditLogs: async () => {
    try {
      // Endpoint does not exist in backend yet.
      // [DEMO MODE] Fallback to mock data for demonstration.
      console.info('[DEMO MODE] /api/audit unavailable, using mock data.');
      return mockAuditLogs;
    } catch (e) {
      return mockAuditLogs;
    }
  }
};
