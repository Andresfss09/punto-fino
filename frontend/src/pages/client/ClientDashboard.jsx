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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#121815] p-6 border border-[#222a26] rounded-[4px] shadow-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="editorial-tag bg-[#161d19] text-gold-400 border-[#2b3530] flex items-center gap-1">
                <Scissors size={12} /> Cliente Punto Fino
              </span>
              <span className="text-xs text-[#808080] font-sans">Cali, Colombia</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif italic font-normal text-white">
              ¡Hola, <span className="text-gold-400">{user?.name ? user.name.split(' ')[0] : 'Cliente'}</span>!
            </h1>
            <p className="text-[#b3b3b3] text-xs sm:text-sm mt-1 font-sans">
              Bienvenido a tu panel de reservas personal en Punto Fino Barbería de Autor
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchAppointments}
              className="btn-secondary text-xs uppercase tracking-wider py-2 px-3.5 flex items-center gap-1.5"
              title="Actualizar datos"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-gold-400' : ''} />
              Refrescar
            </button>
            <Link
              to="/reservar"
              className="btn-primary text-xs uppercase tracking-wider py-2 px-4 flex items-center gap-2 flex-1 sm:flex-none justify-center"
            >
              <CalendarPlus size={15} /> Agendar Cita
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
              <div className="text-center py-16 bg-[#121815] border border-[#1f2723] rounded-[4px]">
                <RefreshCw size={24} className="animate-spin text-gold-400 mx-auto mb-2" />
                <p className="text-[#808080] font-mono text-xs uppercase">Cargando tu próxima cita...</p>
              </div>
            ) : nextAppointment ? (
              <div className="bg-[#121815] border border-gold-400/50 rounded-[4px] p-6 shadow-subtle relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 border-b border-[#1f2723] pb-3 mb-4">
                  <span className="editorial-tag bg-gold-400 text-[#0e1311] border-gold-400 font-semibold text-xs uppercase">
                    👑 Tu Próxima Cita
                  </span>
                  <span className={`editorial-tag ${
                    nextAppointment.status === 'completada'
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                      : nextAppointment.status === 'cancelada'
                      ? 'bg-rose-950/50 text-rose-400 border-rose-800/40'
                      : 'bg-gold-500/10 text-gold-400 border-gold-500/30'
                  }`}>
                    {getStatusLabel(nextAppointment.status)}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl sm:text-3xl font-serif italic text-white font-normal leading-tight">
                    {nextAppointment.services?.map((s) => s.service?.name || 'Servicio').join(' + ')}
                  </h3>
                  <p className="text-xs text-[#808080] font-mono mt-1">
                    Código: <span className="text-gold-400 font-bold">{nextAppointment.confirmationCode}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#161d19] border border-[#26302a] rounded-[4px] mb-5">
                  <div>
                    <p className="text-[#808080] text-[11px] uppercase font-sans tracking-wider mb-1">Fecha</p>
                    <p className="text-sm font-sans font-medium text-white capitalize">
                      {new Date(nextAppointment.date).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#808080] text-[11px] uppercase font-sans tracking-wider mb-1">Hora</p>
                    <p className="text-sm font-mono text-gold-400 font-bold">
                      {nextAppointment.startTime} - {nextAppointment.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#808080] text-[11px] uppercase font-sans tracking-wider mb-1">Barbero Asignado</p>
                    <p className="text-sm font-serif italic text-white">
                      {nextAppointment.barber?.name || 'Por asignar'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#808080] font-sans">Total a pagar:</span>
                    <span className="text-xl font-mono font-bold text-gold-400">
                      {formatPrice(nextAppointment.totalPrice)}
                    </span>
                    <span className="text-[11px] text-[#808080] font-mono">({nextAppointment.paymentMethod || 'Efectivo'})</span>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      to="/cliente/citas"
                      className="px-4 py-2 bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] text-xs font-sans uppercase tracking-wider rounded-[4px] flex-1 sm:flex-none text-center transition-all cursor-pointer"
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
                        className="px-4 py-2 bg-rose-950/40 hover:bg-rose-950/70 text-rose-400 border border-rose-800/40 text-xs font-sans uppercase tracking-wider rounded-[4px] flex-1 sm:flex-none cursor-pointer transition-all"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 bg-[#121815] border border-[#222a26] rounded-[4px] shadow-subtle">
                <Scissors size={32} className="text-gold-400 mx-auto mb-3" />
                <h3 className="text-xl font-serif italic text-white mb-2 font-normal">
                  No tienes citas próximas agendadas
                </h3>
                <p className="text-[#b3b3b3] text-xs max-w-md mx-auto mb-6 font-sans">
                  Elige tu servicio de corte o experiencia, tu barbero de confianza y agenda en Punto Fino en menos de un minuto.
                </p>
                <Link
                  to="/reservar"
                  className="px-6 py-2.5 bg-gold-400 hover:bg-gold-300 text-[#0e1311] font-sans font-semibold text-xs uppercase tracking-wider rounded-[4px] inline-flex items-center gap-2 transition-all shadow-sm"
                >
                  <CalendarPlus size={15} />
                  Agendar Mi Corte Ahora
                </Link>
              </div>
            )}

            {/* Quick Action Navigation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/reservar" className="block group">
                <div className="bg-[#121815] border border-[#222a26] group-hover:border-gold-400/50 rounded-[4px] flex items-center justify-between p-5 transition-all shadow-subtle">
                  <div>
                    <span className="text-[11px] font-sans uppercase text-gold-400 font-medium block mb-1">Cortes & Barba</span>
                    <h3 className="font-serif italic text-lg text-white">Reservar Cita</h3>
                    <p className="text-[#808080] text-xs mt-0.5 font-sans">Elige tu barbero, fecha y hora</p>
                  </div>
                  <div className="w-10 h-10 bg-gold-400 text-[#0e1311] flex items-center justify-center rounded-[4px] group-hover:scale-105 transition-transform">
                    <CalendarPlus size={18} />
                  </div>
                </div>
              </Link>

              <Link to="/cliente/citas" className="block group">
                <div className="bg-[#121815] border border-[#222a26] group-hover:border-gold-400/50 rounded-[4px] flex items-center justify-between p-5 transition-all shadow-subtle">
                  <div>
                    <span className="text-[11px] font-sans uppercase text-[#808080] font-medium block mb-1">Tus Reservas</span>
                    <h3 className="font-serif italic text-lg text-white">Historial de Citas</h3>
                    <p className="text-[#808080] text-xs mt-0.5 font-sans">Ver citas pasadas y activas</p>
                  </div>
                  <div className="w-10 h-10 bg-[#161d19] text-[#dfdbca] flex items-center justify-center border border-[#2b3530] rounded-[4px] group-hover:scale-105 transition-transform">
                    <History size={18} />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Column: Fidelidad & Últimas Citas */}
          <div className="space-y-6">
            {/* Loyalty Card */}
            <div className="bg-[#121815] border border-[#222a26] rounded-[4px] overflow-hidden shadow-subtle">
              <div className="p-4 bg-[#161d19] border-b border-[#222a26] flex items-center justify-between">
                <h3 className="font-serif italic text-base flex items-center gap-2 text-white font-normal">
                  <Star size={15} className="text-gold-400 fill-gold-400" /> Fidelidad Punto Fino
                </h3>
                <span className="text-xs font-mono text-gold-400 font-semibold">{loyaltyTier}</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-[#808080] uppercase tracking-wider font-sans">Puntos Acumulados</span>
                  <span className="font-mono text-2xl text-gold-400 font-bold">
                    {points} <span className="text-xs text-[#808080] font-normal">pts</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#101513] border border-[#222a26] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-[#b3b3b3] leading-relaxed font-sans">
                  Ganas <strong className="text-white">1 punto por cada $1.000 COP</strong> en servicios completados. ¡Canjéalos por beneficios exclusivos en Punto Fino!
                </p>
              </div>
            </div>

            {/* Recents List */}
            <div className="bg-[#121815] border border-[#222a26] rounded-[4px] overflow-hidden shadow-subtle">
              <div className="p-4 bg-[#161d19] border-b border-[#222a26] flex items-center justify-between">
                <h3 className="font-serif italic text-base flex items-center gap-2 text-white font-normal">
                  <History size={15} className="text-[#808080]" /> Actividad Reciente
                </h3>
                <Link to="/cliente/citas" className="text-xs font-sans uppercase tracking-wider text-gold-400 hover:underline">
                  Ver todas
                </Link>
              </div>
              <div className="divide-y divide-[#18201c]">
                {loading ? (
                  <div className="p-6 text-center text-xs text-[#808080] font-mono">Cargando...</div>
                ) : appointments.slice(0, 4).length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#808080] font-mono">Aún no tienes actividad registrada</div>
                ) : (
                  appointments.slice(0, 4).map((apt) => (
                    <div key={apt._id} className="p-4 flex items-center justify-between hover:bg-[#161d19]/60 transition-colors">
                      <div>
                        <p className="text-xs font-sans font-medium text-white">
                          {apt.services?.map((s) => s.service?.name || 'Servicio').join(', ')}
                        </p>
                        <p className="text-[11px] text-[#808080] font-mono mt-0.5">
                          {new Date(apt.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })} • {apt.startTime} • {apt.barber?.name || 'Barbero'}
                        </p>
                      </div>
                      <span className={`editorial-tag ${
                        apt.status === 'completada'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                          : apt.status === 'cancelada'
                          ? 'bg-rose-950/50 text-rose-400 border-rose-800/40'
                          : 'bg-gold-500/10 text-gold-400 border-gold-500/30'
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
          title="Cancelar Cita"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#dfdbca] font-sans leading-relaxed">
              ¿Estás seguro de que deseas cancelar tu cita del{' '}
              <strong className="text-white">
                {selectedAptToCancel?.date && new Date(selectedAptToCancel.date).toLocaleDateString('es-CO')}
              </strong>{' '}
              a las <strong className="text-gold-400">{selectedAptToCancel?.startTime}</strong> con{' '}
              <strong className="text-white">{selectedAptToCancel?.barber?.name}</strong>?
            </p>

            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#808080] mb-1.5">
                Motivo (opcional):
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ej: Cambio de planes, imprevisto laboral..."
                rows={3}
                className="bg-[#161d19] border border-[#26302a] text-white rounded-[4px] p-3 text-xs font-sans w-full focus:outline-none focus:border-gold-400 placeholder:text-[#808080]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#1f2723]">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-[#161d19] hover:bg-[#1f2723] text-[#dfdbca] border border-[#2b3530] text-xs font-sans uppercase tracking-wider rounded-[4px] cursor-pointer transition-all"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-4 py-2 bg-rose-950/60 hover:bg-rose-950/90 text-rose-300 border border-rose-800/60 text-xs font-sans uppercase tracking-wider rounded-[4px] cursor-pointer transition-all shadow-sm"
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