import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Interceptor: agregar token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pf_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Error de conexión';
    if (error.response?.status === 401) {
      localStorage.removeItem('pf_token');
      localStorage.removeItem('pf_user');
      window.location.href = '/login';
    }
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;