import api from './api';

export const adminService = {
  // Obtener nómina, estadísticas y servicios recolectados
  getPayrollStats: (params) => api.get('/admin/payroll-stats', { params }),

  // Registrar liquidación / pago de comisiones
  payoutAppointments: (data) => api.put('/admin/payout', data),

  // Actualizar comisión de un barbero
  updateBarberCommission: (barberId, commissionRate) =>
    api.put(`/admin/barbers/${barberId}/commission`, { commissionRate }),

  // Obtener citas con paginación
  getAllAppointments: (params) => api.get('/appointments', { params }),
};
