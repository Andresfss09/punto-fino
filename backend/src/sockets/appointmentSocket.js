const jwt = require('jsonwebtoken');

module.exports = (io) => {
  // Middleware de autenticación para sockets
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.user.id}`);

    // Unirse a salas específicas basadas en el rol/id
    socket.join(socket.user.id);
    
    if (socket.user.role === 'barbero') {
      socket.join('barberos');
    } else if (socket.user.role === 'admin') {
      socket.join('admins');
    }

    // Eventos
    socket.on('nueva_cita', (data) => {
      // Reemitir evento
      io.to(data.barberId).emit('nueva_cita', data);
      io.to('admins').emit('nueva_cita', data);
    });

    socket.on('cita_actualizada', (data) => {
      io.to(data.clientId).emit('cita_actualizada', data);
      if (data.barberId) {
        io.to(data.barberId).emit('cita_actualizada', data);
      }
    });

    socket.on('cita_cancelada', (data) => {
      io.to(data.clientId).emit('cita_cancelada', data);
      io.to(data.barberId).emit('cita_cancelada', data);
      io.to('admins').emit('cita_cancelada', data);
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.user.id}`);
    });
  });
};
