import axios from 'axios';

import { useAuthStore } from '@/features/auth/store/authStore';
import { getCookie } from './utils';




export const apiClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  // baseURL: "http://127.0.0.1:5001/api/v1",
  withCredentials: true,
});

// Add request interceptor to attach JWT token and CSRF token
apiClient.interceptors.request.use(
  (config) => {
    // Attach JWT token
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach CSRF token only for non-safe methods (as suggested by friend)
    const method = config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const csrfToken = getCookie('csrf_token');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // handle unauthorized
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
