import api from './api';
import { isSupabaseConfigured } from './supabaseClient';

export const adminService = {
  // Obtener nómina, estadísticas y servicios recolectados
  getPayrollStats: async (params) => {
    if (isSupabaseConfigured()) {
      return {
        data: {
          summary: { totalRevenue: 0, totalCommission: 0, netProfit: 0, totalAppointments: 0, activeBarbers: 0 },
          barbersPayroll: [],
          servicesBreakdown: [],
          paymentMethods: { efectivo: 0, transferencia: 0, nequi: 0, daviplata: 0, otro: 0 },
          appointments: []
        }
      };
    }
    return api.get('/admin/payroll-stats', { params });
  },

  // Registrar liquidación / pago de comisiones
  payoutAppointments: (data) => api.put('/admin/payout', data),

  // Actualizar comisión de un barbero
  updateBarberCommission: (barberId, commissionRate) =>
    api.put(`/admin/barbers/${barberId}/commission`, { commissionRate }),

  // Obtener citas con paginación
  getAllAppointments: (params) => api.get('/appointments', { params }),
};

