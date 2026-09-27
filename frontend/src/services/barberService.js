import api from './api';
import { supabaseService } from './supabaseService';
import { isSupabaseConfigured } from './supabaseClient';

export const barberService = {
  getAll: async () => {
    if (isSupabaseConfigured()) {
      try {
        const barbers = await supabaseService.getBarbers();
        if (barbers) return { barbers };
      } catch (err) {
        console.warn('Error obteniendo barberos de Supabase:', err);
      }
    }
    return api.get('/barbers');
  },
  getOne: (userId) => api.get(`/barbers/${userId}`),
  updateProfile: (data) => api.put('/barbers/profile', data),
  getMyStats: (params) => api.get('/barbers/stats/me', { params }),
  getStats: (userId = 'me', params) => api.get(`/barbers/stats/${userId}`, { params }),
};