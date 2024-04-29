import axios from 'axios';

// Instance of axios to be used for all API requests.
const client = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(config => {
  const token = localStorage.getItem('JWT');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;
