import api from './api';

export const barberService = {
  getAll: () => api.get('/barbers'),
  getOne: (userId) => api.get(`/barbers/${userId}`),
  updateProfile: (data) => api.put('/barbers/profile', data),
  getMyStats: (params) => api.get('/barbers/stats/me', { params }),
  getStats: (userId = 'me', params) => api.get(`/barbers/stats/${userId}`, { params }),
};