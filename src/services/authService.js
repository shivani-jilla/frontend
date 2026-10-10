import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('learnhub_token', response.data.token);
      localStorage.setItem('learnhub_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.token) {
      localStorage.setItem('learnhub_token', response.data.token);
      localStorage.setItem('learnhub_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('learnhub_token');
    localStorage.removeItem('learnhub_user');
  },

  getStoredUser: () => {
    try {
      const userStr = localStorage.getItem('learnhub_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem('learnhub_token');
  },
};
