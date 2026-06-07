const rateLimit = require('express-rate-limit');

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    success: false,
    message: 'Demasiados intentos. Espera 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100,
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Espera un momento.',
  },
});