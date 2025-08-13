import axios from 'axios';

const API_BASE = import.meta.env.PROD 
  ? 'https://greencart-logistics-ngsg.onrender.com/api'
  : import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
console.log('API_BASE URL:', API_BASE);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Data fetching functions
export const fetchRoutes = () => api.get('/routes/').then(r => r.data);
export const fetchOrders = () => api.get('/orders/').then(r => r.data);
export const fetchDrivers = () => api.get('/drivers/').then(r => r.data);
export const fetchDashboard = () => api.get('/dashboard/').then(r => r.data);
export const runSimulation = (data) => api.post('/simulation/run/', data).then(r => r.data);
export const fetchSimulationHistory = () => api.get('/simulation/history/').then(r => r.data);

// Auth functions
export const login = (credentials) => api.post('/auth/login/', credentials).then(r => r.data);
export const register = (credentials) => api.post('/auth/register/', credentials).then(r => r.data);

// CRUD operations
export const createDriver = (data) => api.post('/drivers/', data).then(r => r.data);
export const updateDriver = (id, data) => api.put(`/drivers/${id}/`, data).then(r => r.data);
export const deleteDriver = (id) => api.delete(`/drivers/${id}/`);

export const createRoute = (data) => api.post('/routes/', data).then(r => r.data);
export const updateRoute = (id, data) => api.put(`/routes/${id}/`, data).then(r => r.data);
export const deleteRoute = (id) => api.delete(`/routes/${id}/`);

export const createOrder = (data) => api.post('/orders/', data).then(r => r.data);
export const updateOrder = (id, data) => api.put(`/orders/${id}/`, data).then(r => r.data);
export const deleteOrder = (id) => api.delete(`/orders/${id}/`);

export default api;
