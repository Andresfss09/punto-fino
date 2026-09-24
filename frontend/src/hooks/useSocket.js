import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = localStorage.getItem('pf_token');

  useEffect(() => {
    if (!token) return;

    const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('nueva_cita', (data) => {
      toast.success('Nueva cita programada');
    });

    socketInstance.on('cita_actualizada', (data) => {
      toast.success('Cita actualizada');
    });

    socketInstance.on('cita_cancelada', (data) => {
      toast.error('Cita cancelada');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  return { socket, isConnected };
};
