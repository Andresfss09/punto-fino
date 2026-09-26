const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/helpers');

// Helper para calcular rangos de fechas
const calculateDateRange = (period, customStart, customEnd) => {
  const now = new Date();

  if (customStart && customEnd) {
    const sParts = customStart.split('T')[0].split('-').map(Number);
    const eParts = customEnd.split('T')[0].split('-').map(Number);
    const start = new Date(sParts[0], sParts[1] - 1, sParts[2], 0, 0, 0, 0);
    const end = new Date(eParts[0], eParts[1] - 1, eParts[2], 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: `${customStart} al ${customEnd}` };
  }

  if (period === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: 'Hoy' };
  }

  if (period === 'yesterday') {
    const y = new Date(now);
    y.setDate(y.getDate() - 1);
    const start = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 0, 0, 0, 0);
    const end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: 'Ayer' };
  }

  if (period === 'week') {
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Lunes como inicio
    const start = new Date(now);
    start.setDate(now.getDate() + diff);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end, label: 'Esta Semana' };
  }

  if (period === 'last_month') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: 'Mes Pasado' };
  }

  if (period === 'all') {
    const start = new Date(2020, 0, 1, 0, 0, 0, 0);
    const end = new Date(now.getFullYear() + 2, 11, 31, 23, 59, 59, 999);
    return { startDate: start, endDate: end, label: 'Todo el Historial' };
  }

  // Por defecto: este mes
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startDate: start, endDate: end, label: 'Este Mes' };
};

// @desc    Obtener nómina, estadísticas y servicios recolectados para Administrador
// @route   GET /api/admin/payroll-stats
// @access  Private / Admin
exports.getPayrollAndStats = async (req, res) => {
  try {
    const { period = 'month', startDate: qStart, endDate: qEnd, barberId, status } = req.query;
    const { startDate, endDate, label: rangeLabel } = calculateDateRange(period, qStart, qEnd);

    // Obtener todos los barberos registrados y sus usuarios vinculados
    const barbers = await Barber.find()
      .populate('user', 'name email phone avatar isActive role')
      .lean();

    // Mapear barberos por User._id y por Barber._id
    const barberMap = new Map();
    barbers.forEach((b) => {
      const uId = b.user?._id ? b.user._id.toString() : null;
      const bId = b._id.toString();
      const rate = b.commissionRate && b.commissionRate > 0 ? b.commissionRate : 50; // 50% por defecto
      const info = {
        barberDocId: bId,
        userDocId: uId,
        name: b.user?.name || 'Barbero Steel House',
        email: b.user?.email || '',
        phone: b.user?.phone || '',
        avatar: b.user?.avatar || '',
        commissionRate: rate,
        isAvailable: b.isAvailable,
      };
      if (uId) barberMap.set(uId, info);
      barberMap.set(bId, info);
    });

    // Construir query de citas
    const aptQuery = {
      date: { $gte: startDate, $lte: endDate },
    };

    if (barberId && barberId !== 'all') {
      const bDoc = barbers.find(
        (b) => b._id.toString() === barberId || (b.user && b.user._id.toString() === barberId)
      );
      if (bDoc) {
        const ids = [bDoc._id, bDoc.user?._id].filter(Boolean);
        aptQuery.barber = { $in: ids };
      } else if (mongoose.Types.ObjectId.isValid(barberId)) {
        aptQuery.barber = new mongoose.Types.ObjectId(barberId);
      }
    }

    if (status && status !== 'todos') {
      aptQuery.status = status;
    }

    // Traer citas con populate completo
    const appointments = await Appointment.find(aptQuery)
      .populate('client', 'name email phone avatar address loyaltyPoints')
      .populate('barber', 'name email phone avatar')
      .populate('services.service', 'name price duration category')
      .sort({ date: -1, startTime: -1 })
      .lean();

    // Acumuladores de resumen global
    let totalGrossRevenue = 0;
    let totalCompletedCuts = 0;
    let totalBarbersPayout = 0;
    let totalPaidPayout = 0;
    let totalPendingPayout = 0;
    let totalPendingCuts = 0;
    let totalCancelledCuts = 0;
    const uniqueClientsSet = new Set();

    // Desglose de servicios
    const serviceStatsMap = new Map();
    // Desglose de métodos de pago
    const paymentMethodsMap = {
      efectivo: { count: 0, total: 0 },
      nequi: { count: 0, total: 0 },
      daviplata: { count: 0, total: 0 },
      transferencia: { count: 0, total: 0 },
      otro: { count: 0, total: 0 },
    };

    // Desglose por barbero
    const barberStatsAcc = {};
    barbers.forEach((b) => {
      const uId = b.user?._id ? b.user._id.toString() : b._id.toString();
      barberStatsAcc[uId] = {
        barberId: b._id.toString(),
        userId: uId,
        name: b.user?.name || 'Barbero Steel House',
        email: b.user?.email || '',
        phone: b.user?.phone || '',
        avatar: b.user?.avatar || '',
        commissionRate: b.commissionRate && b.commissionRate > 0 ? b.commissionRate : 50,
        totalCuts: 0,
        grossRevenue: 0,
        commissionAmount: 0,
        barbershopShare: 0,
        paidCommission: 0,
        pendingCommission: 0,
        appointments: [],
      };
    });

    // Enriquecer y procesar cada cita
    const enrichedAppointments = appointments.map((apt) => {
      const bKey = apt.barber?._id ? apt.barber._id.toString() : (apt.barber ? apt.barber.toString() : '');
      const bInfo = barberMap.get(bKey) || {
        name: apt.barber?.name || 'Barbero Desconocido',
        commissionRate: 50,
      };

      const rate = bInfo.commissionRate || 50;
      const price = apt.totalPrice || 0;
      const isCompleted = apt.status === 'completada';

      // Calcular comisiones del servicio
      const barberCut = isCompleted ? Math.round(price * (rate / 100)) : 0;
      const barbershopCut = isCompleted ? price - barberCut : 0;
      const isCommissionPaid = Boolean(apt.commissionPaid);

      // Cliente info
      const clientName = apt.client?.name || apt.clientName || 'Cliente Invitado';
      const clientEmail = apt.client?.email || apt.clientEmail || 'N/A';
      const clientPhone = apt.client?.phone || apt.clientPhone || 'N/A';
      const clientAddress = apt.client?.address || apt.clientAddress || 'N/A';
      const clientId = apt.client?._id ? apt.client._id.toString() : clientEmail;
      if (clientId) uniqueClientsSet.add(clientId);

      // Estado general
      if (isCompleted) {
        totalGrossRevenue += price;
        totalCompletedCuts += 1;
        totalBarbersPayout += barberCut;
        if (isCommissionPaid) {
          totalPaidPayout += barberCut;
        } else {
          totalPendingPayout += barberCut;
        }

        // Métodos de pago
        const pMethod = (apt.paymentMethod || 'efectivo').toLowerCase();
        if (paymentMethodsMap[pMethod]) {
          paymentMethodsMap[pMethod].count += 1;
          paymentMethodsMap[pMethod].total += price;
        } else {
          paymentMethodsMap.otro.count += 1;
          paymentMethodsMap.otro.total += price;
        }

        // Estadísticas de servicios
        (apt.services || []).forEach((sItem) => {
          const sName = sItem.service?.name || 'Corte / Servicio';
          const sPrice = sItem.price || sItem.service?.price || 0;
          const sCat = sItem.service?.category || 'general';

          if (!serviceStatsMap.has(sName)) {
            serviceStatsMap.set(sName, { name: sName, category: sCat, count: 0, totalRevenue: 0 });
          }
          const curr = serviceStatsMap.get(sName);
          curr.count += 1;
          curr.totalRevenue += sPrice;
        });

        // Acumular al barbero
        const targetAcc = barberStatsAcc[bKey] || Object.values(barberStatsAcc).find(x => x.name === bInfo.name);
        if (targetAcc) {
          targetAcc.totalCuts += 1;
          targetAcc.grossRevenue += price;
          targetAcc.commissionAmount += barberCut;
          targetAcc.barbershopShare += barbershopCut;
          if (isCommissionPaid) {
            targetAcc.paidCommission += barberCut;
          } else {
            targetAcc.pendingCommission += barberCut;
          }
          targetAcc.appointments.push(apt._id);
        }
      } else if (['pendiente', 'confirmada', 'en_progreso'].includes(apt.status)) {
        totalPendingCuts += 1;
      } else if (apt.status === 'cancelada') {
        totalCancelledCuts += 1;
      }

      return {
        _id: apt._id,
        confirmationCode: apt.confirmationCode || 'S/C',
        date: apt.date,
        startTime: apt.startTime,
        endTime: apt.endTime,
        totalDuration: apt.totalDuration,
        status: apt.status,
        paymentStatus: apt.paymentStatus,
        paymentMethod: apt.paymentMethod,
        totalPrice: price,
        barber: {
          _id: apt.barber?._id || bInfo.barberDocId,
          name: bInfo.name,
          email: bInfo.email,
        },
        client: {
          _id: apt.client?._id,
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          address: clientAddress,
          isGuest: apt.isGuest,
        },
        services: (apt.services || []).map((s) => ({
          name: s.service?.name || 'Servicio',
          price: s.price || s.service?.price || 0,
        })),
        commissionRate: rate,
        barberCut,
        barbershopCut,
        commissionPaid: isCommissionPaid,
        commissionPaidAt: apt.commissionPaidAt || null,
        notes: apt.notes || '',
      };
    });

    const netBarbershopEarnings = totalGrossRevenue - totalBarbersPayout;
    const averageTicket = totalCompletedCuts > 0 ? Math.round(totalGrossRevenue / totalCompletedCuts) : 0;

    const summary = {
      period,
      rangeLabel,
      startDate,
      endDate,
      totalAppointments: appointments.length,
      completedCuts: totalCompletedCuts,
      pendingCuts: totalPendingCuts,
      cancelledCuts: totalCancelledCuts,
      grossRevenue: totalGrossRevenue,
      totalBarbersPayout,
      netBarbershopEarnings,
      totalPaidPayout,
      totalPendingPayout,
      averageTicket,
      uniqueClients: uniqueClientsSet.size,
      activeBarbersCount: barbers.filter((b) => b.isAvailable).length,
    };

    const barbersPayroll = Object.values(barberStatsAcc).sort((a, b) => b.grossRevenue - a.grossRevenue);

    const servicesBreakdown = Array.from(serviceStatsMap.values()).sort(
      (a, b) => b.totalRevenue - a.totalRevenue
    );

    return sendSuccess(res, 200, 'Datos de nómina y estadísticas obtenidos con éxito.', {
      summary,
      barbersPayroll,
      servicesBreakdown,
      paymentMethods: paymentMethodsMap,
      appointments: enrichedAppointments,
    });
  } catch (error) {
    console.error('Error en getPayrollAndStats:', error);
    return sendError(res, 500, 'Error al calcular la nómina y estadísticas.');
  }
};

// @desc    Registrar liquidación / pago de comisiones a citas de barbero
// @route   PUT /api/admin/payout
// @access  Private / Admin
exports.payoutBarberAppointments = async (req, res) => {
  try {
    const { appointmentIds, markPaid = true } = req.body;

    if (!Array.isArray(appointmentIds) || appointmentIds.length === 0) {
      return sendError(res, 400, 'Debes enviar al menos una cita para liquidar/pagar.');
    }

    const updateFields = {
      commissionPaid: Boolean(markPaid),
      commissionPaidAt: markPaid ? new Date() : null,
    };

    const result = await Appointment.updateMany(
      { _id: { $in: appointmentIds } },
      { $set: updateFields }
    );

    return sendSuccess(res, 200, `Se actualizaron ${result.modifiedCount} citas a ${markPaid ? 'pagado/liquidado' : 'pendiente'}.`, {
      modifiedCount: result.modifiedCount,
      markPaid,
    });
  } catch (error) {
    console.error('Error en payoutBarberAppointments:', error);
    return sendError(res, 500, 'Error al registrar el pago de comisiones.');
  }
};

// @desc    Actualizar porcentaje de comisión de un barbero
// @route   PUT /api/admin/barbers/:barberId/commission
// @access  Private / Admin
exports.updateBarberCommissionRate = async (req, res) => {
  try {
    const { barberId } = req.params;
    const { commissionRate } = req.body;

    const rate = Number(commissionRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      return sendError(res, 400, 'El porcentaje de comisión debe estar entre 0 y 100.');
    }

    let barber = await Barber.findById(barberId);
    if (!barber) {
      barber = await Barber.findOne({ user: barberId });
    }

    if (!barber) {
      return sendError(res, 404, 'Barbero no encontrado.');
    }

    barber.commissionRate = rate;
    await barber.save();

    return sendSuccess(res, 200, `Comisión actualizada al ${rate}% exitosamente.`, {
      barberId: barber._id,
      commissionRate: barber.commissionRate,
    });
  } catch (error) {
    console.error('Error en updateBarberCommissionRate:', error);
    return sendError(res, 500, 'Error al actualizar la comisión del barbero.');
  }
};
