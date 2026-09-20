import axios from 'axios';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://municipalidad-la-perla-production.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el JWT automáticamente en cada request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('muni_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token expiró, limpiar sesión
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('muni_token');
      localStorage.removeItem('muni_area');
    }
    return Promise.reject(err);
  },
);

export default api;