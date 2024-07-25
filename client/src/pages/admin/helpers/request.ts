import axios from 'axios';
import clerk from 'admin/helpers/clerk';

// Instance of axios to be used for all API requests.
const client = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use(async config => {
  const token = await clerk.session.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(res => res, err => {
  if (err?.response?.status !== 401) throw err;
  localStorage.clear();
  window.location.replace('/');
});

export default client;
