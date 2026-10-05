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
  getMyStats: async (params) => {
    if (isSupabaseConfigured()) {
      return {
        data: {
          cutsToday: 0, revenueToday: 0, cutsThisWeek: 0, revenueThisWeek: 0,
          cutsThisMonth: 0, revenueThisMonth: 0, pendingToday: 0, totalScheduledToday: 0
        }
      };
    }
    return api.get('/barbers/stats/me', { params });
  },
  getStats: (userId = 'me', params) => api.get(`/barbers/stats/${userId}`, { params }),
};

