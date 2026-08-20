import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
export const API_BASE_URL = (configuredApiUrl || 'http://localhost:5000').replace(/\/+$/, '');

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Attach the artisan's JWT (if present) to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('artisan_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize errors so components can just read err.message
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const responseData = err.response?.data;
    const message =
      responseData?.message ||
      (typeof responseData === 'string' && responseData.includes('<!DOCTYPE')
        ? 'The API URL is incorrect. Set VITE_API_URL to the deployed backend URL.'
        : err.message) ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Builds a full URL for a relative /uploads/... path returned by the API
export const fileUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  return `${API_BASE_URL}${relativePath}`;
};

export default client;
