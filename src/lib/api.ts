import axios from 'axios';

import { useAuthStore } from '@/features/auth/store/authStore';

export const apiClient = axios.create({
  baseURL: "http://127.0.0.1:5000/api/v1",
  withCredentials: true,
});

// Add request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g. logout or redirect)
    }
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
