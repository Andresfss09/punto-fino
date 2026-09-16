const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const User = require('../models/User');
const { calculateEndTime, generateTimeSlots, sendSuccess, sendError } = require('../utils/helpers');
const { createNotification } = require('../services/notificationService');
const { sendAppointmentConfirmationEmail } = require('../services/emailService');

// @desc    Crear cita
// @route   POST /api/appointments
// @access  Private (cliente)
exports.createAppointment = async (req, res) => {
  try {
    const { barberId, serviceIds, date, startTime, notes, paymentMethod } = req.body;

    // Verificar que el barbero existe
    const barber = await Barber.findOne({ user: barberId });
    if (!barber || !barber.isAvailable) {
      return sendError(res, 404, 'Barbero no disponible.');
    }

    // Obtener servicios y calcular totales
    const services = await Service.find({ _id: { $in: serviceIds }, isActive: true });
    if (services.length === 0) {
      return sendError(res, 404, 'Servicios no encontrados.');
    }

    const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
    const endTime = calculateEndTime(startTime, totalDuration);

    // Verificar disponibilidad del horario
    const appointmentDate = new Date(date);
    const existingAppointment = await Appointment.findOne({
      barber: barberId,
      date: {
        $gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
        $lte: new Date(appointmentDate.setHours(23, 59, 59, 999)),
      },
      startTime: startTime,
      status: { $nin: ['cancelada', 'no_show'] },
    });

    if (existingAppointment) {
      return sendError(res, 400, 'Ese horario ya está ocupado. Elige otro.');
    }

    const appointment = await Appointment.create({
      client: req.user.id,
      barber: barberId,
      services: services.map((s) => ({
        service: s._id,
        price: s.price,
        duration: s.duration,
      })),
      date: new Date(date),
      startTime,
      endTime,
      totalPrice,
      totalDuration,
      notes,
      paymentMethod: paymentMethod || 'efectivo',
    });

    // Sumar cita al contador del usuario
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalAppointments: 1 } });

    // Notificar al barbero
    await createNotification({
      recipient: barberId,
      type: 'nueva_cita',
      title: '¡Nueva cita reservada!',
      message: `${req.user.name} reservó una cita para el ${new Date(date).toLocaleDateString('es-CO')} a las ${startTime}.`,
      data: { appointmentId: appointment._id },
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('client', 'name email phone avatar')
      .populate('barber', 'name avatar')
      .populate('services.service', 'name price duration category');

    // Enviar email de confirmación
    if (populatedAppointment.client.email) {
      sendAppointmentConfirmationEmail(populatedAppointment).catch(err => console.error('Error sending email:', err));
    }

    return sendSuccess(res, 201, 'Cita reservada exitosamente.', {
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Error al crear la cita.');
  }
};

// @desc    Obtener horarios disponibles
// @route   GET /api/appointments/available-slots
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    const { barberId, date, duration } = req.query;

    if (!barberId || !date || !duration) {
      return sendError(res, 400, 'barberId, date y duration son requeridos.');
    }

    const barber = await Barber.findOne({ user: barberId });
    if (!barber) {
      return sendError(res, 404, 'Barbero no encontrado.');
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    const daySchedule = barber.schedule.find((s) => s.day === dayOfWeek);

    if (!daySchedule || !daySchedule.isWorking) {
      return sendSuccess(res, 200, 'Sin disponibilidad ese día.', { slots: [] });
    }

    // Obtener citas del día
    const bookedAppointments = await Appointment.find({
      barber: barberId,
      date: {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lte: new Date(targetDate.setHours(23, 59, 59, 999)),
      },
      status: { $nin: ['cancelada', 'no_show'] },
    }).select('startTime endTime totalDuration');

    const bookedTimes = bookedAppointments.map((a) => a.startTime);

    // Generar slots disponibles
    const allSlots = generateTimeSlots(
      daySchedule.startTime,
      daySchedule.endTime,
      parseInt(duration),
      bookedTimes
    );

    // Filtrar break
    const availableSlots = allSlots.filter((slot) => {
      const [h, m] = slot.split(':').map(Number);
      const slotMinutes = h * 60 + m;
      const [bsH, bsM] = daySchedule.breakStart.split(':').map(Number);
      const [beH, beM] = daySchedule.breakEnd.split(':').map(Number);
      const breakStart = bsH * 60 + bsM;
      const breakEnd = beH * 60 + beM;
      return slotMinutes < breakStart || slotMinutes >= breakEnd;
    });

    return sendSuccess(res, 200, 'Slots disponibles obtenidos.', { slots: availableSlots });
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Error al obtener horarios.');
  }
};

// @desc    Obtener mis citas (cliente)
// @route   GET /api/appointments/my-appointments
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { client: req.user.id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('barber', 'name avatar')
      .populate('services.service', 'name price category')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    return sendSuccess(res, 200, 'Citas obtenidas.', {
      appointments,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener citas.');
  }
};

// @desc    Cancelar cita
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return sendError(res, 404, 'Cita no encontrada.');
    }

    const isOwner = appointment.client.toString() === req.user.id;
    const isBarber = appointment.barber.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isBarber && !isAdmin) {
      return sendError(res, 403, 'No tienes permiso para cancelar esta cita.');
    }

    if (['completada', 'cancelada'].includes(appointment.status)) {
      return sendError(res, 400, 'Esta cita no se puede cancelar.');
    }

    appointment.status = 'cancelada';
    appointment.cancelReason = req.body.reason || 'Sin razón especificada';
    appointment.cancelledBy = req.user.id;
    await appointment.save();

    // Notificar al cliente si cancela el barbero/admin
    if (isBarber || isAdmin) {
      await createNotification({
        recipient: appointment.client,
        type: 'cita_cancelada',
        title: 'Tu cita fue cancelada',
        message: `Tu cita del ${new Date(appointment.date).toLocaleDateString('es-CO')} a las ${appointment.startTime} fue cancelada.`,
        data: { appointmentId: appointment._id },
      });
    }

    return sendSuccess(res, 200, 'Cita cancelada.', { appointment });
  } catch (error) {
    return sendError(res, 500, 'Error al cancelar la cita.');
  }
};

// @desc    Actualizar estado de cita (barbero/admin)
// @route   PUT /api/appointments/:id/status
// @access  Private (barbero, admin)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmada', 'en_progreso', 'completada', 'no_show'];

    if (!validStatuses.includes(status)) {
      return sendError(res, 400, 'Estado inválido.');
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('client', 'name email')
      .populate('barber', 'name');

    if (!appointment) {
      return sendError(res, 404, 'Cita no encontrada.');
    }

    // Si se completó, dar puntos de fidelidad al cliente
    if (status === 'completada') {
      const points = Math.floor(appointment.totalPrice / 1000);
      await User.findByIdAndUpdate(appointment.client, { $inc: { loyaltyPoints: points } });

      await createNotification({
        recipient: appointment.client._id,
        type: 'cita_completada',
        title: '¡Cita completada!',
        message: `Ganaste ${points} puntos de fidelidad. ¡Gracias por visitarnos!`,
        data: { appointmentId: appointment._id, points },
      });
    }

    return sendSuccess(res, 200, 'Estado actualizado.', { appointment });
  } catch (error) {
    return sendError(res, 500, 'Error al actualizar estado.');
  }
};

// @desc    Obtener citas del barbero
// @route   GET /api/appointments/barber-appointments
// @access  Private (barbero)
exports.getBarberAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;
    const query = { barber: req.user.id };

    if (date) {
      const targetDate = new Date(date);
      query.date = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lte: new Date(targetDate.setHours(23, 59, 59, 999)),
      };
    }

    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('client', 'name phone avatar loyaltyPoints')
      .populate('services.service', 'name price duration category')
      .sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 200, 'Citas del barbero obtenidas.', { appointments });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener citas del barbero.');
  }
};