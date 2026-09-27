import api from './api';
import { supabaseService } from './supabaseService';
import { isSupabaseConfigured } from './supabaseClient';

export const appointmentService = {
  create: async (data) => {
    if (isSupabaseConfigured()) {
      try {
        const result = await supabaseService.createAppointment(data);
        if (result) return result;
      } catch (err) {
        console.warn('Error creando cita en Supabase:', err);
      }
    }
    return api.post('/appointments', data);
  },
  getAvailableSlots: (params) => api.get('/appointments/available-slots', { params }),
  getMyAppointments: (params) => api.get('/appointments/my-appointments', { params }),
  getBarberAppointments: async (params) => {
    if (isSupabaseConfigured()) {
      try {
        const appointments = await supabaseService.getBarberAppointments(params?.barberId, params?.date);
        if (appointments) return { appointments };
      } catch (err) {
        console.warn('Error obteniendo citas de barbero en Supabase:', err);
      }
    }
    return api.get('/appointments/barber-appointments', { params });
  },
  getAll: (params) => api.get('/appointments', { params }),
  getStats: (params) => api.get('/appointments/stats', { params }),
  cancel: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
  updateStatus: async (id, status) => {
    if (isSupabaseConfigured()) {
      try {
        const result = await supabaseService.updateAppointmentStatus(id, status);
        if (result) return { appointment: result };
      } catch (err) {
        console.warn('Error actualizando estado en Supabase:', err);
      }
    }
    return api.put(`/appointments/${id}/status`, { status });
  },
};