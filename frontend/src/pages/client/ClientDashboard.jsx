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
  const loyaltyTier = points >= 500 ? 'Oro VIP' : points >= 200 ? 'Plata' : 'Bronce';
  const nextTierPoints = points >= 500 ? 500 : points >= 200 ? 500 : 200;
  const progressPercent = Math.min(100, Math.round((points / nextTierPoints) * 100));

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0a0a] p-6 border border-[#1e1e1e] rounded-none">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="eyebrow text-gold-400 flex items-center gap-1">
                <Scissors size={12} /> Cliente Triadix
              </span>
              <span className="text-xs text-[#666666] font-mono uppercase tracking-wider">Cali, Colombia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-medium uppercase tracking-[0.16em] text-white">
              ¡Hola, <span className="text-gold-400">{user?.name ? user.name.split(' ')[0] : 'Cliente'}</span>!
            </h1>
            <p className="text-[#888888] text-xs sm:text-sm mt-1 font-sans">
              Bienvenido a tu panel de reservas personal en Triadix Barber Studio.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchAppointments}
              className="bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] text-xs font-sans uppercase tracking-[0.16em] py-2.5 px-3.5 flex items-center gap-1.5 rounded-none transition-colors cursor-pointer"
              title="Actualizar datos"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-white' : ''} />
              Refrescar
            </button>
            <Link
              to="/reservar"
              className="btn-ferrari-primary text-xs !py-2.5 !px-4 flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <CalendarPlus size={14} /> Agendar Cita
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
            <StatsCard icon={Star} label="Puntos Fidelidad" value={points} />
          </motion.div>
        </motion.div>

        {/* Main Grid: Próxima Cita & Acciones Rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* PRÓXIMA CITA CARD */}
            {loading ? (
              <div className="text-center py-16 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none">
                <RefreshCw size={22} className="animate-spin text-white mx-auto mb-2" />
                <p className="text-[#888888] font-mono text-xs uppercase">Cargando tu próxima cita...</p>
              </div>
            ) : nextAppointment ? (
              <div className="bg-[#0a0a0a] border border-white/40 rounded-none p-6 relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 border-b border-[#1e1e1e] pb-3 mb-4">
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider bg-white text-black">
                    Tu Próxima Cita
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider border ${
                    nextAppointment.status === 'completada'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : nextAppointment.status === 'cancelada'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : 'bg-gold-400/10 text-gold-400 border-gold-400/30'
                  }`}>
                    {getStatusLabel(nextAppointment.status)}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-sans font-medium uppercase tracking-[0.14em] text-white leading-tight">
                    {nextAppointment.services?.map((s) => s.service?.name || 'Servicio').join(' + ')}
                  </h3>
                  <p className="text-xs text-[#888888] font-mono mt-1">
                    Código: <span className="text-white font-medium">{nextAppointment.confirmationCode}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#141414] border border-[#222222] rounded-none mb-5">
                  <div>
                    <p className="text-[#888888] text-[10px] uppercase font-sans tracking-[0.16em] mb-1">Fecha</p>
                    <p className="text-xs font-mono font-medium text-white capitalize">
                      {new Date(nextAppointment.date).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#888888] text-[10px] uppercase font-sans tracking-[0.16em] mb-1">Hora</p>
                    <p className="text-xs font-mono text-white font-medium">
                      {nextAppointment.startTime} - {nextAppointment.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#888888] text-[10px] uppercase font-sans tracking-[0.16em] mb-1">Barbero Asignado</p>
                    <p className="text-xs font-sans uppercase tracking-wider text-white">
                      {nextAppointment.barber?.name || 'Por asignar'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#888888] font-sans uppercase tracking-wider">Total a pagar:</span>
                    <span className="text-lg font-mono font-medium text-white">
                      {formatPrice(nextAppointment.totalPrice)}
                    </span>
                    <span className="text-[10px] text-[#888888] font-mono">({nextAppointment.paymentMethod || 'Efectivo'})</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      to="/cliente/citas"
                      className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] text-xs font-sans uppercase tracking-[0.16em] rounded-none flex-1 sm:flex-none text-center transition-all cursor-pointer"
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
                        className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-sans uppercase tracking-[0.16em] rounded-none flex-1 sm:flex-none cursor-pointer transition-all"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none">
                <Scissors size={32} className="text-[#444444] mx-auto mb-3" />
                <h3 className="text-sm font-sans font-medium uppercase tracking-[0.16em] text-white mb-2">
                  No tienes citas próximas agendadas
                </h3>
                <p className="text-[#888888] text-xs max-w-md mx-auto mb-6 font-sans">
                  Elige tu servicio de corte o experiencia, tu barbero de confianza y agenda en Triadix en menos de un minuto.
                </p>
                <Link
                  to="/reservar"
                  className="btn-ferrari-primary text-xs !py-2.5 !px-5 inline-flex items-center gap-2"
                >
                  <CalendarPlus size={14} />
                  Agendar Mi Corte Ahora
                </Link>
              </div>
            )}

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/reservar" className="block group">
                <div className="bg-[#0a0a0a] border border-[#1e1e1e] group-hover:border-[#333333] rounded-none flex items-center justify-between p-5 transition-all">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.16em] text-gold-400 block mb-1">Cortes & Barba</span>
                    <h3 className="font-sans font-medium uppercase tracking-[0.14em] text-sm text-white">Reservar Cita</h3>
                    <p className="text-[#888888] text-xs mt-0.5 font-sans">Elige tu barbero, fecha y hora</p>
                  </div>
                  <div className="btn-circle-arrow group-hover:border-white">
                    <CalendarPlus size={16} />
                  </div>
                </div>
              </Link>

              <Link to="/cliente/citas" className="block group">
                <div className="bg-[#0a0a0a] border border-[#1e1e1e] group-hover:border-[#333333] rounded-none flex items-center justify-between p-5 transition-all">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#888888] block mb-1">Tus Reservas</span>
                    <h3 className="font-sans font-medium uppercase tracking-[0.14em] text-sm text-white">Historial de Citas</h3>
                    <p className="text-[#888888] text-xs mt-0.5 font-sans">Ver citas pasadas y activas</p>
                  </div>
                  <div className="btn-circle-arrow group-hover:border-white">
                    <History size={16} />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Fidelidad & Últimas Citas */}
          <div className="space-y-6">
            {/* Loyalty Card */}
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none overflow-hidden">
              <div className="p-4 bg-[#0e0e0e] border-b border-[#1e1e1e] flex items-center justify-between">
                <h3 className="font-sans font-medium uppercase tracking-[0.16em] text-xs flex items-center gap-2 text-white">
                  <Star size={13} className="text-gold-400 fill-gold-400" /> Fidelidad Triadix
                </h3>
                <span className="text-xs font-mono text-gold-400">{loyaltyTier}</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-[#888888] uppercase tracking-[0.16em] font-sans">Puntos Acumulados</span>
                  <span className="font-mono text-2xl text-white font-medium">
                    {points} <span className="text-xs text-[#888888]">pts</span>
                  </span>
                </div>
                <div className="w-full h-1 bg-[#141414] border border-[#222222] rounded-none overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-500 rounded-none"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-[#888888] leading-relaxed font-sans">
                  Ganas <strong className="text-white">1 punto por cada $1.000 COP</strong> en servicios completados. Canjéalos por beneficios exclusivos.
                </p>
              </div>
            </div>

            {/* Recents List */}
            <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-none overflow-hidden">
              <div className="p-4 bg-[#0e0e0e] border-b border-[#1e1e1e] flex items-center justify-between">
                <h3 className="font-sans font-medium uppercase tracking-[0.16em] text-xs flex items-center gap-2 text-white">
                  <History size={13} className="text-[#888888]" /> Actividad Reciente
                </h3>
                <Link to="/cliente/citas" className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#888888] hover:text-white">
                  Ver todas
                </Link>
              </div>
              <div className="divide-y divide-[#161616]">
                {loading ? (
                  <div className="p-6 text-center text-xs text-[#888888] font-mono">Cargando...</div>
                ) : appointments.slice(0, 4).length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#888888] font-mono">Aún no tienes actividad registrada</div>
                ) : (
                  appointments.slice(0, 4).map((apt) => (
                    <div key={apt._id} className="p-4 flex items-center justify-between hover:bg-[#111111] transition-colors">
                      <div>
                        <p className="text-xs font-sans font-medium text-white">
                          {apt.services?.map((s) => s.service?.name || 'Servicio').join(', ')}
                        </p>
                        <p className="text-[11px] text-[#888888] font-mono mt-0.5">
                          {new Date(apt.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} • {apt.startTime} • {apt.barber?.name || 'Barbero'}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded-none uppercase tracking-wider border ${
                        apt.status === 'completada'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : apt.status === 'cancelada'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-gold-400/10 text-gold-400 border-gold-400/30'
                      }`}>
                        {getStatusLabel(apt.status)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Cancelación */}
        <Modal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          title="CANCELAR CITA"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#d4d4d4] font-sans leading-relaxed">
              ¿Estás seguro de que deseas cancelar tu cita del{' '}
              <strong className="text-white">
                {selectedAptToCancel?.date && new Date(selectedAptToCancel.date).toLocaleDateString('es-CO')}
              </strong>{' '}
              a las <strong className="text-white">{selectedAptToCancel?.startTime}</strong> con{' '}
              <strong className="text-white">{selectedAptToCancel?.barber?.name}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-[0.16em] text-[#888888] mb-1.5">
                Motivo (opcional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Cambio de planes, imprevisto laboral..."
                rows={3}
                className="bg-[#141414] border border-[#222222] text-white rounded-none p-3 text-xs font-sans w-full focus:outline-none focus:border-white/50 placeholder:text-[#666666]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#1e1e1e]">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] text-xs font-sans uppercase tracking-[0.16em] rounded-none cursor-pointer transition-all"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-sans uppercase tracking-[0.16em] rounded-none cursor-pointer transition-all"
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