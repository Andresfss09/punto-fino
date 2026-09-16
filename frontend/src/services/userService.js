import api from './api';

export const userService = {
  getAllUsers: async (params) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  updateUserStatus: async (id, isActive) => {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data;
  }
};
