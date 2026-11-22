import axios from 'axios';

// When deployed on Vercel, set VITE_API_BASE_URL to your deployed Spring Boot API URL (e.g. on Render/Railway)
// In local development, leaving it empty uses the Vite dev server proxy to localhost:8080
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);
