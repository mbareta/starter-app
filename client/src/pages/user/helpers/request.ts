import axios from 'axios';
import { useAuthStore } from 'user/stores/auth.store';

// Instance of axios to be used for all API requests.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(async config => {
  const token = useAuthStore().tokens.access_token;
  if (token) config.headers.Authorization = token;
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err?.response?.status !== 401) throw err;
  useAuthStore().logout();
  window.location.replace('/');
});

export default client;
