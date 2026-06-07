import api from './api';

export const appointmentService = {
  create: (data) => api.post('/appointments', data),
  getAvailableSlots: (params) => api.get('/appointments/available-slots', { params }),
  getMyAppointments: (params) => api.get('/appointments/my-appointments', { params }),
  getBarberAppointments: (params) => api.get('/appointments/barber-appointments', { params }),
  cancel: (id, reason) => api.put(`/appointments/${id}/cancel`, { reason }),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
};