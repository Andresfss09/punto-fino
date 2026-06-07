const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generar JWT
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generar token aleatorio
exports.generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Calcular hora de fin de cita
exports.calculateEndTime = (startTime, durationMinutes) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};

// Generar slots de tiempo disponibles
exports.generateTimeSlots = (startTime, endTime, duration, bookedSlots = []) => {
  const slots = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current + duration <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    if (!bookedSlots.includes(time)) {
      slots.push(time);
    }

    current += duration;
  }

  return slots;
};

// Formatear precio colombiano
exports.formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
};

// Respuesta de éxito estándar
exports.sendSuccess = (res, statusCode, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

// Respuesta de error estándar
exports.sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};