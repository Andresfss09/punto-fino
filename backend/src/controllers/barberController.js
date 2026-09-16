const mongoose = require('mongoose');
const Barber = require('../models/Barber');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
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
    const barber = await Barber.findOne({ user: req.params.userId })
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

    const barber = await Barber.findOneAndUpdate(
      { user: req.user.id },
      { bio, specialties, schedule },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    if (!barber) return sendError(res, 404, 'Perfil de barbero no encontrado.');
    return sendSuccess(res, 200, 'Perfil actualizado.', { barber });
  } catch (error) {
    return sendError(res, 500, 'Error al actualizar perfil.');
  }
};

exports.getBarberStats = async (req, res) => {
  try {
    const barberId = req.params.userId || req.user.id;

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await Appointment.aggregate([
      {
        $match: {
          barber: new mongoose.Types.ObjectId(barberId),
          status: 'completada',
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalAppointments: { $sum: 1 },
          avgTicket: { $avg: '$totalPrice' },
        },
      },
    ]);

    const todayAppointments = await Appointment.find({
      barber: barberId,
      date: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lte: new Date(today.setHours(23, 59, 59, 999)),
      },
      status: { $nin: ['cancelada', 'no_show'] },
    }).countDocuments();

    return sendSuccess(res, 200, 'Stats obtenidas.', {
      stats: stats[0] || { totalRevenue: 0, totalAppointments: 0, avgTicket: 0 },
      todayAppointments,
    });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener estadísticas.');
  }
};