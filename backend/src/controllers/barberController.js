const mongoose = require('mongoose');
const Barber = require('../models/Barber');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const { sendSuccess, sendError } = require('../utils/helpers');

exports.getAllBarbers = async (req, res) => {
  try {
    const barbers = await Barber.find({ isAvailable: true })
      .populate('user', 'name email phone avatar')
      .select('-blockedSlots -vacationDates -earnings');

    return sendSuccess(res, 200, 'Barberos obtenidos.', { barbers });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener barberos.');
  }
};

exports.getBarber = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.userId);
    const query = isObjectId
      ? { $or: [{ user: req.params.userId }, { _id: req.params.userId }] }
      : { user: req.params.userId };

    const barber = await Barber.findOne(query)
      .populate('user', 'name email phone avatar')
      .populate({
        path: 'portfolio',
        options: { sort: { createdAt: -1 }, limit: 12 },
      });

    if (!barber) return sendError(res, 404, 'Barbero no encontrado.');
    return sendSuccess(res, 200, 'Barbero obtenido.', { barber });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener barbero.');
  }
};

exports.updateBarberProfile = async (req, res) => {
  try {
    const { bio, specialties, schedule } = req.body;

    const DAY_MAP = {
      sunday: 0, domingo: 0, 0: 0,
      monday: 1, lunes: 1, 1: 1,
      tuesday: 2, martes: 2, 2: 2,
      wednesday: 3, miercoles: 3, miércoles: 3, 3: 3,
      thursday: 4, jueves: 4, 4: 4,
      friday: 5, viernes: 5, 5: 5,
      saturday: 6, sabado: 6, sábado: 6, 6: 6,
    };

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (specialties !== undefined) updateData.specialties = specialties;

    if (schedule !== undefined) {
      const formattedSchedule = [];
      if (Array.isArray(schedule)) {
        for (const item of schedule) {
          const dayNum = typeof item.day === 'string'
            ? (DAY_MAP[item.day.toLowerCase()] ?? Number(item.day))
            : item.day;
          if (dayNum !== undefined && !isNaN(dayNum)) {
            formattedSchedule.push({
              day: dayNum,
              isWorking: item.isWorking !== false,
              startTime: item.startTime || '09:00',
              endTime: item.endTime || '20:00',
              breakStart: item.breakStart || item.breakStartTime || '13:00',
              breakEnd: item.breakEnd || item.breakEndTime || '14:00',
            });
          }
        }
      } else if (schedule && typeof schedule === 'object') {
        for (const [key, val] of Object.entries(schedule)) {
          const dayNum = DAY_MAP[key.toLowerCase()];
          if (dayNum !== undefined && val) {
            formattedSchedule.push({
              day: dayNum,
              isWorking: val.isWorking !== false,
              startTime: val.startTime || '09:00',
              endTime: val.endTime || '20:00',
              breakStart: val.breakStart || val.breakStartTime || '13:00',
              breakEnd: val.breakEnd || val.breakEndTime || '14:00',
            });
          }
        }
      }
      updateData.schedule = formattedSchedule;
    }

    const barber = await Barber.findOneAndUpdate(
      { $or: [{ user: req.user.id }, { _id: req.user.id }] },
      updateData,
      { returnDocument: 'after', runValidators: true }
    ).populate('user', 'name avatar');

    if (!barber) return sendError(res, 404, 'Perfil de barbero no encontrado.');
    return sendSuccess(res, 200, 'Perfil actualizado.', { barber });
  } catch (error) {
    console.error('Error al actualizar perfil de barbero:', error);
    return sendError(res, 500, 'Error al actualizar perfil.');
  }
};

exports.getBarberStats = async (req, res) => {
  try {
    const rawBarberId = (req.user && req.user.role === 'admin' && req.params.userId && req.params.userId !== 'me')
      ? req.params.userId
      : req.user.id;

    if (!mongoose.Types.ObjectId.isValid(rawBarberId)) {
      return sendError(res, 400, 'ID de barbero inválido.');
    }

    const barberObjectId = new mongoose.Types.ObjectId(rawBarberId);

    const now = new Date();
    // Start & End of Today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Start & End of Current Week (Monday to Sunday)
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Start & End of Current Month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const [statsSummary] = await Appointment.aggregate([
      {
        $facet: {
          today: [
            {
              $match: {
                barber: barberObjectId,
                status: 'completada',
                date: { $gte: startOfDay, $lte: endOfDay },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: '$totalPrice' },
              },
            },
          ],
          thisWeek: [
            {
              $match: {
                barber: barberObjectId,
                status: 'completada',
                date: { $gte: startOfWeek, $lte: endOfWeek },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: '$totalPrice' },
              },
            },
          ],
          thisMonth: [
            {
              $match: {
                barber: barberObjectId,
                status: 'completada',
                date: { $gte: startOfMonth, $lte: endOfMonth },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
                revenue: { $sum: '$totalPrice' },
              },
            },
          ],
          pendingToday: [
            {
              $match: {
                barber: barberObjectId,
                status: { $in: ['pendiente', 'confirmada', 'en_progreso'] },
                date: { $gte: startOfDay, $lte: endOfDay },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          totalScheduledToday: [
            {
              $match: {
                barber: barberObjectId,
                status: { $nin: ['cancelada', 'no_show'] },
                date: { $gte: startOfDay, $lte: endOfDay },
              },
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // Range calculation if startDate and endDate provided
    let rangeStats = {
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      totalCuts: 0,
      totalRevenue: 0,
      totalAppointments: 0,
      uniqueClients: 0,
      appointments: [],
    };

    if (req.query.startDate && req.query.endDate) {
      const rangeStart = new Date(req.query.startDate);
      rangeStart.setHours(0, 0, 0, 0);
      const rangeEnd = new Date(req.query.endDate);
      rangeEnd.setHours(23, 59, 59, 999);

      const queryRange = {
        barber: barberObjectId,
        date: { $gte: rangeStart, $lte: rangeEnd },
      };

      if (req.query.status && req.query.status !== 'todos') {
        queryRange.status = req.query.status;
      }

      const appointmentsInRange = await Appointment.find(queryRange)
        .populate('client', 'name email phone avatar loyaltyPoints')
        .populate('services.service', 'name price duration category')
        .sort({ date: -1, startTime: -1 });

      const completedInRange = appointmentsInRange.filter(a => a.status === 'completada');
      const revenueInRange = completedInRange.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
      const clientsSet = new Set(
        appointmentsInRange
          .map(a => a.client?._id?.toString() || (a.client ? a.client.toString() : null))
          .filter(Boolean)
      );

      rangeStats = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        totalCuts: completedInRange.length,
        totalRevenue: revenueInRange,
        totalAppointments: appointmentsInRange.length,
        uniqueClients: clientsSet.size,
        appointments: appointmentsInRange,
      };
    }

    return sendSuccess(res, 200, 'Estadísticas del barbero obtenidas.', {
      cutsToday: statsSummary?.today[0]?.count || 0,
      revenueToday: statsSummary?.today[0]?.revenue || 0,
      cutsThisWeek: statsSummary?.thisWeek[0]?.count || 0,
      revenueThisWeek: statsSummary?.thisWeek[0]?.revenue || 0,
      cutsThisMonth: statsSummary?.thisMonth[0]?.count || 0,
      revenueThisMonth: statsSummary?.thisMonth[0]?.revenue || 0,
      pendingToday: statsSummary?.pendingToday[0]?.count || 0,
      totalScheduledToday: statsSummary?.totalScheduledToday[0]?.count || 0,
      rangeStats,
    });
  } catch (error) {
    console.error('Error en getBarberStats:', error);
    return sendError(res, 500, 'Error al obtener estadísticas del barbero.');
  }
};