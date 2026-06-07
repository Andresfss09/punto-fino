require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

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