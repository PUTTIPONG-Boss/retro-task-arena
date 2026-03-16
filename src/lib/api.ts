import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed later (e.g. for Auth tokens)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
