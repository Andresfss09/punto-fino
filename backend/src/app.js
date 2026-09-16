const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { apiLimiter } = require('./middlewares/rateLimit');

const app = express();

// Seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use('/api/', apiLimiter);

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/barbers', require('./routes/barberRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Punto Fino API funcionando ✅', time: new Date() });
});

// Manejador de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor.',
  });
});

module.exports = app;