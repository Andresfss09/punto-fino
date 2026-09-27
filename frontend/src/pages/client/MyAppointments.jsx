import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, Star, User, Check, X } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import Modal from '../../components/ui/Modal';
import { appointmentService } from '../../services/appointmentService';
import { reviewService } from '../../services/reviewService';
import { formatTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals state
  const [cancelModal, setCancelModal] = useState({ open: false, appointmentId: null });
  const [cancelReason, setCancelReason] = useState('Cambio de planes');
  
  const [reviewModal, setReviewModal] = useState({ open: false, appointment: null });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAppointments = () => {
    setLoading(true);
    appointmentService.getMyAppointments({ status: statusFilter, limit: 50 })
      .then((res) => setAppointments(res.appointments || []))
      .catch(() => toast.error('Error cargando citas'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await appointmentService.cancel(cancelModal.appointmentId, cancelReason);
      toast.success('Cita cancelada correctamente');
      setCancelModal({ open: false, appointmentId: null });
      setCancelReason('Cambio de planes');
      fetchAppointments();
    } catch (error) {
      toast.error(error.message || 'Error al cancelar la cita');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReview = async () => {
    setActionLoading(true);
    try {
      await reviewService.createReview({
        appointmentId: reviewModal.appointment._id,
        barberId: reviewModal.appointment.barber._id,
        rating: reviewRating,
        comment: reviewComment
      });
      toast.success('¡Reseña enviada! Gracias por tu feedback.');
      setReviewModal({ open: false, appointment: null });
      setReviewRating(5);
      setReviewComment('');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Error al enviar reseña');
    } finally {
      setActionLoading(false);
    }
  };

  const statuses = [
    { value: '', label: 'Todas' },
    { value: 'pendiente', label: 'Pendientes' },
    { value: 'confirmada', label: 'Confirmadas' },
    { value: 'completada', label: 'Completadas' },
    { value: 'cancelada', label: 'Canceladas' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completada':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'confirmada':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'pendiente':
        return 'bg-gold-400/10 text-gold-400 border-gold-400/30';
      case 'cancelada':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-[#141414] text-[#888888] border-[#222222]';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-[#1e1e1e]">
          <div>
            <span className="eyebrow text-gold-400 block mb-1">Historial & Citas</span>
            <h1 className="font-sans font-medium uppercase tracking-[0.16em] text-2xl sm:text-3xl text-white">
              Mis <span className="text-gold-400">Citas</span>
            </h1>
            <p className="text-[#888888] text-xs font-sans mt-1">
              Gestiona tus reservas, consulta el estado o califica a tu barbero.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Filter size={14} className="text-[#888888] flex-shrink-0 mr-1" />
          {statuses.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`px-3.5 py-1.5 rounded-none text-xs font-sans uppercase tracking-[0.16em] transition-all whitespace-nowrap cursor-pointer border ${
                statusFilter === value
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-[#141414] text-[#888888] hover:text-white border-[#222222] hover:border-white/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border border-white border-t-transparent"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 bg-[#0a0a0a] border border-[#1e1e1e] rounded-none p-8">
            <Calendar size={36} className="text-[#444444] mx-auto mb-3" />
            <p className="font-sans font-medium uppercase tracking-[0.16em] text-sm text-white mb-1">Sin Citas Registradas</p>
            <p className="text-[#888888] text-xs font-sans mt-1">Intenta cambiando el filtro o reserva tu próxima experiencia en Punto Fino.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {appointments.map((apt) => (
                <motion.div
                  key={apt._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <div className="bg-[#0a0a0a] border border-[#1e1e1e] hover:border-[#333333] transition-colors rounded-none p-5 sm:p-6 flex flex-col sm:flex-row gap-6">
                    {/* Date/Time Column */}
                    <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-start min-w-[140px] border-b sm:border-b-0 sm:border-r border-[#1e1e1e] pb-4 sm:pb-0 sm:pr-6">
                      <div>
                        <p className="font-mono text-3xl text-white font-medium leading-none mb-1">
                          {new Date(apt.date + 'T12:00:00').getDate().toString().padStart(2, '0')}
                        </p>
                        <p className="text-gold-400 font-sans text-xs uppercase tracking-[0.16em]">
                          {new Date(apt.date + 'T12:00:00').toLocaleDateString('es-CO', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right sm:text-left sm:mt-4">
                        <span className="inline-block px-2.5 py-1 border border-[#222222] bg-[#141414] font-mono text-xs text-white mb-2 rounded-none">
                          {formatTime(apt.startTime)}
                        </span>
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-wider border ${getStatusBadge(apt.status)}`}>
                            {getStatusText(apt.status)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User size={14} className="text-white" />
                          <span className="font-sans font-medium uppercase tracking-[0.14em] text-sm text-white">
                            {apt.barber?.user?.name || 'Barbero Asignado'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {apt.services?.map((s, i) => (
                            <span key={i} className="text-xs bg-[#141414] border border-[#222222] text-[#d4d4d4] px-2.5 py-1 rounded-none font-sans">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#1e1e1e] pt-3 mt-4">
                        <span className="text-[#888888] font-mono text-xs uppercase">
                          Pago: {apt.paymentMethod}
                        </span>
                        <span className="font-mono font-medium text-white text-base">
                          ${apt.totalPrice?.toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex sm:flex-col gap-2 pt-4 sm:pt-0 sm:pl-4 justify-end sm:border-l sm:border-[#1e1e1e]">
                      {(apt.status === 'pendiente' || apt.status === 'confirmada') && (
                        <button
                          onClick={() => setCancelModal({ open: true, appointmentId: apt._id })}
                          className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 text-xs font-sans uppercase tracking-[0.16em] rounded-none transition-colors w-full cursor-pointer"
                        >
                          Cancelar Cita
                        </button>
                      )}
                      
                      {apt.status === 'completada' && !apt.isReviewed && (
                        <button
                          onClick={() => setReviewModal({ open: true, appointment: apt })}
                          className="btn-ferrari-primary text-xs !py-2 !px-4 w-full"
                        >
                          Reseñar
                        </button>
                      )}
                      
                      {apt.status === 'completada' && apt.isReviewed && (
                        <div className="px-4 py-2 border border-[#222222] text-[#888888] font-sans text-xs uppercase tracking-[0.16em] w-full text-center flex items-center justify-center gap-1.5 bg-[#141414] rounded-none">
                          <Check size={13} className="text-emerald-400" />
                          <span>Reseñada</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Cancel Modal */}
      <Modal isOpen={cancelModal.open} onClose={() => setCancelModal({ open: false, appointmentId: null })} title="CANCELAR CITA">
        <div className="space-y-4">
          <p className="text-[#d4d4d4] text-xs font-sans leading-relaxed">
            ¿Estás seguro de que deseas cancelar esta reserva? Por favor cuéntanos el motivo:
          </p>

          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full bg-[#141414] border border-[#222222] text-white focus:border-white/50 rounded-none p-2.5 text-xs outline-none transition-colors font-sans"
          >
            <option value="Cambio de planes">Cambio de planes</option>
            <option value="Imprevisto laboral">Imprevisto laboral</option>
            <option value="Problemas de transporte">Problemas de transporte</option>
            <option value="Deseo cambiar de fecha">Deseo cambiar de fecha</option>
            <option value="Otro motivo">Otro motivo</option>
          </select>

          <div className="flex gap-3 pt-4 border-t border-[#1e1e1e]">
            <button
              onClick={() => setCancelModal({ open: false, appointmentId: null })}
              className="flex-1 bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] py-2 rounded-none text-xs font-sans uppercase tracking-[0.16em] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 py-2 rounded-none text-xs font-sans uppercase tracking-[0.16em] transition-colors cursor-pointer"
            >
              {actionLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal isOpen={reviewModal.open} onClose={() => setReviewModal({ open: false, appointment: null })} title="CALIFICAR SERVICIO">
        <div className="space-y-4">
          <p className="text-[#888888] text-xs font-sans">
            ¿Cómo fue tu experiencia en Punto Fino con {reviewModal.appointment?.barber?.user?.name}?
          </p>

          <div className="flex justify-center gap-2 py-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className="p-1 hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  size={24}
                  className={star <= reviewRating ? 'text-gold-400 fill-gold-400' : 'text-[#262626]'}
                />
              </button>
            ))}
          </div>

          <textarea
            placeholder="Escribe un comentario sobre el corte, la atención y el ambiente (opcional)..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full bg-[#141414] border border-[#222222] text-white focus:border-white/50 rounded-none p-3 text-xs outline-none h-24 resize-none transition-colors font-sans"
          />

          <div className="flex gap-3 pt-4 border-t border-[#1e1e1e]">
            <button
              onClick={() => setReviewModal({ open: false, appointment: null })}
              className="flex-1 bg-[#141414] hover:bg-[#1a1a1a] text-[#888888] hover:text-white border border-[#222222] py-2 rounded-none text-xs font-sans uppercase tracking-[0.16em] transition-colors cursor-pointer"
            >
              Omitir
            </button>
            <button
              onClick={handleReview}
              disabled={actionLoading}
              className="flex-1 btn-ferrari-primary text-xs !py-2"
            >
              {actionLoading ? 'Enviando...' : 'Publicar Reseña'}
            </button>
          </div>
        </div>
      </Modal>
    </PageTransition>
  );
}