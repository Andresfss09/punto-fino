const { check, param, validationResult } = require('express-validator');

// Helper para procesar errores
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

exports.validateRegister = [
  check('name', 'El nombre es obligatorio').notEmpty(),
  check('email', 'Incluye un correo válido').isEmail(),
  check('phone', 'El teléfono es obligatorio').notEmpty(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  validate
];

exports.validateLogin = [
  check('email', 'Incluye un correo válido').isEmail(),
  check('password', 'La contraseña es obligatoria').exists(),
  validate
];

exports.validateAppointment = [
  check('barberId', 'El ID del barbero es obligatorio').notEmpty(),
  check('serviceIds', 'Debe seleccionar al menos un servicio').isArray({ min: 1 }),
  check('date', 'La fecha es obligatoria').notEmpty(),
  check('startTime', 'La hora de inicio es obligatoria').notEmpty(),
  validate
];

exports.validateService = [
  check('name', 'El nombre es obligatorio').notEmpty(),
  check('price', 'El precio es obligatorio y debe ser numérico').isNumeric(),
  check('duration', 'La duración es obligatoria y debe ser numérica').isNumeric(),
  check('category', 'La categoría es obligatoria').notEmpty(),
  validate
];

exports.validateReview = [
  check('rating', 'La calificación debe estar entre 1 y 5').isInt({ min: 1, max: 5 }),
  check('comment', 'El comentario es obligatorio').notEmpty(),
  validate
];

exports.validateObjectId = (paramName) => [
  param(paramName, 'ID inválido').isMongoId(),
  validate
];
