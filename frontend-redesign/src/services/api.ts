import axios from 'axios';
import { mockUser, mockAssets, mockAuditLogs } from '../data/mockData';

export const api = axios.create({
  baseURL: '/api',
});

// A simple mock wrapper to fallback to mock data
export const authService = {
  login: async (walletAddress: string, password?: string) => {
    try {
      // Simulate backend call
      // const res = await api.post('/auth/login', { username: walletAddress, password });
      // return res.data;
      if (password === 'fake') throw new Error('fake');
      throw new Error('Backend not ready');
    } catch (e) {
      console.warn('Using mock login data');
      return { token: 'mock-token', user: { ...mockUser, walletAddress } };
    }
  },
  logout: async () => {
    return { message: 'Logged out successfully' };
  }
};

export const assetService = {
  getAssets: async () => {
    try {
      // const res = await api.get('/assets');
      // return res.data;
      throw new Error('Backend not ready');
    } catch (e) {
      console.warn('Using mock assets data');
      return mockAssets;
    }
  },
  getAuditLogs: async () => {
    return mockAuditLogs;
  }
};
