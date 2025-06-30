// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add token and tenant slug from localStorage (fallback for SSR gaps)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const tenantSlug = localStorage.getItem('tenantSlug');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (tenantSlug) {
      config.headers['x-tenant-slug'] = tenantSlug;
    }
  }

  return config;
});

export default api;
