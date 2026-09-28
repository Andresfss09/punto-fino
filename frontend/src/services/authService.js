import api from './api';
import { supabaseService } from './supabaseService';
import { isSupabaseConfigured } from './supabaseClient';

export const authService = {
  register: async (data) => {
    if (isSupabaseConfigured()) {
      return await supabaseService.register(data);
    }
    return api.post('/auth/register', data);
  },
  login: async (data) => {
    if (isSupabaseConfigured()) {
      return await supabaseService.login(data.email, data.password);
    }
    return api.post('/auth/login', data);
  },
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
};