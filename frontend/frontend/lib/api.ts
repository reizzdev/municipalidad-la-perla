import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
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