import api from './api';

export const barberService = {
  getAll: () => api.get('/barbers'),
  getOne: (userId) => api.get(`/barbers/${userId}`),
  updateProfile: (data) => api.put('/barbers/profile', data),
  getStats: (userId) => api.get(`/barbers/stats/${userId}`),
};