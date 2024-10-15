import app from 'admin/main';
import axios from 'axios';

// Instance of axios to be used for all API requests.
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(async config => {
  const token =
    await app.config.globalProperties.$auth0.getAccessTokenSilently();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err?.response?.status !== 401) throw err;
  app.config.globalProperties.$auth0.logout();
  localStorage.clear();
  window.location.replace('/');
});

export default client;
