import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Star, 
  History, 
  CalendarPlus, 
  Scissors, 
  User as UserIcon, 
  Phone, 
  RefreshCw, 
  ArrowRight,
  AlertCircle,
  X
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import BrutalCard from '../../components/ui/BrutalCard';
import StatsCard from '../../components/ui/StatsCard';
import PageTransition from '../../components/ui/PageTransition';
import Modal from '../../components/ui/Modal';
import { appointmentService } from '../../services/appointmentService';
import { formatPrice, formatDate, formatTime, getStatusColor, getStatusLabel } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAptToCancel, setSelectedAptToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Fetch client appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await appointmentService.getMyAppointments({ limit: 20 });
      const list = res.appointments || res.data?.appointments || [];
      setAppointments(list);
    } catch (error) {
      console.error('Error cargando citas del cliente:', error);
      toast.error('No se pudieron cargar tus citas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Handle Cancel
  const handleConfirmCancel = async () => {
    if (!selectedAptToCancel) return;
    try {
      setCancelling(true);
      await appointmentService.cancel(selectedAptToCancel._id, cancelReason);
      toast.success('Tu cita ha sido cancelada.');
      setCancelModalOpen(false);
      setSelectedAptToCancel(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      toast.error(error.response?.data?.message || 'Error al cancelar la cita');
    } finally {
      setCancelling(false);
    }
  };

  // Metrics calculations
  const totalAppointments = appointments.length;
  const activeStatuses = ['pendiente', 'confirmada', 'en_progreso'];
  const upcomingAppointments = appointments.filter((a) => activeStatuses.includes(a.status));
  const completedAppointments = appointments.filter((a) => a.status === 'completada');

  // Next Appointment (closest active appointment)
  const nextAppointment = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

  // Loyalty calculations
  const points = user?.loyaltyPoints || 0;
  const loyaltyTier = points >= 500 ? 'Oro VIP 👑' : points >= 200 ? 'Plata 💈' : 'Bronce ✂️';
  const nextTierPoints = points >= 500 ? 500 : points >= 200 ? 500 : 200;
  const progressPercent = Math.min(100, Math.round((points / nextTierPoints) * 100));

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111111] p-6 border-2 border-[#333] shadow-[4px_4px_0_#333]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="brutal-badge bg-gold-500/10 text-gold-500 border-gold-500/30 flex items-center gap-1">
                <Scissors size={12} /> Cliente Steel House
              </span>
              <span className="text-xs text-gray-400 font-mono">Cali, Colombia</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-wider text-white">
              ¡HOLA, <span className="text-gold-500">{user?.name ? user.name.split(' ')[0] : 'CLIENTE'}</span>!
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-sans">
              Bienvenido a tu panel de reservas personal en Steel House Barberia's
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchAppointments}
              className="brutal-btn bg-dark-300 text-white border-[#333] px-3.5 py-2 flex items-center gap-1.5 hover:border-gold-500 text-xs font-mono uppercase"
              title="Actualizar datos"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-gold-500' : ''} />
              Refrescar
            </button>
            <Link
              to="/reservar"
              className="brutal-btn-primary px-5 py-2.5 text-xs font-bold uppercase flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <CalendarPlus size={16} /> Agendar Cita
            </Link>
          </div>
        </div>

        {/* Counter KPI Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <motion.div variants={item}>
            <StatsCard icon={Calendar} label="Total Citas" value={totalAppointments} />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard icon={Clock} label="Próximas" value={upcomingAppointments.length} />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard icon={CheckCircle} label="Completadas" value={completedAppointments.length} />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard icon={Star} label="Puntos Fidelidad" value={points} className="border-gold-500" />
          </motion.div>
        </motion.div>

        {/* Main Grid: Próxima Cita & Acciones Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* PRÓXIMA CITA CARD */}
            {loading ? (
              <div className="text-center py-16 bg-[#111111] border-2 border-[#333]">
                <RefreshCw size={28} className="animate-spin text-gold-500 mx-auto mb-2" />
                <p className="text-gray-400 font-mono text-xs uppercase">Cargando tu próxima cita...</p>
              </div>
            ) : nextAppointment ? (
              <BrutalCard variant="gold" className="relative overflow-hidden p-6">
                <div className="flex items-center justify-between gap-2 border-b-2 border-[#333] pb-3 mb-4">
                  <span className="brutal-badge bg-gold-500 text-black border-black font-bold text-xs uppercase">
                    👑 Tu Próxima Cita
                  </span>
                  <span className={`brutal-badge ${getStatusColor(nextAppointment.status)}`}>
                    {getStatusLabel(nextAppointment.status)}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl font-display font-bold uppercase text-white leading-tight">
                    {nextAppointment.services?.map((s) => s.service?.name || 'Servicio').join(' + ')}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    Código: <span className="text-gold-500 font-bold">{nextAppointment.confirmationCode}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#0d0d0d] border-2 border-[#222] font-mono-price mb-5">
                  <div>
                    <p className="text-gray-500 text-[11px] uppercase font-sans font-bold mb-1">Fecha</p>
                    <p className="text-base text-white capitalize">
                      {new Date(nextAppointment.date).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[11px] uppercase font-sans font-bold mb-1">Hora</p>
                    <p className="text-base text-gold-500 font-bold">
                      {nextAppointment.startTime} - {nextAppointment.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[11px] uppercase font-sans font-bold mb-1">Barbero Asignado</p>
                    <p className="text-base text-white uppercase">
                      {nextAppointment.barber?.name || 'Por asignar'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">Total a pagar:</span>
                    <span className="text-xl font-mono-price font-bold text-gold-400">
                      {formatPrice(nextAppointment.totalPrice)}
                    </span>
                    <span className="text-[11px] text-gray-500 font-mono">({nextAppointment.paymentMethod || 'Efectivo'})</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      to="/cliente/citas"
                      className="brutal-btn bg-dark-300 text-gray-200 border-[#333] hover:border-gold-500 px-4 py-2 uppercase font-bold text-xs flex-1 sm:flex-none text-center"
                    >
                      Ver Detalles
                    </Link>
                    {['pendiente', 'confirmada'].includes(nextAppointment.status) && (
                      <button
                        onClick={() => {
                          setSelectedAptToCancel(nextAppointment);
                          setCancelReason('');
                          setCancelModalOpen(true);
                        }}
                        className="brutal-btn bg-red-500/10 text-red-400 border-red-500/40 hover:bg-red-500/20 px-4 py-2 uppercase font-bold text-xs flex-1 sm:flex-none"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </BrutalCard>
            ) : (
              <BrutalCard variant="default" className="text-center p-8 border-2 border-[#333]">
                <Scissors size={40} className="text-gold-500 mx-auto mb-3" />
                <h3 className="text-xl font-display font-bold uppercase text-white mb-2">
                  No tienes citas próximas agendadas
                </h3>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  Elige tu servicio favorito, escoge tu barbero de confianza y reserva tu horario en Steel House en menos de un minuto.
                </p>
                <Link
                  to="/reservar"
                  className="brutal-btn-primary px-8 py-3.5 text-sm font-bold uppercase inline-flex items-center gap-2"
                >
                  <CalendarPlus size={18} />
                  Agendar Mi Corte Ahora
                </Link>
              </BrutalCard>
            )}

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/reservar" className="block group">
                <BrutalCard variant="interactive" className="flex items-center justify-between p-6 group-hover:border-gold-500 transition-all">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-gold-500 font-bold block mb-1">Cortes & Barba</span>
                    <h3 className="font-display font-bold uppercase text-lg text-white">Reservar Cita</h3>
                    <p className="text-gray-400 text-xs mt-1">Elige tu barbero, fecha y hora</p>
                  </div>
                  <div className="w-12 h-12 bg-gold-500 text-black flex items-center justify-center border-2 border-black group-hover:scale-105 transition-transform shadow-[2px_2px_0_#d4af37]">
                    <CalendarPlus size={22} />
                  </div>
                </BrutalCard>
              </Link>

              <Link to="/cliente/citas" className="block group">
                <BrutalCard variant="interactive" className="flex items-center justify-between p-6 group-hover:border-gold-500 transition-all">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-gray-400 font-bold block mb-1">Tus Reservas</span>
                    <h3 className="font-display font-bold uppercase text-lg text-white">Historial de Citas</h3>
                    <p className="text-gray-400 text-xs mt-1">Ver citas pasadas y activas</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1a1a1a] text-white flex items-center justify-center border-2 border-[#333] group-hover:scale-105 transition-transform">
                    <History size={22} />
                  </div>
                </BrutalCard>
              </Link>
            </div>
          </div>

          {/* Right Column: Fidelidad & Últimas Citas */}
          <div className="space-y-6">
            {/* Loyalty Card */}
            <BrutalCard padding={false} className="overflow-hidden">
              <div className="p-4 bg-[#141414] border-b-2 border-[#333] flex items-center justify-between">
                <h3 className="font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2 text-white">
                  <Star size={16} className="text-gold-500 fill-gold-500" /> Fidelidad Steel House
                </h3>
                <span className="text-xs font-mono text-gold-400 font-bold">{loyaltyTier}</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-400 uppercase font-bold">Puntos Acumulados</span>
                  <span className="font-mono-price text-2xl text-gold-500 font-bold">
                    {points} <span className="text-xs text-gray-400 font-normal">pts</span>
                  </span>
                </div>
                <div className="w-full h-3 bg-[#0d0d0d] border-2 border-[#333] overflow-hidden">
                  <div
                    className="h-full bg-gold-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Ganas <strong className="text-white">1 punto por cada $1.000 COP</strong> en servicios completados. ¡Canjéalos por descuentos exclusivos en Steel House!
                </p>
              </div>
            </BrutalCard>

            {/* Recents List */}
            <BrutalCard padding={false} className="overflow-hidden">
              <div className="p-4 bg-[#141414] border-b-2 border-[#333] flex items-center justify-between">
                <h3 className="font-display font-bold uppercase tracking-wider text-sm flex items-center gap-2 text-white">
                  <History size={16} className="text-gray-400" /> Actividad Reciente
                </h3>
                <Link to="/cliente/citas" className="text-xs font-mono text-gold-500 hover:underline">
                  Ver todas
                </Link>
              </div>
              <div className="divide-y-2 divide-dashed divide-[#222]">
                {loading ? (
                  <div className="p-6 text-center text-xs text-gray-500 font-mono">Cargando...</div>
                ) : appointments.slice(0, 4).length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500 font-mono">Aún no tienes actividad registrada</div>
                ) : (
                  appointments.slice(0, 4).map((apt) => (
                    <div key={apt._id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div>
                        <p className="font-bold uppercase text-xs text-white">
                          {apt.services?.map((s) => s.service?.name || 'Servicio').join(', ')}
                        </p>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                          {new Date(apt.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} • {apt.startTime} • {apt.barber?.name || 'Barbero'}
                        </p>
                      </div>
                      <span className={`brutal-badge text-[10px] ${getStatusColor(apt.status)}`}>
                        {getStatusLabel(apt.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </BrutalCard>
          </div>
        </div>

        {/* Modal de Cancelación */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="Cancelar Cita"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              ¿Estás seguro de que deseas cancelar tu cita del{' '}
              <strong className="text-white">
                {selectedAptToCancel?.date && new Date(selectedAptToCancel.date).toLocaleDateString('es-CO')}
              </strong>{' '}
              a las <strong className="text-gold-500">{selectedAptToCancel?.startTime}</strong> con{' '}
              <strong className="text-white uppercase">{selectedAptToCancel?.barber?.name}</strong>?
            </p>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-400 font-mono mb-2">
                Motivo (opcional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Cambio de planes, imprevisto laboral..."
                rows={3}
                className="brutal-input w-full text-sm bg-[#0d0d0d]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#333]">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="brutal-btn bg-dark-300 text-gray-300 border-[#333] px-4 py-2 text-xs font-bold uppercase"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="brutal-btn bg-red-600 text-white border-black px-4 py-2 text-xs font-bold uppercase shadow-[3px_3px_0_#991b1b]"
              >
                {cancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}