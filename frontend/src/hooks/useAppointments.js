import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';
import toast from 'react-hot-toast';

export const useMyAppointments = (status) => {
  return useQuery({
    queryKey: ['myAppointments', status],
    queryFn: () => appointmentService.getMyHistory(status),
  });
};

export const useBarberAppointments = (date) => {
  return useQuery({
    queryKey: ['barberAppointments', date],
    queryFn: () => appointmentService.getBarberSchedule(date),
  });
};

export const useAvailableSlots = (barberId, date, duration) => {
  return useQuery({
    queryKey: ['availableSlots', barberId, date, duration],
    queryFn: () => appointmentService.getAvailableSlots(barberId, date, duration),
    enabled: !!barberId && !!date,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      toast.success('Cita creada exitosamente');
      queryClient.invalidateQueries(['myAppointments']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear cita');
    }
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: appointmentService.cancel,
    onSuccess: () => {
      toast.success('Cita cancelada');
      queryClient.invalidateQueries(['myAppointments']);
      queryClient.invalidateQueries(['barberAppointments']);
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => appointmentService.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Estado de cita actualizado');
      queryClient.invalidateQueries(['barberAppointments']);
    },
  });
};
