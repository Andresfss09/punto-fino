require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

// Guardar io en app para usarlo en controladores si es necesario
app.set('io', io);

// Setup sockets
const setupSockets = require('./sockets/appointmentSocket');
setupSockets(io);

// Conectar a la base de datos e iniciar servidor
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 Modo: ${process.env.NODE_ENV}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
  });
};

startServer();

process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err.message);
  server.close(() => process.exit(1));
});