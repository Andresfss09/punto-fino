const Appointment = require('../models/Appointment');
const Barber = require('../models/Barber');
const Service = require('../models/Service');
const User = require('../models/User');
const { calculateEndTime, generateTimeSlots, sendSuccess, sendError } = require('../utils/helpers');
const { createNotification } = require('../services/notificationService');
const { sendAppointmentConfirmationEmail, sendAppointmentNotificationToBarber } = require('../services/emailService');

// Helper to convert HH:mm to minutes from midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

// Helper to convert minutes from midnight to HH:mm
const minutesToTime = (totalMinutes) => {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

// Helper to parse YYYY-MM-DD cleanly in local timezone without UTC offset shift
const parseLocalDateRange = (dateStr) => {
  if (typeof dateStr === 'string' && dateStr.includes('-')) {
    const parts = dateStr.split('T')[0].split('-').map(Number);
    if (parts.length === 3) {
      const [y, m, d] = parts;
      const start = new Date(y, m - 1, d, 0, 0, 0, 0);
      const end = new Date(y, m - 1, d, 23, 59, 59, 999);
      return { startOfDay: start, endOfDay: end, dayOfWeek: start.getDay(), localDate: start };
    }
  }
  const d = new Date(dateStr);
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return { startOfDay: start, endOfDay: end, dayOfWeek: start.getDay(), localDate: start };
};

// @desc    Crear cita (soporta tanto usuarios autenticados como clientes invitados)
// @route   POST /api/appointments
// @access  Public / Optional Auth
exports.createAppointment = async (req, res) => {
  try {
    let {
      barberId,
      serviceIds,
      date,
      startTime,
      notes,
      paymentMethod,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
    } = req.body;

    // Obtener servicios y calcular totales (soporta ObjectId y nombres)
    const mongoose = require('mongoose');
    const validObjectIds = (serviceIds || []).filter(id => mongoose.Types.ObjectId.isValid(id));
    const services = await Service.find({
      $or: [
        { _id: { $in: validObjectIds } },
        { name: { $in: serviceIds || [] } }
      ],
      isActive: true
    });
    if (services.length === 0) {
      return sendError(res, 404, 'Por favor selecciona al menos un servicio válido.');
    }

    const totalPrice = services.reduce((sum, s) => sum + (s.price || 0), 0);
    const totalDuration = services.reduce((sum, s) => sum + (s.duration || 40), 0);
    const endTime = calculateEndTime(startTime, totalDuration);

    const { startOfDay, endOfDay, localDate } = parseLocalDateRange(date);

    const candidateStartMins = timeToMinutes(startTime);
    const candidateEndMins = candidateStartMins + totalDuration;

    let targetBarberUser = null;
    let targetBarberDoc = null;

    // Si seleccionó un barbero específico
    if (barberId && barberId !== 'any') {
      targetBarberDoc = await Barber.findOne({
        $or: [{ user: barberId }, { _id: barberId }],
      }).populate('user', 'name email phone avatar isActive');

      if (!targetBarberDoc || !targetBarberDoc.isAvailable) {
        return sendError(res, 404, 'El barbero seleccionado no se encuentra disponible.');
      }
      targetBarberUser = targetBarberDoc.user;
    } else {
      // Si seleccionó "Cualquiera", buscar el primer barbero disponible que no tenga conflicto
      const allBarbers = await Barber.find({ isAvailable: true }).populate('user', 'name email phone avatar isActive');
      for (const b of allBarbers) {
        if (!b.user || !b.user.isActive) continue;

        const dayOfWeek = startOfDay.getDay();
        const sched = b.schedule?.find((s) => s.day === dayOfWeek);
        if (sched && !sched.isWorking) continue;

        const bUserIds = [b.user._id, b._id].filter(Boolean);
        const existingApts = await Appointment.find({
          barber: { $in: bUserIds },
          date: { $gte: startOfDay, $lte: endOfDay },
          status: { $nin: ['cancelada', 'no_show'] },
        });

        const conflict = existingApts.some((apt) => {
          const aStart = timeToMinutes(apt.startTime);
          const aEnd = apt.endTime ? timeToMinutes(apt.endTime) : aStart + (apt.totalDuration || 40);
          return candidateStartMins < aEnd && candidateEndMins > aStart;
        });

        if (!conflict) {
          targetBarberUser = b.user;
          targetBarberDoc = b;
          break;
        }
      }

      if (!targetBarberUser) {
        return sendError(res, 400, 'No hay barberos disponibles en el horario seleccionado. Por favor elige otro horario.');
      }
    }

    // Verificar colisión de horario con el barbero asignado
    const barberUserIds = [targetBarberUser._id, targetBarberDoc?._id].filter(Boolean);
    const existingAppointments = await Appointment.find({
      barber: { $in: barberUserIds },
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelada', 'no_show'] },
    });

    const hasConflict = existingAppointments.some((apt) => {
      const aStart = timeToMinutes(apt.startTime);
      const aEnd = apt.endTime ? timeToMinutes(apt.endTime) : aStart + (apt.totalDuration || 40);
      return candidateStartMins < aEnd && candidateEndMins > aStart;
    });

    if (hasConflict) {
      return sendError(
        res,
        400,
        'Ese horario ya está ocupado con este barbero. Por favor elige otra hora.'
      );
    }

    // Manejo de usuario cliente (autenticado o invitado)
    let clientId = req.user?._id || req.user?.id;
    let finalClientName = (req.user?.name || clientName || '').trim();
    let finalClientEmail = (req.user?.email || clientEmail || '').toLowerCase().trim();
    let finalClientPhone = (req.user?.phone || clientPhone || '').trim();
    let finalClientAddress = (clientAddress || req.user?.address || '').trim();
    const isGuest = !req.user;

    if (isGuest) {
      if (!finalClientName) {
        return sendError(res, 400, 'Por favor ingresa tu nombre completo.');
      }
      if (!finalClientEmail || !finalClientEmail.includes('@')) {
        return sendError(res, 400, 'Por favor ingresa un correo electrónico válido.');
      }
      if (!finalClientPhone) {
        return sendError(res, 400, 'Por favor ingresa tu número de teléfono.');
      }

      const digitsOnly = finalClientPhone.replace(/\D/g, '');
      const validPhone = (digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly.padStart(10, '0')) || '3000000000';

      // Buscar si ya existe un usuario con este correo
      let guestUser = await User.findOne({ email: finalClientEmail });
      if (!guestUser) {
        const randomPass = `SH-${Math.random().toString(36).substring(2, 10)}!`;
        guestUser = await User.create({
          name: finalClientName,
          email: finalClientEmail,
          phone: validPhone,
          password: randomPass,
          role: 'cliente',
          isVerified: false,
          address: finalClientAddress,
        });
      } else {
        if (finalClientAddress && !guestUser.address) {
          guestUser.address = finalClientAddress;
          await guestUser.save();
        }
      }
      clientId = guestUser._id;
    } else {
      // Si el usuario ya está autenticado y envió dirección, guardarla
      if (finalClientAddress && !req.user.address) {
        await User.findByIdAndUpdate(clientId, { address: finalClientAddress });
      }
    }

    // Generar código único de confirmación
    const confirmationCode = `SH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const appointment = await Appointment.create({
      client: clientId,
      barber: targetBarberUser._id,
      services: services.map((s) => ({
        service: s._id,
        price: s.price,
        duration: s.duration,
      })),
      date: localDate,
      startTime,
      endTime,
      totalPrice,
      totalDuration,
      notes: notes || '',
      paymentMethod: paymentMethod || 'efectivo',
      confirmationCode,
      clientName: finalClientName,
      clientEmail: finalClientEmail,
      clientPhone: finalClientPhone,
      clientAddress: finalClientAddress,
      isGuest,
    });

    if (clientId) {
      await User.findByIdAndUpdate(clientId, { $inc: { totalAppointments: 1 } });
    }

    // Notificación en la app para el barbero
    await createNotification({
      recipient: targetBarberUser._id,
      type: 'nueva_cita',
      title: '¡Nueva cita reservada!',
      message: `${finalClientName} reservó una cita para el ${localDate.toLocaleDateString('es-CO')} a las ${startTime}.`,
      data: { appointmentId: appointment._id },
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('client', 'name email phone avatar address')
      .populate('barber', 'name email phone avatar')
      .populate('services.service', 'name price duration category');

    // Enviar correos automáticos al cliente y al barbero
    try {
      if (finalClientEmail) {
        sendAppointmentConfirmationEmail(populatedAppointment);
      }
      if (populatedAppointment.barber?.email) {
        sendAppointmentNotificationToBarber(populatedAppointment);
      }
    } catch (emailErr) {
      console.error('Error enviando correos de confirmación:', emailErr);
    }

    return sendSuccess(res, 201, '¡Cita reservada exitosamente! Se envió confirmación al correo.', {
      appointment: populatedAppointment,
      confirmationCode,
    });
  } catch (error) {
    console.error('Error al crear la cita:', error);
    return sendError(res, 500, 'Error al crear la cita.');
  }
};

// @desc    Obtener horarios disponibles
// @route   GET /api/appointments/available-slots
// @access  Public
exports.getAvailableSlots = async (req, res) => {
  try {
    const { barberId, date, duration } = req.query;

    if (!date) {
      return sendError(res, 400, 'La fecha es requerida.');
    }

    const durationMinutes = parseInt(duration, 10) || 40;
    const { startOfDay, endOfDay, dayOfWeek, localDate } = parseLocalDateRange(date);

    // Si seleccionó un barbero específico
    if (barberId && barberId !== 'any') {
      const barber = await Barber.findOne({
        $or: [{ user: barberId }, { _id: barberId }],
      });

      if (!barber || !barber.isAvailable) {
        return sendSuccess(res, 200, 'Barbero no disponible.', { slots: [] });
      }

      const daySchedule = barber.schedule?.find((s) => s.day === dayOfWeek) || {
        isWorking: dayOfWeek !== 0,
        startTime: '09:00',
        endTime: '20:00',
        breakStart: '13:00',
        breakEnd: '14:00',
      };

      if (!daySchedule.isWorking) {
        return sendSuccess(res, 200, 'Sin disponibilidad ese día.', { slots: [] });
      }

      // Obtener citas ya agendadas de ese barbero (buscando tanto por User._id como por Barber._id)
      const bUserIds = [barber.user, barber._id].filter(Boolean);
      const bookedAppointments = await Appointment.find({
        barber: { $in: bUserIds },
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ['cancelada', 'no_show'] },
      }).select('startTime endTime totalDuration');

      const startWorkMins = timeToMinutes(daySchedule.startTime || '09:00');
      const endWorkMins = timeToMinutes(daySchedule.endTime || '20:00');
      const breakStartMins = timeToMinutes(daySchedule.breakStart || '13:00');
      const breakEndMins = timeToMinutes(daySchedule.breakEnd || '14:00');

      const availableSlots = [];
      const now = new Date();
      const isToday = localDate.toDateString() === now.toDateString();
      const currentMinutesToday = now.getHours() * 60 + now.getMinutes() + 15;

      // Evaluar slots cada 30 minutos
      for (let slotMins = startWorkMins; slotMins + durationMinutes <= endWorkMins; slotMins += 30) {
        if (isToday && slotMins < currentMinutesToday) continue;

        const slotEndMins = slotMins + durationMinutes;

        // Verificar descanso / almuerzo
        if (slotMins < breakEndMins && slotEndMins > breakStartMins) continue;

        // Verificar conflicto con citas agendadas
        const hasConflict = bookedAppointments.some((apt) => {
          const aStart = timeToMinutes(apt.startTime);
          const aEnd = apt.endTime ? timeToMinutes(apt.endTime) : aStart + (apt.totalDuration || 40);
          return slotMins < aEnd && slotEndMins > aStart;
        });

        if (!hasConflict) {
          availableSlots.push(minutesToTime(slotMins));
        }
      }

      return sendSuccess(res, 200, 'Slots disponibles obtenidos.', { slots: availableSlots });
    }

    // Si no especificó barbero o es 'any': unir slots de todos los barberos activos
    const allBarbers = await Barber.find({ isAvailable: true });
    const allSlotsSet = new Set();

    const now = new Date();
    const isToday = localDate.toDateString() === now.toDateString();
    const currentMinutesToday = now.getHours() * 60 + now.getMinutes() + 15;

    for (const b of allBarbers) {
      const daySchedule = b.schedule?.find((s) => s.day === dayOfWeek) || {
        isWorking: dayOfWeek !== 0,
        startTime: '09:00',
        endTime: '20:00',
        breakStart: '13:00',
        breakEnd: '14:00',
      };

      if (!daySchedule.isWorking) continue;

      const bUserIds = [b.user, b._id].filter(Boolean);
      const bookedAppointments = await Appointment.find({
        barber: { $in: bUserIds },
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ['cancelada', 'no_show'] },
      }).select('startTime endTime totalDuration');

      const startWorkMins = timeToMinutes(daySchedule.startTime || '09:00');
      const endWorkMins = timeToMinutes(daySchedule.endTime || '20:00');
      const breakStartMins = timeToMinutes(daySchedule.breakStart || '13:00');
      const breakEndMins = timeToMinutes(daySchedule.breakEnd || '14:00');

      for (let slotMins = startWorkMins; slotMins + durationMinutes <= endWorkMins; slotMins += 30) {
        if (isToday && slotMins < currentMinutesToday) continue;

        const slotEndMins = slotMins + durationMinutes;
        if (slotMins < breakEndMins && slotEndMins > breakStartMins) continue;

        const hasConflict = bookedAppointments.some((apt) => {
          const aStart = timeToMinutes(apt.startTime);
          const aEnd = apt.endTime ? timeToMinutes(apt.endTime) : aStart + (apt.totalDuration || 40);
          return slotMins < aEnd && slotEndMins > aStart;
        });

        if (!hasConflict) {
          allSlotsSet.add(minutesToTime(slotMins));
        }
      }
    }

    const sortedSlots = Array.from(allSlotsSet).sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
    return sendSuccess(res, 200, 'Slots disponibles obtenidos.', { slots: sortedSlots });
  } catch (error) {
    console.error('Error en getAvailableSlots:', error);
    return sendError(res, 500, 'Error al obtener horarios disponibles.');
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
      .populate('barber', 'name phone avatar email')
      .populate('services.service', 'name price duration category')
      .sort({ date: -1, startTime: -1 })
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
    const { date, status, startDate, endDate } = req.query;
    const query = { barber: req.user.id };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      query.date = {
        $gte: new Date(start.setHours(0, 0, 0, 0)),
        $lte: new Date(end.setHours(23, 59, 59, 999)),
      };
    } else if (date) {
      const targetDate = new Date(date);
      query.date = {
        $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        $lte: new Date(targetDate.setHours(23, 59, 59, 999)),
      };
    }

    if (status && status !== 'todos') query.status = status;

    const appointments = await Appointment.find(query)
      .populate('client', 'name email phone avatar loyaltyPoints')
      .populate('services.service', 'name price duration category')
      .sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 200, 'Citas del barbero obtenidas.', { appointments });
  } catch (error) {
    return sendError(res, 500, 'Error al obtener citas del barbero.');
  }
};