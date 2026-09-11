import axios from 'axios';

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
      const res = await api.get('/assets');
      return res.data;
    } catch (e) {
      throw new Error('Failed to fetch assets');
    }
  },
  
  getAssetDetails: async (id: string) => {
    const res = await api.get(`/assets/${id}`);
    return res.data;
  },

  uploadAsset: async (formData: FormData) => {
    const res = await api.post('/assets/upload', formData); // Axios automatically sets correct headers for FormData without manual boundary
    return res.data;
  },

  verifyAsset: async (hash: string) => {
    const res = await api.get(`/assets/verify/${hash}`);
    return res.data;
  },

  downloadAsset: async (id: string) => {
    const res = await api.get(`/assets/${id}/download`, { responseType: 'blob' });
    return res.data;
  },

  getAuditLogs: async () => {
    try {
      const res = await api.get('/audit');
      return res.data;
    } catch (e) {
      throw new Error('Failed to fetch audit logs');
    }
  }
};
