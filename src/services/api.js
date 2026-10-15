import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://backend-hbwv.onrender.com/api'
    : '/api');

// Auto-correct typo from Vercel environment variable (hbww -> hbwv)
if (typeof rawBaseUrl === 'string' && rawBaseUrl.includes('backend-hbww.onrender.com')) {
  rawBaseUrl = rawBaseUrl.replace('backend-hbww.onrender.com', 'backend-hbwv.onrender.com');
}

const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learnhub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on authentication failure
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('learnhub_token');
        localStorage.removeItem('learnhub_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
