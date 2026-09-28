import api from './api';
import { supabaseService } from './supabaseService';
import { isSupabaseConfigured } from './supabaseClient';

export const serviceService = {
  getAll: async (params) => {
    if (isSupabaseConfigured()) {
      try {
        const services = await supabaseService.getServices();
        if (services) return { services };
      } catch (err) {
        console.warn('Error obteniendo servicios de Supabase:', err);
      }
    }
    return api.get('/services', { params });
  },
  getOne: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
};